// Ensayo real del tramo previo y la llegada, sobre una carrera y base ficticias.
async(page)=>{
 const base='http://127.0.0.1:8769',headers={'X-Teacher-Token':'009-local-test'};
 const created=await(await page.request.post(base+'/api/sessions/races',{headers,data:{title:'Final 009'}})).json();
 const state=await(await page.request.get(base+`/api/sessions/${created.id}/race`,{headers})).json();
 const contexts=[],students=[];
 try{
  await page.setViewportSize({width:1366,height:768});await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto(base+`/race-display.html?r=${created.id}#t=009-local-test`);await page.locator('#race-content').waitFor({state:'visible'});
  await page.screenshot({path:'/tmp/009-before-lobby.png',fullPage:true});
  for(const key of ['jimena-duran','meghan-martin']){
   const ctx=await page.context().browser().newContext();contexts.push(ctx);const student=await ctx.newPage();students.push(student);
   await student.goto(state.joinUrl);await student.locator('#join-view').waitFor({state:'visible'});await student.locator('#name').selectOption(key);await student.locator('#join-button').click();await student.locator('#own-view').waitFor({state:'visible'});
  }
  await page.locator('#go').click();await page.locator('#code-panel').waitFor({state:'visible',timeout:10000});
  const row=page.locator('[data-key="jimena-duran"]'),kart=row.locator('.kart');const before=(await kart.boundingBox()).x;
  await students[0].locator('#code').fill(await page.locator('#code').innerText());await students[0].locator('#send').click();await students[0].locator('#result').waitFor({state:'visible'});
  await page.waitForFunction(()=>document.querySelector('[data-key="jimena-duran"] .racer-status').textContent.includes('1'));
  await page.waitForTimeout(450);const after=(await kart.boundingBox()).x;
  if(Math.abs(after-before)>1)throw new Error('El kart avanza antes de la celebración');
  await students[1].locator('#code').fill(await page.locator('#code').innerText());await students[1].locator('#send').click();await students[1].locator('#result').waitFor({state:'visible'});
  await page.waitForFunction(()=>document.body.dataset.finale==='winner');
  await page.waitForFunction(()=>document.body.dataset.finale==='countdown');
  await page.waitForFunction(()=>document.body.dataset.finale==='finish');
  await page.locator('#results').waitFor({state:'visible',timeout:15000});
  if(await page.locator('#podium .podium-step').count()!==2)throw new Error('Podio incorrecto');
  return {passing:5,checks:['Confirmación inmediata','Kart quieto al registrar','Ganador y cuenta previos','Única llegada','Podio real de dos']};
 }finally{for(const context of contexts)await context.close();}
}
