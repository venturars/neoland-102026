// Segundo ensayo: salida en dos ventanas, teclado, presupuesto real y cierre con un ausente.
async (page) => {
 const base='http://127.0.0.1:8767', headers={'X-Teacher-Token':'007-local-test'}, browser=page.context().browser();
 const contexts=[],checks=[];const check=(v,label)=>{if(!v)throw new Error(label);checks.push(label);};
 const created=await(await page.request.post(base+'/api/sessions/races',{headers,data:{title:'Convivencia de pilotos'}})).json();
 await page.goto(base+`/race-display.html?r=${created.id}#t=007-local-test`);await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#race-content').waitFor({state:'visible'});
 const link=await page.locator('#join-link').getAttribute('href');
 try {
  const students=[];
  for(let i=0;i<2;i++){
   const ctx=await browser.newContext({viewport:{width:400,height:850}});contexts.push(ctx);const p=await ctx.newPage();await p.goto(link);await p.locator('#join-view').waitFor({state:'visible'});
   if(i===0){await p.locator('#name').selectOption('diego-molero');await p.locator('#name').focus();await p.keyboard.press('Tab');await p.keyboard.press('Enter');}
   else{await p.locator('#name').selectOption('meghan-martin');await p.locator('#join-button').click();}
   await p.locator('#own-view').waitFor({state:'visible'});students.push(p);
  }
  const keyboardName=await students[0].locator('#own-name').innerText();check(Boolean(keyboardName),'Tabulación y envío con Enter');
  const ctx=await browser.newContext();contexts.push(ctx);const secondTeacher=await ctx.newPage();await secondTeacher.goto(base+`/race-display.html?r=${created.id}#t=007-local-test`);await secondTeacher.locator('#go').waitFor({state:'visible'});
  await page.locator('#go').focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>document.querySelector('#lobby-controls').hidden);
  const started=await(await page.request.get(base+`/api/sessions/${created.id}/race`,{headers})).json();
  await page.reload();await page.locator('#race-content').waitFor({state:'visible'});
  const reloaded=await(await page.request.get(base+`/api/sessions/${created.id}/race`,{headers})).json();check(started.startsAt===reloaded.startsAt,'Recarga conserva startsAt durante salida');
  await secondTeacher.locator('#code-panel').waitFor({state:'visible',timeout:10000});await page.locator('#code-panel').waitFor({state:'visible',timeout:10000});
  check(await page.locator('#code').innerText()===await secondTeacher.locator('#code').innerText(),'Dos ventanas ven la misma salida y código');
  const banned=students[0];await banned.locator('#code-form').waitFor({state:'visible'});
  for(let n=2;n>=0;n--){await banned.locator('#code').fill('xxxx');await banned.evaluate(async()=>{const sid=new URL(location.href).searchParams.get('r');const own=await(await fetch(`/api/races/${sid}/me`)).json();await fetch(`/api/races/${sid}/attempt`,{method:'POST',headers:{'Content-Type':'application/json','X-Race-CSRF':own.csrfToken},body:JSON.stringify({operation_id:crypto.randomUUID(),code:'xxxx'})});});await banned.waitForFunction(expected=>document.querySelector('#remaining').textContent===String(expected),n);}
  check((await banned.locator('#own-message').innerText()).includes('Sin intentos'),'Plaza agotada visible sin formulario');
  const winner=students[1];await winner.locator('#code').fill(await page.locator('#code').innerText());await winner.locator('#send').click();await winner.locator('#result').waitFor({state:'visible'});check(await winner.locator('#position').innerText()==='1.º','Otra plaza registra tras agotamiento ajeno');
  await page.locator('#finish').click();await page.locator('#confirm-yes').click();await page.locator('#results').waitFor({state:'visible'});check((await page.locator('#unregistered').innerText()).includes(keyboardName),'Cierre manual no inventa la asistencia agotada');
  const mainHtml=await page.request.get(base+'/profesor.html');check(mainHtml.ok(),'Panel normal sigue disponible');
  await page.setViewportSize({width:1280,height:900});await page.evaluate(()=>document.documentElement.style.zoom='200%');check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Zoom 200% de escritorio sin overflow');await page.evaluate(()=>document.documentElement.style.zoom='');
  return {checks,passing:checks.length};
 }finally{for(const ctx of contexts)await ctx.close();}
}
