// Profesor: consultas autorizadas y representación de resultados ya confirmados por 008.
import { PHASES, countdownText, renderGrid, renderPodium, finishRace, element } from './race-renderer.js';
const $=id=>document.getElementById(id);
const sid=new URLSearchParams(location.search).get('r')||'';
const given=new URLSearchParams(location.hash.slice(1)).get('t');
let teacher='';try {if(given)sessionStorage.setItem('race-teacher',given);teacher=given||sessionStorage.getItem('race-teacher')||'';}catch{teacher=given||'';}
if(location.hash)history.replaceState(null,'',location.pathname+location.search);
const prefix=`/api/sessions/${encodeURIComponent(sid)}/race`;
let state=null,receivedAt=0,busy=false,timer=null,delay=1000,stopped=false,qrUrl=null,qrLink=null,animations=[],finishing=false,resultsKey='',removal=null;

let idle=Promise.resolve(), resolveIdle=()=>{}, actionWaiting=false;
/** Espera una consulta activa sin perder la acción del usuario. :return: si puede comenzar. :rtype: Promise<boolean>. Usage:: await beginAction() */
async function beginAction(){
  if(actionWaiting||stopped)return false;
  actionWaiting=true;clearTimeout(timer);await idle;clearTimeout(timer);
  if(stopped){actionWaiting=false;return false;}
  busy=true;return true;
}
/** Finaliza la acción y vuelve a consultar el estado. :return: None. :rtype: void. Usage:: endAction() */
function endAction(){busy=false;actionWaiting=false;tick();}

/** Deshabilita mutaciones mientras haya otra petición activa. :return: None. :rtype: void. Usage:: controls() */
function controls(){for(const id of ['go','finish','confirm-yes','remove-yes'])$(id).disabled=actionWaiting;for(const button of document.querySelectorAll('button[data-release],button[data-remove]'))button.disabled=actionWaiting;$('download').disabled=actionWaiting||!state?.total;}

/** Mensaje del profesor sin interpretar HTML. :param text: texto. :param error: estado de error. :return: None. :rtype: void. Usage:: message('Esperando') */
function message(text,error=false){$('status').textContent=text;$('status').className=`status${error?' error':''}`;}

/** Petición privada solo al mismo origen. :param path: ruta propia. :param options: opciones fetch. :return: respuesta. :rtype: Promise<Response>. Usage:: api(prefix) */
async function api(path,options={}) {
  const response=await fetch(path,{...options,credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(8000),headers:{'X-Teacher-Token':teacher,'Content-Type':'application/json',...options.headers}});
  if(response.status===401){stopped=true;state=null;$('race-content').hidden=true;clearQr();throw new Error('Acceso de profesor no válido. Abre tu enlace privado original.');}
  return response;
}

/** Revoca el blob del QR en cada cierre de altas o salida de página. :return: None. :rtype: void. Usage:: clearQr() */
function clearQr(){if(qrUrl)URL.revokeObjectURL(qrUrl);qrUrl=null;qrLink=null;$('qr').removeAttribute('src');$('join-link').removeAttribute('href');}

/** Obtiene imagen con cabecera, nunca con credenciales en su URL. :param data: lobby autorizado. :return: None. :rtype: Promise<void>. Usage:: loadQr(state) */
async function loadQr(data){
  if(qrLink===data.joinUrl)return;
  const response=await api(prefix+'/qr.svg');
  if(!response.ok)throw new Error('No se pudo cargar la entrada. Consultaremos el estado.');
  const blob=await response.blob();clearQr();qrUrl=URL.createObjectURL(blob);qrLink=data.joinUrl;$('qr').src=qrUrl;$('join-link').href=data.joinUrl;
}

