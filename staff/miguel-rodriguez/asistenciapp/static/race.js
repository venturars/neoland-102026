// Alumno: una plaza, un bucle de consulta y operaciones que nunca cambian de UUID al reintentarlas.
import { assetPath, PHASES, countdownText, element } from './race-renderer.js';
const $ = id => document.getElementById(id);
const sid = new URLSearchParams(location.search).get('r') || '';
const prefix = `/api/races/${encodeURIComponent(sid)}`;
const entryKey = `race-entry:${sid}`;
const pendingKey = `race-attempt:${sid}`;
let state=null, receivedAt=0, busy=false, timer=null, delay=1000, stopped=false, joined=false, uncertain=false;

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

/** Almacenamiento temporal que tolera restricciones del navegador. :param key: clave. :param value: texto, null para borrar o undefined para leer. :return: texto guardado. :rtype: string|null. Usage:: storage('clave') */
function storage(key, value) {
  try { if(value===undefined)return sessionStorage.getItem(key); if(value===null)sessionStorage.removeItem(key);else sessionStorage.setItem(key,value); } catch { /* Sin almacenamiento no se inventan operaciones de recuperación. */ }
  return null;
}
let entry = new URLSearchParams(location.hash.slice(1)).get('join') || storage(entryKey);
if(location.hash) history.replaceState(null,'',location.pathname+location.search);
if(entry) storage(entryKey,entry);
let pending=null;
try { pending=JSON.parse(storage(pendingKey)||'null'); if(!pending?.operation_id || typeof pending.code!=='string')pending=null; } catch { storage(pendingKey,null); }

/** Comunica estado sin HTML remoto. :param text: mensaje. :param error: indicar error. :return: None. :rtype: void. Usage:: message('Listo') */
function message(text,error=false) { $('status').textContent=text;$('status').className=`status${error?' error':''}`; }

/** Envía una sola petición sin política de reintento oculta. :param path: ruta propia. :param fields: cuerpo opcional. :param headers: cabeceras. :return: respuesta y JSON. :rtype: Promise<object>. Usage:: request('/me') */
async function request(path,fields,headers={}) {
  const response=await fetch(prefix+path,{method:fields===undefined?'GET':'POST',credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(8000),headers:{'Content-Type':'application/json',...headers},...(fields===undefined?{}:{body:JSON.stringify(fields)})});
  const data=await response.json();return {response,data};
}

/** Borra códigos de una operación terminada o incierta. :return: None. :rtype: void. Usage:: clearPending() */
function clearPending() { pending=null;storage(pendingKey,null);$('code').value='';$('retry').hidden=true; }

