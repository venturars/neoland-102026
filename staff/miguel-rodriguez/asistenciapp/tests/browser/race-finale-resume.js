// Ocultación simulada para ejercitar el evento del controlador, sin cambiar el backend.
async(page)=>{
 const base='http://127.0.0.1:8769',headers={'X-Teacher-Token':'009-local-test'},contexts=[],checks=[];
 const check=(ok,label)=>{if(!ok)throw new Error(label);checks.push(label);};
 async function closeOne(){
  const c=await(await page.request.post(base+'/api/sessions/races',{headers,data:{title:'Recuperación 009'}})).json();const s=await(await page.request.get(base+`/api/sessions/${c.id}/race`,{headers})).json();
  const ctx=await page.context().browser().newContext();contexts.push(ctx);await ctx.request.post(base+`/api/races/${c.id}/join`,{headers:{Origin:base,'X-Race-Request':'1'},data:{join_secret:new URLSearchParams(new URL(s.joinUrl).hash.slice(1)).get('join'),roster_key:s.roster[0].key}});
  await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(base+`/race-display.html?r=${c.id}#t=009-local-test`);await page.locator('#go').waitFor({state:'visible'});await page.locator('#go').click();await page.locator('#code-panel').waitFor({state:'visible',timeout:10000});
  const me=await(await ctx.request.get(base+`/api/races/${c.id}/me`)).json();await ctx.request.post(base+`/api/races/${c.id}/attempt`,{headers:{Origin:base,'X-Race-CSRF':me.csrfToken},data:{operation_id:await page.evaluate(()=>crypto.randomUUID()),code:await page.locator('#code').innerText()}});await page.waitForFunction(()=>document.body.dataset.finale==='winner');return c.id;
 }
 async function visibility(hidden){await page.evaluate(hidden=>{Object.defineProperty(document,'hidden',{configurable:true,value:hidden});document.dispatchEvent(new Event('visibilitychange'));},hidden);}
 try{
  for(const phase of ['winner','countdown','finish']){const sid=await closeOne();await page.waitForFunction(phase=>document.body.dataset.finale===phase,phase);await page.reload();await page.locator('#results').waitFor({state:'visible'});check(await page.locator('.kart').evaluateAll(ns=>ns.every(n=>!n.getAnimations().length)),'Recarga en '+phase+' muestra resultado sin repetir');}
  await closeOne();await page.waitForFunction(()=>document.body.dataset.finale==='finish');await page.waitForTimeout(500);await visibility(true);await page.waitForTimeout(600);await visibility(false);await page.waitForFunction(()=>document.body.dataset.finale==='finish');await page.waitForTimeout(100);
  const times=await page.locator('.kart').evaluateAll(ns=>ns.flatMap(n=>n.getAnimations().map(a=>a.currentTime)));check(times.length===1&&times[0]>=1100,'Reanudación conserva progreso en vez de reiniciar ocho segundos');
  await page.locator('#results').waitFor({state:'visible',timeout:12000});
  await closeOne();await visibility(true);await page.waitForTimeout(13500);await visibility(false);await page.locator('#results').waitFor({state:'visible',timeout:6000});check(await page.locator('.kart').evaluateAll(ns=>ns.every(n=>!n.getAnimations().length)),'Ocultación simulada pasada la duración va directa a podio');
  return {passing:checks.length,checks};
 }finally{for(const ctx of contexts)await ctx.close();}
}
