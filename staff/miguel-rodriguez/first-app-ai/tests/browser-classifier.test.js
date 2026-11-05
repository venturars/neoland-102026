import assert from "node:assert/strict";
import { test } from "node:test";
import { usersGenderCount } from "../src/logic/users-gender-count.js";

const modelUrl = "http://127.0.0.1:11434/v1/chat/completions";
const dataUrl = "http://127.0.0.1:3000/execute";
const instruction =
  "Classify the following names in order. Follow the demonstrated labels consistently. Use undefined when a name is ambiguous or you are uncertain. Return one classification per name. Use undefined for names commonly used by more than one gender, including shortened forms shared across genders, even when one association is more common. Do not choose a category merely because it is the most likely.";
const examples = [
  { role: "user", content: "Carmen" },
  { role: "assistant", content: "women" },
  { role: "user", content: "Lucia" },
  { role: "assistant", content: "women" },
  { role: "user", content: "Javier" },
  { role: "assistant", content: "men" },
  { role: "user", content: "Pablo" },
  { role: "assistant", content: "men" },
  { role: "user", content: "Kim" },
  { role: "assistant", content: "undefined" },
];

function contacts(length) {
  return Array.from({ length }, (_, index) => ({
    id: index + 1,
    name: `Person ${index + 1}`,
    email: `person-${index + 1}@example.test`,
    createdAt: "2026-11-04 12:00:00",
    updatedAt: "2026-11-04 12:00:00",
  }));
}

function completion(genders) {
  return {
    choices: [{ message: { content: JSON.stringify({ genders }) } }],
  };
}

function intercept(t, users, reply, queryFails = false) {
  const originalFetch = globalThis.fetch;
  const saved = JSON.stringify(users);
  const modelRequests = [];
  const queryRequests = [];
  globalThis.fetch = async (url, options) => {
    assert.equal(options.method, "POST");
    const request = JSON.parse(options.body);
    if (url === dataUrl) {
      queryRequests.push(request);
      assert.equal(request.method, "all");
      assert.match(request.sql, /^SELECT\s/i);
      if (queryFails) {
        throw new TypeError("Controlled data connection failure");
      }
      return { ok: true, json: async () => ({ rows: users }) };
    }
    assert.equal(url, modelUrl);
    assert.equal(options.headers["Content-Type"], "application/json");
    assert.equal(options.headers.Authorization, "Bearer ollama");
    assert.equal(options.signal.aborted, false);
    modelRequests.push(request);
    return await reply(request, modelRequests.length);
  };
  t.after(() => {
    globalThis.fetch = originalFetch;
    assert.equal(JSON.stringify(users), saved);
  });
  return { modelRequests, queryRequests };
}

test("empty classifier returns zeroes without requesting a model", async (t) => {
  const calls = intercept(t, [], () => {
    assert.fail("Empty data must not contact the model");
  });
  assert.deepEqual(await usersGenderCount(), {
    women: 0,
    men: 0,
    genderUndefined: 0,
  });
  assert.equal(calls.queryRequests.length, 1);
  assert.equal(calls.modelRequests.length, 0);
});

test("native classifier keeps the approved names-only request and batches", async (t) => {
  const users = contacts(13);
  const answers = [
    completion(["women", "men", "undefined", "unknown", "women", "men"]),
    { choices: [{ message: { content: "not JSON" } }] },
    completion(["men"]),
  ];
  const calls = intercept(t, users, async (request, number) => ({
    ok: true,
    json: async () => answers[number - 1],
  }));
  const counts = await usersGenderCount();
  assert.deepEqual(counts, { women: 2, men: 3, genderUndefined: 8 });
  assert.equal(calls.queryRequests.length, 1);
  assert.equal(calls.modelRequests.length, 3);
  for (const [index, request] of calls.modelRequests.entries()) {
    assert.deepEqual(Object.keys(request), [
      "model",
      "temperature",
      "messages",
      "response_format",
    ]);
    assert.equal(request.model, "llama3.2");
    assert.equal(request.temperature, 0);
    assert.deepEqual(request.messages.slice(0, 10), examples);
    const names = users
      .slice(index * 6, index * 6 + 6)
      .map((user) => user.name);
    assert.deepEqual(request.messages[10], {
      role: "user",
      content: `${instruction}\n\n${names.join("\n")}`,
    });
    assert.equal(request.messages.length, 11);
    assert.deepEqual(request.response_format, {
      type: "json_schema",
      json_schema: {
        name: "genders",
        strict: true,
        schema: {
          type: "object",
          properties: {
            genders: {
              type: "array",
              items: {
                type: "string",
                enum: ["women", "men", "undefined"],
              },
            },
          },
          required: ["genders"],
          additionalProperties: false,
        },
      },
    });
    const payload = JSON.stringify(request);
    assert.equal(payload.includes("@example.test"), false);
    assert.equal(payload.includes("createdAt"), false);
    assert.equal(payload.includes("updatedAt"), false);
  }
});

test("unusable completion content counts its whole batch as undefined", async (t) => {
  const answers = [
    undefined,
    { choices: [] },
    { choices: [{ message: {} }] },
    { choices: [{ message: { content: "{" } }] },
    { choices: [{ message: { content: "{}" } }] },
    { choices: [{ message: { content: '{"genders":null}' } }] },
    completion(["women"]),
  ];
  let answer;
  const calls = intercept(t, contacts(2), async () => ({
    ok: true,
    json: async () => answer,
  }));
  for (answer of answers) {
    assert.deepEqual(await usersGenderCount(), {
      women: 0,
      men: 0,
      genderUndefined: 2,
    });
  }
  assert.equal(calls.modelRequests.length, answers.length);
});

test("database failure becomes the existing classification error", async (t) => {
  const calls = intercept(
    t,
    contacts(1),
    () => {
      assert.fail("Unavailable data must not contact the model");
    },
    true,
  );
  await assert.rejects(usersGenderCount(), {
    message: "Could not classify the users",
  });
  assert.equal(calls.modelRequests.length, 0);
});

test("native transport fails once without retrying or returning a partial count", async (t) => {
  const calls = intercept(t, contacts(7), async (request, number) => {
    if (number === 1) {
      return { ok: true, json: async () => completion(Array(6).fill("women")) };
    }
    throw new TypeError("Controlled model connection failure");
  });
  await assert.rejects(usersGenderCount(), {
    message: "Could not classify the users",
  });
  assert.equal(calls.modelRequests.length, 2);
});

test("HTTP errors and unreadable response bodies fail the native request", async (t) => {
  let answer;
  const calls = intercept(t, contacts(1), async () => answer);
  const answers = [
    { ok: false, json: async () => ({ error: "Model unavailable" }) },
    {
      ok: true,
      json: async () => {
        throw new SyntaxError("Controlled unreadable HTTP body");
      },
    },
  ];
  for (answer of answers) {
    await assert.rejects(usersGenderCount(), {
      message: "Could not classify the users",
    });
  }
  assert.equal(calls.modelRequests.length, answers.length);
});