/** Presenta el contrato propio sin inferir permisos del reloj local. :param data: estado propio confirmado. :return: None. :rtype: void. Usage:: renderOwn(data) */
function renderOwn(data) {
  const oldPhase=state?.phase, oldResult=state?.result?.id;state=data;receivedAt=performance.now();joined=true;entry=null;storage(entryKey,null);
  $('join-view').hidden=true;$('own-view').hidden=false;
  $('own-name').textContent=data.name;$('phase').textContent=PHASES[data.phase]||'Consultando';
  const path=assetPath(data.character);$('own-kart').hidden=!path;if(path)$('own-kart').src=path;$('own-kart').alt=`Tu piloto: ${data.character.replaceAll('-',' ')}`;
  $('remaining').textContent=String(data.remaining);
  const terminal=data.phase==='closed'||data.phase==='expired'||data.state==='retirado'||Boolean(data.result);
  const ownOperation=pending && data.operations?.find(op=>op.operation_id===pending.operation_id);
  if(data.result || terminal) clearPending();
  else if(ownOperation?.state==='reserved') {
    clearPending();uncertain=true;message('Este envío no tiene resultado confirmado. El intento sigue gastado. Puedes esperar o decidir enviar otro código.',true);
  } else if(ownOperation?.state==='completed') {
    clearPending();uncertain=false;message('El envío terminó sin confirmar asistencia. Revisa las oportunidades restantes.',true);
  }
  $('code-form').hidden=data.phase!=='open'||terminal||data.remaining===0;
  $('send').disabled=actionWaiting||Boolean(pending);
  $('retry').hidden=!pending||terminal||data.phase!=='open';
  $('countdown').hidden=data.phase!=='countdown';
  $('result').hidden=!data.result||data.state==='retirado';
  if(data.state==='retirado') $('own-message').textContent='El profesor retiró tu asistencia. Tu plaza no vuelve a abrirse.';
  else if(data.result) {
    $('own-message').textContent='Asistencia confirmada.';
    $('position').textContent=`${data.result.position}.º`;
    $('result-time').textContent=new Date(data.result.checkedAt).toLocaleTimeString('es-ES');
    message('Asistencia confirmada.');if(oldResult!==data.result.id){$('position').tabIndex=-1;$('position').focus();}
  } else if(data.phase==='closed') $('own-message').textContent='La carrera terminó. No se ha registrado tu asistencia.';
  else if(data.remaining===0) $('own-message').textContent='Sin intentos. El resto de la parrilla puede continuar.';
  else if(data.phase==='lobby') $('own-message').textContent='Espera la salida.';
  else if(data.phase==='countdown') $('own-message').textContent='Prepárate.';
  else $('own-message').textContent='Introduce el código del profesor.';
  if(!oldPhase&&!data.result){$('own-name').tabIndex=-1;$('own-name').focus();}
  if(oldPhase && oldPhase!==data.phase && data.phase==='open'&&!terminal) $('code').focus();
  if(terminal) uncertain=false;
}

/** Lee disponibilidad sin reemplazar el nombre seleccionado durante cada consulta. :param data: lobby autorizado. :return: None. :rtype: void. Usage:: renderLobby(data) */
function renderLobby(data) {
  const selected=$('name').value;
  $('join-view').hidden=false;$('own-view').hidden=true;
  const key=JSON.stringify(data.roster);
  if($('name').dataset.roster!==key) {
    $('name').dataset.roster=key;
    $('name').replaceChildren(new Option('Selecciona tu nombre',''),...data.roster.map(slot=>new Option(`${slot.name}${slot.available?'':' · Ocupado'}`,slot.key,false,false)));
    [...$('name').options].forEach(option=>{const slot=data.roster.find(item=>item.key===option.value);option.disabled=slot?!slot.available:false;});
    if(data.roster.some(slot=>slot.key===selected&&slot.available))$('name').value=selected;
  }
}

/** Actualiza estado propio primero; un QR nunca repone un permiso después de Go. :return: None. :rtype: Promise<void>. Usage:: refresh() */
async function refresh() {
  const own=await request('/me');
  if(own.response.ok) { renderOwn(own.data);return; }
  if(own.response.status===410) { entry=null;storage(entryKey,null);clearPending();$('join-view').hidden=true;$('own-view').hidden=true;stopped=true;message(own.data.error,true);return; }
  if(own.response.status!==403)throw new Error(own.data.error||'No se pudo consultar tu estado.');
  if(joined||!entry) {
    clearPending();$('join-view').hidden=true;$('own-view').hidden=true;stopped=true;
    message('No tienes acceso a esta carrera. Abre la entrada vigente; después de la salida no se pueden reponer accesos.',true);return;
  }
  const lobby=await request('/lobby',{join_secret:entry},{'X-Race-Request':'1'});
  if(lobby.response.ok)renderLobby(lobby.data);
  else if([403,404,410].includes(lobby.response.status)) { entry=null;storage(entryKey,null);clearPending();stopped=true;message(lobby.data.error,true);$('join-view').hidden=true; }
  else throw new Error(lobby.data.error||'No se pudo consultar la parrilla.');
}

