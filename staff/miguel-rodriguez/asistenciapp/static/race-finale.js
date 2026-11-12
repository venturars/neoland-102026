// Calendario puramente decorativo: el servidor conserva asistencia, fases y puestos.
/** Tramo desde observar el cierre. :param milliseconds: tiempo transcurrido. :return: fase, número y tiempo de recorrido. :rtype: {phase:string,digit:number|null,elapsed:number}. Usage:: finaleFrame(3000) */
export function finaleFrame(milliseconds) {
  const time=Math.max(0,milliseconds);
  return {phase:time<2000?'winner':time<5000?'countdown':time<13000?'finish':'podium',digit:time>=2000&&time<5000?Math.ceil((5000-time)/1000):null,elapsed:Math.max(0,time-5000)};
}
/** Duración por puesto confirmado, sin calcular ganadores. :param position: puesto desde uno. :param count: finalistas. :return: milisegundos. :rtype: number. Usage:: finishDuration(1,3) */
export function finishDuration(position,count) {return count<=1?8000:5800+((position-1)/(count-1))*2200;}
