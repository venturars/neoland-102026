// Quince clientes reales de ensayo; comprobar la escena sin scroll manual.
async(page)=>{
 const base='http://127.0.0.1:8769',headers={'X-Teacher-Token':'009-local-test'},contexts=[];
 const created=await(await page.request.post(base+'/api/sessions/races',{headers,data:{title:'Tres pilotos'}})).json();
 const state=await(await page.request.get(base+`/api/sessions/${created.id}/race`,{headers})).json();
 const entry=new URL(state.joinUrl),secret=new URLSearchParams(entry.hash.slice(1)).get('join');
 const out='/Users/miguelangelrodriguez/Documents/ChatGPT/NEOLAND/009-local-implementation/asistenciapp/specs/009-refinar-presentacion-de-carrera/evidence';
 try{
  await page.setViewportSize({width:1366,height:768});await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto(base+`/race-display.html?r=${created.id}#t=009-local-test`);await page.locator('#race-content').waitFor({state:'visible'});
  for(const slot of state.roster.slice(0,3)){const ctx=await page.context().browser().newContext();contexts.push(ctx);const r=await ctx.request.post(base+`/api/races/${created.id}/join`,{headers:{Origin:base,'X-Race-Request':'1'},data:{join_secret:secret,roster_key:slot.key}});if(r.status()!==200&&r.status()!==201)throw new Error('No se pudo preparar plaza: '+r.status());}
  await page.locator('#go').click();await page.locator('#code-panel').waitFor({state:'visible',timeout:10000});
  await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
  for(const ctx of contexts){const own=await(await ctx.request.get(base+`/api/races/${created.id}/me`)).json();const teacher=await(await page.request.get(base+`/api/sessions/${created.id}/race`,{headers})).json();const id=await page.evaluate(()=>crypto.randomUUID());const response=await ctx.request.post(base+`/api/races/${created.id}/attempt`,{headers:{Origin:base,'X-Race-CSRF':own.csrfToken},data:{operation_id:id,code:teacher.code}});if(response.status()!==201)throw new Error('Registro '+response.status());}
  await page.waitForFunction(()=>document.body.dataset.finale==='winner');
  const geometry=await page.evaluate(()=>{
   const rows=[...document.querySelectorAll('#grid .racer')].filter(n=>getComputedStyle(n).display!=='none');
   const visible=n=>{const r=n.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight&&r.left>=0&&r.right<=innerWidth;};
   return {count:rows.length,allVisible:rows.every(visible),banner:visible(document.querySelector('#finale-banner')),scroll:scrollY,gridBottom:document.querySelector('#grid').getBoundingClientRect().bottom};
  });
  if(geometry.count!==3||!geometry.allVisible||!geometry.banner||geometry.scroll!==0)throw new Error('Escena fuera de vista: '+JSON.stringify(geometry));
  await page.screenshot({path:out+'/ganador-3.png'});
  await page.waitForFunction(()=>document.body.dataset.finale==='countdown');await page.screenshot({path:out+'/cuenta-3.png'});
  await page.waitForFunction(()=>document.body.dataset.finale==='finish');await page.waitForTimeout(1000);await page.screenshot({path:out+'/llegada-3.png'});
  const animations=await page.locator('.kart').evaluateAll(nodes=>nodes.flatMap(n=>n.getAnimations().map(a=>a.effect.getTiming().duration)));
  if(animations.length!==3||animations[0]!==5800||animations.at(-1)!==8000)throw new Error('Duraciones de llegada incorrectas');
  await page.locator('#results').waitFor({state:'visible',timeout:15000});await page.screenshot({path:out+'/podio-3.png'});
  const podium=await page.locator('#podium').boundingBox();if(podium.y+podium.height>768)throw new Error('Podio fuera de pantalla');
  await page.reload();await page.locator('#results').waitFor({state:'visible'});if(await page.locator('.kart').evaluateAll(ns=>ns.some(n=>n.getAnimations().length)))throw new Error('Recarga repite llegada');
  return {geometry,animations:animations.length,firstDuration:animations[0],lastDuration:animations.at(-1),podiumVisible:true,reloadDirect:true};
 }finally{for(const ctx of contexts)await ctx.close();}
}
