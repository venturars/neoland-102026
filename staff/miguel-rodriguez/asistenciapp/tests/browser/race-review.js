// Ejecutar con browser_run_code_unsafe sobre una copia ficticia en loopback; no añade dependencias al producto.
async (page) => {
  const base='http://127.0.0.1:8767';
  const header={'X-Teacher-Token':'007-local-test'};
  const browser=page.context().browser();const contexts=[];const results=[];
  const check=(condition,label)=>{if(!condition)throw new Error(label);results.push(label);};
  async function setup(keys){
    const created=await (await page.request.post(base+'/api/sessions/races',{headers:header,data:{title:'Ensayo <img src=x onerror=alert(1)>'}})).json();
    const teacherState=await (await page.request.get(base+`/api/sessions/${created.id}/race`,{headers:header})).json();
    await page.goto(base+`/race-display.html?r=${created.id}#t=007-local-test`);await page.locator('#race-content').waitFor({state:'visible'});
    const students=[];
    for(const key of keys){const ctx=await browser.newContext({viewport:{width:400,height:850}});contexts.push(ctx);const student=await ctx.newPage();await student.goto(teacherState.joinUrl);await student.locator('#join-view').waitFor({state:'visible'});await student.locator('#name').selectOption(key);await student.locator('#join-button').click();await student.locator('#own-view').waitFor({state:'visible'});students.push(student);}
    return {sid:created.id,students,entry:teacherState.joinUrl};
  }
  async function go(env){await page.locator('#go').click();await page.locator('#code-panel').waitFor({state:'visible',timeout:10000});for(const student of env.students)await student.locator('#code-form').waitFor({state:'visible'});return await page.locator('#code').innerText();}
  await page.setViewportSize({width:1280,height:900});await page.emulateMedia({reducedMotion:'reduce'});
  try{
    let env=await setup([]);await page.locator('#go').click();await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('al menos'));check(await page.locator('#lobby-controls').isVisible(),'Cero ocupantes no inicia');check(await page.locator('#race-title').innerText()==='Ensayo <img src=x onerror=alert(1)>','Título tratado como texto');check(await page.locator('#race-title img').count()===0,'Sin HTML inyectado');
    await page.locator('#finish').click();await page.locator('#confirm-no').click();check(await page.locator('#lobby-controls').isVisible(),'Cancelar cierre mantiene lobby');await page.locator('#finish').click();await page.locator('#confirm-yes').click();await page.locator('#results').waitFor({state:'visible'});check(await page.locator('#podium').innerText()==='Sin registros: hoy no hay medallas.','Cierre vacío sin medallas');
    env=await setup(['jimena-duran']);let student=env.students[0];let posts=[];let first=true;
    await student.route('**/attempt',async route=>{posts.push(route.request().postData());if(first){first=false;await route.fulfill({status:503,contentType:'application/json',headers:{'Retry-After':'1'},body:JSON.stringify({error:'Servicio ocupado de prueba'})});}else await route.continue();});
    let code=await go(env);await student.locator('#code').fill(code);await student.locator('#send').click();await student.locator('#retry').waitFor({state:'visible'});await student.locator('#retry').click();await student.locator('#result').waitFor({state:'visible'});check(posts.length===2&&posts[0]===posts[1],'503 conserva UUID y cuerpo');await page.locator('#results').waitFor({state:'visible'});check(await page.locator('#podium .podium-step').count()===1,'Podio de un finalista');
    env=await setup(['meghan-martin','miguel-rodriguez']);student=env.students[0];posts=[];
    await student.route('**/attempt',async route=>{posts.push(route.request().postData());await route.fetch();await route.abort('failed');});
    code=await go(env);await student.locator('#code').fill(code);await student.locator('#send').click();await student.locator('#result').waitFor({state:'visible',timeout:10000});check(posts.length===1,'Respuesta de éxito perdida recuperada sin reenviar');const own=await student.evaluate(async()=>{const sid=new URL(location.href).searchParams.get('r');const d=await(await fetch(`/api/races/${sid}/me`)).json();return {remaining:d.remaining,operations:d.operations.length};});check(own.remaining===2&&own.operations===1,'Éxito perdido conserva un solo intento');
    await page.locator('#finish').click();await page.locator('#confirm-no').click();check(await page.locator('#code-panel').isVisible(),'Cancelar cierre mantiene registro abierto');const other=env.students[1];await other.locator('#code').fill(await page.locator('#code').innerText());await other.locator('#send').click();await other.locator('#result').waitFor({state:'visible'});await page.locator('#results').waitFor({state:'visible'});check(await page.locator('#podium .podium-step').count()===2,'Podio de dos finalistas');await student.reload();await student.locator('#result').waitFor({state:'visible'});check(await student.locator('#position').innerText()==='1.º','Recarga conserva resultado tras cierre');
    env=await setup(['meghan-martin']);student=env.students[0];code=await go(env);let postCount=0;
    await student.route('**/attempt',async route=>{postCount++;await route.fulfill({status:202,contentType:'application/json',body:JSON.stringify({operationState:'unconfirmed',message:'Intento gastado de prueba'})});});
    await student.locator('#code').fill(code);await student.locator('#send').click();await student.waitForFunction(()=>document.querySelector('#status').textContent.includes('Consultaremos'));await student.waitForFunction(()=>!sessionStorage.getItem(`race-attempt:${new URL(location.href).searchParams.get('r')}`));await student.locator('#send').waitFor({state:'visible'});check(postCount===1,'202 no crea otro envío automático');check(await student.locator('#code').inputValue()==='','202 borra código pendiente');
    await student.unroute('**/attempt');let requests=0;await student.route('**/attempt',route=>{requests++;return route.fulfill({status:422,contentType:'application/json',body:JSON.stringify({error:'Código incorrecto de prueba'})});});
    await student.locator('#code').fill('1234');await student.locator('#send').click();await student.waitForFunction(()=>document.querySelector('#status').textContent.includes('Código incorrecto'));check(requests===1,'422 no se reenvía automáticamente');await student.unroute('**/attempt');
    await student.route('**/me',route=>route.fulfill({status:410,contentType:'application/json',body:JSON.stringify({error:'Tu acceso ha caducado. Consulta al profesor.'})}));await student.reload();await student.waitForFunction(()=>document.querySelector('#status').textContent.includes('caducado'));check(!await student.locator('#code-form').isVisible(),'410 oculta formulario y resultado');
    await page.locator('#finish').click();await page.locator('#confirm-yes').click();await page.locator('#results').waitFor({state:'visible'});
    const ctx=await browser.newContext();contexts.push(ctx);const lost=await ctx.newPage();await lost.goto(base+`/race.html?r=${env.sid}`);await lost.waitForFunction(()=>document.querySelector('#status').textContent.includes('No tienes acceso'));check(!await lost.locator('#join-view').isVisible(),'Acceso perdido no crea otra plaza');
    await page.screenshot({path:'/tmp/007-empty-results.png',fullPage:true});
    return {checks:results,passing:results.length};
  }finally{for(const ctx of contexts)await ctx.close();}
}