/** Dibuja clasificaciones actuales y permite retirar asistencia con confirmación. :param data: estado del profesor. :return: None. :rtype: void. Usage:: paintResults(state) */
function paintResults(data){
  $('classification-title').hidden=!data.checkins.length;
  const key=JSON.stringify(data.checkins);if(key!==resultsKey){
    resultsKey=key;renderPodium($('podium'),data);$('classification').replaceChildren(...data.checkins.map(item=>{
      const row=element('li');const remove=element('button','Quitar','secondary small');remove.type='button';remove.dataset.remove=String(item.id);remove.setAttribute('aria-label',`Quitar asistencia de ${item.name}`);
      row.append(element('b',String(item.position)),element('span',item.name),remove);return row;
    }));
  }
  const absent=data.roster.filter(slot=>slot.included&&slot.state!=='registrado').map(slot=>slot.name);
  $('unregistered').textContent=absent.length?`Sin registrar: ${absent.join(', ')}.`:'';
}

/** Presenta el resultado una vez y mueve el foco al podio. :return: None. :rtype: void. Usage:: showResults() */
function showResults(){ $('results').hidden=false;const title=$('results').querySelector('h2');title.tabIndex=-1;title.focus({preventScroll:true});$('results').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'}); }

/** Representa fases sin reiniciar la salida ni decidir puestos. :param data: estado confirmado. :return: None. :rtype: Promise<void>. Usage:: render(state) */
async function render(data){
  const previous=state;state=data;receivedAt=performance.now();$('race-content').hidden=false;$('race-title').textContent=data.title;
  $('phase').textContent=PHASES[data.phase]||'Consultando';$('lobby-controls').hidden=data.phase!=='lobby';$('countdown').hidden=data.phase!=='countdown';$('code-panel').hidden=data.phase!=='open';
  $('finish').hidden=['closed','expired'].includes(data.phase);$('download').disabled=!data.total;
  $('ready-count').textContent=String(data.roster.filter(slot=>slot.state==='listo').length);$('go').disabled=actionWaiting;
  $('progress').textContent=`${data.total} de ${data.roster.filter(slot=>slot.included).length} llegadas confirmadas${data.phase==='lobby'?' · El grupo se fija al empezar.':''}`;
  $('code').textContent=data.phase==='open'?data.code:'';
  if(data.phase==='lobby')await loadQr(data);else clearQr();
  renderGrid($('grid'),data.roster,data.phase==='lobby');paintResults(data);
  const changed=JSON.stringify(previous?.checkins)!==JSON.stringify(data.checkins);
  if(finishing&&changed){animations.forEach(item=>item.cancel());finishing=false;}
  if(data.phase==='closed'&&previous&&previous.phase!=='closed'&&data.total&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    finishing=true;$('results').hidden=true;$('grid-title').textContent='¡A cruzar la meta!';animations=finishRace($('grid'),data.checkins);
    Promise.allSettled(animations.map(item=>item.finished)).then(()=>{finishing=false;showResults();$('grid-title').textContent='Clasificación final';});
  }else{$('results').hidden=data.phase!=='closed'||finishing;$('grid-title').textContent=finishing?'¡A cruzar la meta!':data.phase==='closed'?'Clasificación final':'La parrilla';if(data.phase==='closed'&&previous?.phase!=='closed'&&!finishing)showResults();}
}

/** Consulta sin superponer peticiones y aplica backoff al fallar. :return: None. :rtype: Promise<void>. Usage:: tick() */
async function tick(){
  clearTimeout(timer);if(busy||actionWaiting||stopped||document.hidden)return;busy=true;idle=new Promise(resolve=>{resolveIdle=resolve;});
  try{const response=await api(prefix);const data=await response.json();if(!response.ok)throw new Error(data.error||'No se pudo recuperar la carrera.');await render(data);delay=1000;}
  catch(error){message(error.message||'Sin conexión. Consultaremos de nuevo el estado.',true);delay=Math.min(8000,delay*2);}
  finally{busy=false;resolveIdle();controls();if(!stopped&&!document.hidden)timer=setTimeout(tick,delay);}
}

/** Mutación del profesor seguida de consulta, incluso si se pierde respuesta. :param suffix: ruta de acción. :param fields: cuerpo. :return: None. :rtype: Promise<void>. Usage:: action('/start') */
async function action(suffix,fields={}){
  if(!state||!await beginAction())return;controls();$('go').disabled=true;$('confirm-yes').disabled=true;
  try{const response=await api(prefix+suffix,{method:'POST',body:JSON.stringify(fields)});const data=await response.json();if(!response.ok)throw new Error(data.error||'No se pudo completar la acción.');message('');await render(data);}
  catch(error){message(error.message||'No llegó la respuesta. Consultaremos la misma carrera.',true);}
  finally{endAction();controls();}
}
$('go').addEventListener('click',()=>action('/start'));
$('finish').addEventListener('click',()=>{$('confirm-close').hidden=false;$('confirm-no').focus();});
$('confirm-no').addEventListener('click',()=>{$('confirm-close').hidden=true;$('finish').focus();});
$('confirm-yes').addEventListener('click',()=>{$('confirm-close').hidden=true;action('/close');});
$('grid').addEventListener('click',event=>{const button=event.target.closest('button[data-release]');if(button)action('/release',{roster_key:button.dataset.release});});
$('classification').addEventListener('click',event=>{
  const button=event.target.closest('button[data-remove]');if(!button)return;
  removal=Number(button.dataset.remove);const record=state.checkins.find(item=>item.id===removal);
  $('remove-question').textContent=`¿Quitar la asistencia de ${record.name}? Su plaza no vuelve a abrirse.`;$('confirm-remove').hidden=false;$('remove-no').focus();
});
$('remove-no').addEventListener('click',()=>{$('confirm-remove').hidden=true;removal=null;});
$('remove-yes').addEventListener('click',async()=>{
  if(removal===null||!await beginAction())return;controls();$('confirm-remove').hidden=true;
  try{const response=await api(`/api/sessions/${encodeURIComponent(sid)}/checkins/${removal}`,{method:'DELETE'});if(!response.ok&&response.status!==404)throw new Error('No se pudo retirar la asistencia.');removal=null;resultsKey='';}
  catch(error){message(error.message,true);}finally{endAction();controls();}
});
$('copy-link').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(qrLink);message('Entrada copiada.');}catch{message('Usa «Abrir entrada sin cámara» y copia su enlace.');}});
$('download').addEventListener('click',async()=>{if(!await beginAction())return;try{const response=await api(`/api/sessions/${encodeURIComponent(sid)}/export`);if(!response.ok)throw new Error('No se pudo descargar.');const url=URL.createObjectURL(await response.blob());const a=element('a');a.href=url;a.download='asistencia-carrera.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch(error){message(error.message,true);}finally{endAction();controls();}});
$('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{message('Puedes seguir jugando sin pantalla completa.');}});
$('panel').addEventListener('click',()=>{try{sessionStorage.setItem('race-teacher',teacher);}catch{}});
let countdownTimer;
/** Reinicia el reloj visual al volver de caché de navegación. :return: None. :rtype: void. Usage:: startClock() */
function startClock(){clearInterval(countdownTimer);countdownTimer=setInterval(()=>{if(document.hidden||!state)return;if(state.phase==='countdown'){const text=countdownText(state,receivedAt);if($('countdown').textContent!==text)$('countdown').textContent=text;}if(state.phase==='open')$('code-time').textContent=`Cambia en ${Math.max(0,Math.ceil(state.secondsLeft-(performance.now()-receivedAt)/1000))} s`;},200);}
startClock();
document.addEventListener('visibilitychange',()=>{clearTimeout(timer);if(!document.hidden)tick();});
window.addEventListener('pagehide',()=>{clearTimeout(timer);clearInterval(countdownTimer);clearQr();animations.forEach(item=>item.cancel());});
window.addEventListener('pageshow',()=>{startClock();if(!document.hidden)tick();});
if(!sid||!teacher){stopped=true;message('Falta el acceso privado de esta carrera. Ábrela desde el panel del profesor.',true);}else tick();
