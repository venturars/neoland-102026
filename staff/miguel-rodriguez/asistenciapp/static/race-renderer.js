// Dibujo del contrato de carrera: el servidor decide estados y puestos.
const ASSETS = new Set(['node-jack','espantatorres','mr-wobble','hombre-lobo-esther','ajolote','jack','vampire-king-leo','fantasmiko','mimo','fantasma','yomi','calabaza-aterradora','harry-universe','edgar-allan-poe','vicwolf']);
export const PHASES = { lobby:'Sala de espera', countdown:'A punto de salir', open:'En carrera', closed:'Carrera terminada', expired:'Acceso caducado' };

/** Imagen permitida del piloto. :param slug: clave recibida. :return: ruta local o null. :rtype: string|null. Usage:: assetPath('yomi') */
export function assetPath(slug) { return ASSETS.has(slug) ? `race-characters/${slug}.svg` : null; }

/** Crea DOM sin interpretar datos como HTML. :param tag: etiqueta. :param text: texto. :param className: clase. :return: elemento. :rtype: HTMLElement. Usage:: element('p','Listo') */
export function element(tag, text = '', className = '') {
  const node = document.createElement(tag); node.textContent = text; node.className = className; return node;
}

/** Dibuja plazas manteniendo nodos y foco. :param container: lista. :param roster: filas autorizadas. :param lobby: permitir retirada. :return: None. :rtype: void. Usage:: renderGrid(grid,state.roster,true) */
export function renderGrid(container, roster, lobby = false) {
  for (const slot of roster) {
    let row = [...container.children].find(node => node.dataset.key === slot.key);
    if (!row) {
      row = element('li', '', 'racer'); row.dataset.key = slot.key;
      const name = element('span', '', 'racer-name'); name.append(element('span',slot.name),element('span',slot.character.replaceAll('-',' '),'character-name'));
      const lane = element('div','','lane'); const img = element('img','','kart'); img.alt = `Kart de ${slot.name}`;
      const path = assetPath(slot.character); if (path) img.src = path; else img.hidden = true;
      lane.append(img); row.append(name,lane,element('span','','racer-status')); container.append(row);
    }
    row.className = `racer state-${slot.state}`;
    const status = row.lastElementChild;
    const text = slot.position ? `Puesto ${slot.position}` : ({pendiente:'Sin entrar',listo:slot.included?'Sin registrar':'Listo',registrado:'Registrado',retirado:'Retirado'}[slot.state] || 'Pendiente');
    if (status.dataset.state !== text + lobby) {
      status.dataset.state = text + lobby; status.replaceChildren(element(slot.position?'strong':'span',text));
      if (lobby && slot.state === 'listo') { const button = element('button','Retirar'); button.type='button';button.dataset.release=slot.key;button.setAttribute('aria-label',`Retirar a ${slot.name} de la parrilla`);status.append(button); }
    }
  }
}

/** Dibuja solo los puestos confirmados. :param container: podio. :param state: contrato profesor. :return: None. :rtype: void. Usage:: renderPodium(podium,state) */
export function renderPodium(container, state) {
  container.replaceChildren();
  for (const index of [1,0,2]) {
    const result = state.checkins[index]; if (!result) continue;
    const slot = state.roster.find(item => item.position === result.position);
    const step = element('div','',`podium-step place-${result.position}`);
    step.style.gridColumn = String(index===0?2:index===1?1:3);
    const img=element('img');img.alt=`${result.name}, puesto ${result.position}`;const path=assetPath(slot?.character);if(path)img.src=path;else img.hidden=true;
    step.append(img,element('b',String(result.position)),element('strong',result.name),element('span',['Oro','Plata','Bronce'][result.position-1]));container.append(step);
  }
  if (!state.checkins.length) container.append(element('p','Sin registros: hoy no hay medallas.'));
}

/** Anima ocho segundos sin decidir el resultado. :param container: parrilla. :param checkins: orden confirmado. :return: animaciones cancelables. :rtype: Animation[]. Usage:: finishRace(grid,state.checkins) */
export function finishRace(container, checkins) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return [];
  return checkins.map((result,index) => {
    const row = [...container.children].find(node => node.querySelector('.racer-status')?.textContent === `Puesto ${result.position}`);
    const kart=row?.querySelector('.kart');if(!kart)return null;
    const distance=Math.max(0,row.querySelector('.lane').clientWidth-kart.clientWidth-16);
    const duration=checkins.length===1?8000:5800+(index/(checkins.length-1))*2200;
    return kart.animate([{transform:`translateX(-${distance}px)`},{transform:'translateX(0)'}],{duration,easing:'cubic-bezier(.35,.05,.65,.95)',fill:'forwards'});
  }).filter(Boolean);
}

/** Cuenta atrás decorativa; no abre permisos. :param state: fase y reloj servidor. :param receivedAt: reloj monotónico recibido. :return: texto. :rtype: string. Usage:: countdownText(state,performance.now()) */
export function countdownText(state, receivedAt) {
  const left = (state.startsAt ?? state.serverNow) - state.serverNow - (performance.now()-receivedAt)/1000;
  if(left>2)return 'Preparados…';if(left>1)return 'Listos…';return left>0?'¡Ya casi!':'¡Ya!';
}
