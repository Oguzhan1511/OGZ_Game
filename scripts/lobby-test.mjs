import assert from 'node:assert/strict';
import vm from 'node:vm';
import { lobbyClient } from '../worker/ui/lobby.js';
import worker from '../worker/index.js';
const nodes=new Map(Object.entries({
 '#game-mode':{value:'car-price'},'#room-rounds':{value:'10'},'#guess-seconds':{value:'30'},
 '#lobby-settings':{dataset:{game:'game-1'}},'#lobby-save-state':{dataset:{}},'#lobby-start':{disabled:false}
}));
const calls=[],pending=[];
const initial={code:'ABC123',gameId:'game-1',state:'lobby',isHost:true,mode:'car-price',rounds:10,guessSeconds:30,players:[{id:'host'}]};
const sandbox={room:initial,busy:false,$:key=>nodes.get(key),document:{querySelector:()=>null,querySelectorAll:()=>[]},setTimeout,clearTimeout,toast:()=>{},selectedProductCategories:()=>['market'],console};
sandbox.call=async(action,options)=>{calls.push({action,options:{...options},gameId:sandbox.room.gameId});return new Promise((resolve,reject)=>pending.push({resolve,reject}))};
vm.createContext(sandbox);vm.runInContext(lobbyClient,sandbox);
// Rapid host edits must serialize and use the updated game id, while retaining the latest draft.
nodes.get('#room-rounds').value='15';vm.runInContext('lobbyRevision++;',sandbox);
const first=vm.runInContext('persistLobbySettings()',sandbox);
assert.equal(calls.length,1);assert.equal(calls[0].gameId,'game-1');
nodes.get('#guess-seconds').value='60';vm.runInContext('lobbyRevision++;',sandbox);
pending.shift().resolve({...initial,rounds:15,gameId:'game-2'});
await new Promise(resolve=>setImmediate(resolve));
assert.equal(calls.length,2);assert.equal(calls[1].gameId,'game-2');assert.equal(calls[1].options.guessSeconds,60);
pending.shift().resolve({...initial,rounds:15,guessSeconds:60,gameId:'game-3'});await first;
assert.equal(nodes.get('#lobby-settings').dataset.game,'game-3');assert.equal(nodes.get('#lobby-save-state').dataset.state,'saved');assert.equal(nodes.get('#lobby-start').disabled,false);
// An unchanged lobby should not generate a new game id / unnecessary API write.
await vm.runInContext('persistLobbySettings()',sandbox);assert.equal(calls.length,2);
// Guests cannot send settings, even when invoked outside the disabled UI.
sandbox.room.isHost=false;nodes.get('#room-rounds').value='20';await vm.runInContext('persistLobbySettings()',sandbox);assert.equal(calls.length,2);
// API failures remain visible and retryable rather than silently starting with unsaved options.
sandbox.room.isHost=true;vm.runInContext('lobbyRevision++;',sandbox);const failed=vm.runInContext('persistLobbySettings()',sandbox);pending.shift().reject(Error('Offline'));await assert.rejects(failed,/Offline/);assert.equal(nodes.get('#lobby-save-state').dataset.state,'error');
const retried=vm.runInContext('persistLobbySettings()',sandbox);pending.shift().resolve({...sandbox.room,rounds:20,gameId:'game-4'});await retried;assert.equal(nodes.get('#lobby-save-state').dataset.state,'saved');
let bytes=0;for(const mode of ['car-price','product-price','auction','number-race','battleship','hero-car-price','hero-product-price','hero-auction','hero-battleship','hero-number-race']){const response=await worker.fetch(new Request('http://localhost/lobby-art/'+mode+'.webp'),{});assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'image/webp');const data=Buffer.from(await response.arrayBuffer());assert.equal(data.toString('ascii',0,4),'RIFF');bytes+=data.length}
console.log('PASS: serialized lobby edits, latest-draft preservation, fresh game IDs, no-op saves, guest authorization, visible failures/retry, ten optimized lobby assets ('+bytes+' bytes).');
