// Verificaciones del controlador sobre resultados confirmados y ventanas autorizadas.
async(page)=>{
 const base='http://127.0.0.1:8769',headers={'X-Teacher-Token':'009-local-test'},contexts=[],checks=[];
 const check=(ok,label)=>{if(!ok)throw new Error(label);checks.push(label);};
 async function setup(count){
  const c=await(await page.request.post(base+'/api/sessions/races',{headers,data:{title:'Interrupciones 009'}})).json();const s=await(await page.request.get(base+`/api/sessions/${c.id}/race`,{headers})).json();
  await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(base+`/race-display.html?r=${c.id}#t=009-local-test`);await page.locator('#race-content').waitFor({state:'visible'});
  const secret=new URLSearchParams(new URL(s.joinUrl).hash.slice(1)).get('join'),clients=[];
  for(const slot of s.roster.slice(0,count)){const ctx=await page.context().browser().newContext();contexts.push(ctx);clients.push(ctx);await ctx.request.post(base+`/api/races/${c.id}/join`,{headers:{Origin:base,'X-Race-Request':'1'},data:{join_secret:secret,roster_key:slot.key}});}
  return {sid:c.id,clients};
 }
 async function confirm(env,clients=env.clients){
  await page.locator('#go').click();await page.locator('#code-panel').waitFor({state:'visible',timeout:10000});
  for(const ctx of clients){const own=await(await ctx.request.get(base+`/api/races/${env.sid}/me`)).json(),teacher=await(await page.request.get(base+`/api/sessions/${env.sid}/race`,{headers})).json();await ctx.request.post(base+`/api/races/${env.sid}/attempt`,{headers:{Origin:base,'X-Race-CSRF':own.csrfToken},data:{operation_id:await page.evaluate(()=>crypto.randomUUID()),code:teacher.code}});}
 }
 async function remove(env){const state=await(await page.request.get(base+`/api/sessions/${env.sid}/race`,{headers})).json();await page.request.delete(base+`/api/sessions/${env.sid}/checkins/${state.checkins[0].id}`,{headers});await page.waitForFunction(()=>document.body.dataset.finale==='podium');check(await page.locator('.kart').evaluateAll(ns=>ns.every(n=>n.getAnimations().length===0)),'Cancelación limpia animaciones');}
 try{
  let e=await setup(0);await page.locator('#finish').click();await page.locator('#confirm-no').click();check(await page.locator('#lobby-controls').isVisible(),'Cancelar conserva lobby');await page.locator('#finish').click();await page.locator('#confirm-yes').click();await page.locator('#results').waitFor({state:'visible'});check(await page.locator('#podium .podium-step').count()===0,'Cierre vacío directo');
  e=await setup(2);await confirm(e,e.clients.slice(0,1));await page.locator('#finish').click();await page.locator('#confirm-no').click();check(await page.locator('#code-panel').isVisible(),'Cancelar conserva registro abierto');await page.locator('#finish').click();await page.locator('#confirm-yes').click();await page.waitForFunction(()=>document.body.dataset.finale==='winner');await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#results').waitFor({state:'visible'});check(await page.locator('#podium .podium-step').count()===1,'Movimiento reducido cancela anticipación y muestra un finalista');
  for(const phase of ['winner','countdown','finish']){
   e=await setup(2);await confirm(e);await page.waitForFunction(phase=>document.body.dataset.finale===phase,phase);
   if(phase==='finish'){await page.waitForTimeout(300);const before=await page.locator('.kart').evaluateAll(ns=>ns.flatMap(n=>n.getAnimations().map(a=>a.currentTime)));await page.setViewportSize({width:1280,height:800});const after=await page.locator('.kart').evaluateAll(ns=>ns.flatMap(n=>n.getAnimations().map(a=>a.currentTime)));check(after.length===2&&after.every((v,i)=>v>=before[i]),'Resize conserva progreso de llegada');}
   await remove(e);check(await page.locator('#podium .podium-step').count()===1,'Retirada durante '+phase+' actualiza podio');
  }
  await page.locator('button[data-remove]').click();await page.locator('#remove-yes').waitFor({state:'visible'});await page.locator('#remove-yes').click();await page.waitForFunction(()=>document.querySelectorAll('#podium .podium-step').length===0);check(true,'Retirada desde el podio conserva confirmación accesible');
  e=await setup(1);await confirm(e);await page.waitForFunction(()=>document.body.dataset.finale==='winner');await page.route('**/race',r=>r.fulfill({status:401,contentType:'application/json',body:JSON.stringify({error:'Acceso no autorizado.'})}));await page.locator('#race-content').waitFor({state:'hidden'});check(await page.locator('.kart').evaluateAll(ns=>ns.every(n=>n.getAnimations().length===0)),'401 oculta datos y cancela ejecución');await page.unroute('**/race');
  return {passing:checks.length,checks};
 }finally{await page.unroute('**/race');for(const ctx of contexts)await ctx.close();}
}
