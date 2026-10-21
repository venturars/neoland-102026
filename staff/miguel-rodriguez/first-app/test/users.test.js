import test from "node:test";
import assert from "node:assert/strict";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const source = fileURLToPath(new URL("../", import.meta.url));
const workingPath = join(source, "db/users.sqlite");
const before = existsSync(workingPath) ? readFileSync(workingPath) : null;
const imports = `
  import assert from "node:assert/strict";
  import { db } from "./db/connection.js";
  import { createUsersTable, findById } from "./queries/users.js";
  import { createUser } from "./logic/create-user.js";
  import { updateUser } from "./logic/update-user.js";
  import { deleteUser } from "./logic/delete-user.js";
  import { listUsers } from "./logic/list-users.js";
  import { findUserByEmail } from "./logic/find-user-by-email.js";
`;

function project(t) {
  const directory = mkdtempSync(join(tmpdir(), "miguel-first-app-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  for (const name of ["package.json", "logic", "queries", "clients"]) {
    cpSync(join(source, name), join(directory, name), { recursive: true });
  }
  mkdirSync(join(directory, "db"));
  cpSync(join(source, "db/connection.js"), join(directory, "db/connection.js"));
  return directory;
}

function run(directory, code, status = 0) {
  const result = spawnSync(process.execPath, ["--input-type=module"], {
    cwd: directory, input: code, encoding: "utf8", timeout: 10000,
  });
  assert.ifError(result.error);
  assert.equal(result.status, status, result.stderr);
  return result;
}

function check(directory, code) {
  const result = run(directory, `${imports} try { ${code} } finally { db.close(); }`);
  assert.equal(result.stdout, "");
  const errors = result.stderr.split("\n").filter(line => line &&
    !/^\(node:\d+\) ExperimentalWarning: SQLite is an experimental feature/.test(line) &&
    !/^\(Use \x60node --trace-warnings/.test(line));
  assert.deepEqual(errors, []);
}

test("initialization is explicit/repeatable and preserves stored values", (t) => {
  const directory = project(t);
  check(directory, `
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM sqlite_schema WHERE name='users'").get().n,0);
    createUsersTable(); assert.deepEqual(listUsers(),[]);
    const user=createUser({name:"Ada",email:"ada@example.com"});
    createUsersTable();createUsersTable();
    assert.deepEqual(findById(user.id), Object.assign(Object.create(null),user));
  `);
});

test("five operations match reference signatures, output shape, and persistence", (t) => {
  const directory = project(t);
  check(directory, `
    createUsersTable();
    const ada=createUser({name:"  Ada  ",email:" ADA@EXAMPLE.COM "});
    const bob=createUser({name:"Bob",email:"bob@example.com"});
    assert.equal(ada.name,"Ada");assert.equal(ada.email,"ada@example.com");
    assert.equal(Object.getPrototypeOf(ada),Object.prototype);
    assert.deepEqual(Object.keys(ada),["id","name","email","createdAt","updatedAt"]);
    assert.equal(ada.createdAt,ada.updatedAt);
    assert.deepEqual(listUsers(),[ada,bob]);
    assert.deepEqual(findUserByEmail(" ADA@EXAMPLE.COM "),ada);
    const named=updateUser(ada.id,{name:"Ada Lovelace"});
    assert.equal(named.email,ada.email);assert.equal(named.createdAt,ada.createdAt);
    const changed=updateUser(ada.id,{email:" NEW@EXAMPLE.COM "});
    assert.equal(changed.name,named.name);assert.equal(changed.email,"new@example.com");
    assert.equal(updateUser(ada.id,{email:"NEW@example.com"}).email,changed.email);
    assert.equal(updateUser(ada.id,{}).name,named.name);
    assert.equal(deleteUser(bob.id),undefined);
    assert.equal(listUsers().length,1);
  `);
  check(directory, `
    const user=findUserByEmail("new@example.com");
    assert.equal(user.name,"Ada Lovelace");assert.equal(listUsers().length,1);
  `);
});

test("reference validation, duplicates, missing users, and rejected writes", (t) => {
  const directory = project(t);
  check(directory, `
    createUsersTable();
    const ada=createUser({name:"Ada",email:"ada@example.com"});
    const bob=createUser({name:"Bob",email:"bob@example.com"});
    const before=JSON.stringify(listUsers());
    for(const [call,message] of [
      [()=>createUser({name:" ",email:"valid@x.com"}),"Name is empty"],
      [()=>createUser({name:"Valid",email:"invalid"}),"Email is invalid"],
      [()=>createUser({name:"Valid",email:"a".repeat(59)+"@x.com"}),"Email is invalid"],
      [()=>createUser({name:"Duplicate",email:" ADA@EXAMPLE.COM "}),"Email is already used"],
      [()=>updateUser(ada.id,{email:bob.email}),"Email is already used"],
      [()=>updateUser(ada.id,{name:" "}),"Name is empty"],
      [()=>updateUser(ada.id,{email:"invalid"}),"Email is invalid"],
      [()=>updateUser(999,{name:"Valid"}),"User not found"],
      [()=>deleteUser(999),"User not found"],
      [()=>findUserByEmail("absent@example.com"),"User not found"],
      [()=>findUserByEmail("invalid"),"Email is invalid"],
    ]) {
      assert.throws(call,{message}); assert.equal(JSON.stringify(listUsers()),before);
    }
  `);
});

test("local-time timestamps refresh on update and preserve createdAt", (t) => {
  const directory = project(t);
  check(directory, `
    createUsersTable();const user=createUser({name:"Ada",email:"ada@example.com"});
    db.prepare("UPDATE users SET updatedAt='2000-01-01 00:00:00' WHERE id=?").run(user.id);
    const before=db.prepare("SELECT datetime('now','localtime') AS now").get().now;
    const changed=updateUser(user.id,{name:"Updated"});
    const after=db.prepare("SELECT datetime('now','localtime') AS now").get().now;
    assert.ok(changed.updatedAt>=before&&changed.updatedAt<=after);
    assert.equal(changed.createdAt,user.createdAt);
  `);
});

test("database errors are sanitized by all five reference operations", (t) => {
  const directory = project(t);
  check(directory, `
    for(const [call,message] of [
      [()=>createUser({name:"Ada",email:"ada@example.com"}),"Could not create the user"],
      [()=>updateUser(1,{name:"Ada"}),"Could not update the user"],
      [()=>deleteUser(1),"Could not delete the user"],
      [()=>listUsers(),"Could not list the users"],
      [()=>findUserByEmail("ada@example.com"),"Could not find the user"],
    ]) assert.throws(call,error=>{
      assert.equal(error.message,message);assert.equal(Object.hasOwn(error,"cause"),false);return true;
    });
  `);
});

test("all six actual terminal clients execute and close the connection", (t) => {
  const directory = project(t);
  function client(name, status=0, expected) {
    const text=readFileSync(join(source,"clients/terminal",name+".txt"),"utf8");
    const match=text.match(/node --input-type=module <<'EOF'\n([\s\S]*?)\nEOF\s*$/);
    assert.ok(match);
    const code=match[1].replace("const userId = 0;","const userId = 1;");
    const result=run(directory,`import assert from "node:assert/strict"; { ${code} }
      const {db:closed}=await import("./db/connection.js");
      assert.throws(()=>closed.prepare("SELECT 1").get(),{code:"ERR_INVALID_STATE"});`,status);
    if(status===0) assert.match(result.stdout,expected);
    else {assert.equal(result.stdout,"");assert.match(result.stderr,expected);}
  }
  client("create-users-table",0,/Users table is ready/);
  client("create-user",0,/name: 'Ada'/);
  client("find-user-by-email",0,/email: 'ada@example.com'/);
  client("list-users",0,/name: 'Ada'/);
  client("update-user",0,/name: 'Ada Lovelace'/);
  client("delete-user",0,/undefined/);
  client("delete-user",1,/User not found/);
  client("list-users",0,/\[\]/);
});

test("tests preserve the working database and it remains ignored by Git", () => {
  assert.deepEqual(existsSync(workingPath)?readFileSync(workingPath):null,before);
  const ignored=spawnSync("git",["check-ignore","--no-index","db/users.sqlite"],{cwd:source,encoding:"utf8"});
  assert.equal(ignored.status,0,ignored.stderr);
});
