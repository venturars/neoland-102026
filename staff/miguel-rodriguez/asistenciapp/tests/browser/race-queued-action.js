// Una acción explícita espera la consulta en curso, sin perder clics ni superponer fetch.
async(page)=>{
 const base='http://127.0.0.1:8767',headers={'X-Teacher-Token':'007-local-test'};
 const race=await(await page.request.post(base+'/api/sessions/races',{headers,data:{title:'Acción durante consulta'}})).json();
 const state=await(await page.request.get(base+`/api/sessions/${race.id}/race`,{headers})).json();
 const ctx=await page.context().browser().newContext();let release;
 try{
  const student=await ctx.newPage();await student.goto(state.joinUrl);await student.locator('#join-view').waitFor({state:'visible'});await student.locator('#name').selectOption('jimena-duran');await student.locator('#join-button').click();await student.locator('#own-view').waitFor({state:'visible'});
  await page.request.post(base+`/api/sessions/${race.id}/race/start`,{headers,data:{}});await student.locator('#code-form').waitFor({state:'visible',timeout:10000});
  const code=(await(await page.request.get(base+`/api/sessions/${race.id}/race`,{headers})).json()).code;
  let began;const entered=new Promise(resolve=>{began=resolve;});const gate=new Promise(resolve=>{release=resolve;});let blocked=false,posts=0,active=0,maximum=0;
  student.on('request',request=>{if(request.url().includes('/api/races/')){active++;maximum=Math.max(maximum,active);if(request.url().endsWith('/attempt'))posts++;}});
  const ended=request=>{if(request.url().includes('/api/races/'))active--;};student.on('requestfinished',ended);student.on('requestfailed',ended);
  await student.route('**/me',async route=>{if(!blocked){blocked=true;began();await gate;}await route.continue();});
  await entered;await student.locator('#code').fill(code);await student.locator('#send').click();if(posts!==0)throw new Error('Envío superpuesto a consulta');release();await student.locator('#result').waitFor({state:'visible'});
  if(posts!==1||maximum>1)throw new Error('Acción perdida o concurrencia duplicada');
  return {checks:['La acción espera el GET activo','Un único POST con la operación original','Máximo una petición API pendiente'],posts,maximum};
 }finally{if(release)release();await ctx.close();}
}