/** Mantiene una petición de estado pendiente como máximo. :return: None. :rtype: Promise<void>. Usage:: tick() */
async function tick() {
  clearTimeout(timer);if(busy||actionWaiting||stopped||document.hidden)return;busy=true;idle=new Promise(resolve=>{resolveIdle=resolve;});
  try { await refresh();delay=1000; } catch(error) { delay=Math.min(8000,delay*2);message(error.message||'Sin conexión. Consultaremos de nuevo tu estado.',true); }
  finally { busy=false;resolveIdle();$('join-button').disabled=actionWaiting;$('retry').disabled=actionWaiting;$('send').disabled=actionWaiting||Boolean(pending);if(!stopped&&!document.hidden)timer=setTimeout(tick,delay); }
}

$('join-form').addEventListener('submit',async event=>{
  event.preventDefault();if(!entry||!await beginAction())return;$('join-button').disabled=true;
  try {
    const {response,data}=await request('/join',{join_secret:entry,roster_key:$('name').value},{'X-Race-Request':'1'});
    if(response.ok){message('Listo.');renderOwn(data);}else message(data.error||'No se pudo ocupar la plaza.',true);
  }catch { message('No se recibió la respuesta. Consultaremos si este navegador conserva su plaza.',true); }
  finally {$('join-button').disabled=false;endAction();}
});

/** Envía o repite el mismo cuerpo, sin generar otra UUID para recuperarlo. :return: None. :rtype: Promise<void>. Usage:: submitPending() */
async function submitPending() {
  if(!pending||state?.phase!=='open'||!await beginAction())return;
  if(!pending||state?.phase!=='open'){endAction();return;}
  $('send').disabled=true;$('retry').disabled=true;
  try {
    const {response,data}=await request('/attempt',pending,{'X-Race-CSRF':state.csrfToken});
    if(response.status===503) message('El servicio está ocupado. Reintenta el mismo envío; conservaremos su identificador.',true);
    else if(response.status===202||response.status>=500) {
      uncertain=true;clearPending();message('No se pudo confirmar el envío. Consultaremos tu estado; no enviaremos otro código automáticamente.',true);
    } else {
      clearPending();uncertain=false;
      if(data.roster_key)renderOwn(data);
      if(!response.ok)message(data.error||'No se pudo registrar la llegada.',true);
    }
  }catch { message('No llegó la respuesta. Puedes reintentar el mismo envío sin gastar otro por repetirlo.',true); }
  finally { $('retry').disabled=false;$('retry').hidden=!pending;endAction(); }
}
$('code-form').addEventListener('submit',event=>{
  event.preventDefault();if(actionWaiting||pending||state?.phase!=='open'||state.remaining===0)return;
  if(!crypto.randomUUID){message('Este navegador necesita una conexión segura para enviar. Abre el enlace HTTPS del profesor.',true);return;}
  pending={operation_id:crypto.randomUUID(),code:$('code').value.trim()};storage(pendingKey,JSON.stringify(pending));uncertain=false;message('Confirmando tu llegada…');submitPending();
});
$('retry').addEventListener('click',submitPending);
let countdownTimer;
/** Reinicia la cuenta visual al recuperar una página de navegación. :return: None. :rtype: void. Usage:: startClock() */
function startClock(){clearInterval(countdownTimer);countdownTimer=setInterval(()=>{if(state?.phase==='countdown'&&!document.hidden){const text=countdownText(state,receivedAt);if($('countdown').textContent!==text)$('countdown').textContent=text;}},200);}
startClock();
document.addEventListener('visibilitychange',()=>{clearTimeout(timer);if(!document.hidden)tick();});
window.addEventListener('pagehide',()=>{clearTimeout(timer);clearInterval(countdownTimer);});
window.addEventListener('pageshow',()=>{startClock();if(!document.hidden)tick();});
if(!sid){stopped=true;message('Falta la carrera. Abre el enlace que comparte el profesor.',true);}else tick();
