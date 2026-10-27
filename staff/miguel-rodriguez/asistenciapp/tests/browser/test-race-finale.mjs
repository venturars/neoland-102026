import test from 'node:test';
import assert from 'node:assert/strict';
import { finaleFrame, finishDuration } from '../../static/race-finale.js';
for (const [time,phase,digit] of [[0,'winner',null],[1999,'winner',null],[2000,'countdown',3],[2999,'countdown',3],[3000,'countdown',2],[3999,'countdown',2],[4000,'countdown',1],[4999,'countdown',1],[5000,'finish',null],[12999,'finish',null],[13000,'podium',null]]) {
 test(`Tramo a ${time} ms`,()=>assert.deepEqual(finaleFrame(time),{phase,digit,elapsed:Math.max(0,time-5000)}));
}
test('Un único finalista dispone de ocho segundos',()=>assert.equal(finishDuration(1,1),8000));
for(const count of [2,3,15])test(`Orden creciente para ${count} finalistas`,()=>{
 const durations=Array.from({length:count},(_,i)=>finishDuration(i+1,count));
 assert.equal(durations[0],5800);assert.equal(durations.at(-1),8000);
 assert.ok(durations.every((value,i)=>!i||value>durations[i-1]));
});
