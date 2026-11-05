import {returnToLobby} from '../../room-lifecycle.js';
export const validGridSize=n=>[4,6,10].includes(n);
export function numberRaceState(size=6){return {gridSize:size,usedNumbers:[],race:{phase:'choose',turnId:crypto.randomUUID(),target:null,board:[],wrong:[],deadline:null,lastTurn:null},round:0,startedAt:null}}
function numberRaceShuffle(n){const a=Array.from({length:n},(_,i)=>i+1);for(let i=n-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function numberRaceRoles(r){return {chooser:r.players[r.round%2],searcher:r.players[(r.round+1)%2]}}
function numberRaceView(r,token){const me=r.players.find(p=>p.token===token),{chooser,searcher}=numberRaceRoles(r);return {code:r.code,mode:r.mode,state:r.state,gameId:r.gameId,gridSize:r.gridSize,usedNumbers:r.usedNumbers||[],round:r.round,isHost:r.host===token,me:me?.id,serverNow:Date.now(),raceVersion:r.raceVersion||0,players:r.players.map(({id,name,avatar,marks,score})=>({id,name,avatar,marks,score})),race:{...r.race,board:r.state==='playing'&&r.race.phase==='search'&&me?.id===searcher?.id?r.race.board:[],chooserId:chooser?.id,searcherId:searcher?.id},startedAt:r.startedAt,lastGame:r.lastGame}}
function numberRaceNextTurn(r,reason,now){if((r.usedNumbers||[]).length>=r.gridSize**2)r.usedNumbers=[];const {chooser,searcher}=numberRaceRoles(r);r.race={phase:'choose',turnId:crypto.randomUUID(),target:null,board:[],wrong:[],deadline:null,lastTurn:{reason,target:r.race.target,chooserId:chooser.id,searcherId:searcher.id,turnId:r.race.turnId,startsAt:r.race.startsAt,endedAt:reason==='timeout'?Math.min(now,r.race.deadline):now}};r.round++}
function numberRaceFinish(r,winner,now){const result={mode:'number-race',finishedAt:now,gridSize:r.gridSize,winnerId:winner.id,totalRounds:r.round+1,elapsedMs:now-r.startedAt,players:r.players.map(({id,name,avatar,marks})=>({id,name,avatar,marks:[...marks],score:marks.length}))};returnToLobby(r);r.lastGame=result;Object.assign(r,numberRaceState(r.gridSize));r.players.forEach(p=>{p.marks=[];p.score=0})}
export async function numberRaceApi(b,env){
 const reply=(v,s=200)=>Response.json(v,{status:s,headers:{'cache-control':'no-store'}}),token=b.token;
 if(b.action==='create'){
  const size=b.gridSize??6;if(!validGridSize(size))return reply({error:'4×4, 6×6 veya 10×10 tablo seç.'},400);
  for(let i=0;i<8;i++){const r={code:crypto.randomUUID().replaceAll('-','').slice(0,6).toUpperCase(),host:token,mode:'number-race',state:'lobby',gameId:crypto.randomUUID(),expiresAt:Date.now()+86400000,players:[{...b.profile,token,id:crypto.randomUUID(),marks:[],score:0}],...numberRaceState(size)};const out=await env.DB.prepare('INSERT OR IGNORE INTO rooms(code,data,created_at) VALUES(?,?,?)').bind(r.code,JSON.stringify(r),Date.now()).run();if(out.meta.changes)return reply(numberRaceView(r,token))}return reply({error:'Oda oluşturulamadı.'},503);
 }
 const code=String(b.code||'').trim().toUpperCase();if(!/^[A-F0-9]{6}$/.test(code))return reply({error:'Geçerli oda kodu gir.'},400);
 for(let retry=0;retry<8;retry++){
  const row=await env.DB.prepare('SELECT data,version FROM rooms WHERE code=?').bind(code).first();if(!row)return reply({error:'Oda bulunamadı.',closed:true},404);
  const r=JSON.parse(row.data),now=Date.now();if(r.mode!=='number-race')return reply({error:'Geçersiz oyun modu.'},400);if(r.state==='closed'||now>=r.expiresAt)return reply({error:'Oda kapatıldı.',closed:true},410);
  const player=r.players.find(p=>p.token===token);if(!player&&b.action!=='join')return reply({error:'Önce odaya katıl.'},403);
  if(['pick-number','find-number','mark-cells','start'].includes(b.action)&&b.gameId&&b.gameId!==r.gameId)return reply({error:'Oyun değişti. Güncel odada tekrar dene.'},409);
  let changed=false,error=null;
  if(r.state==='playing'&&r.race.phase==='ready'&&now>=r.race.startsAt){r.race.phase='search';changed=true}
  if(r.state==='playing'&&r.race.phase==='search'&&now>=r.race.deadline){numberRaceNextTurn(r,'timeout',now);changed=true}
  if(b.action==='join'&&!player){if(r.state!=='lobby'||r.players.length>=2)return reply({error:'Sayı Yarışı iki kişilik. Oda dolu veya oyun başladı.'},409);r.players.push({...b.profile,token,id:crypto.randomUUID(),marks:[],score:0});changed=true}
  else if(b.action==='start'){
   if(r.host!==token||r.state!=='lobby')return reply({error:'Oyunu lobide yalnızca oda sahibi başlatabilir.'},403);
   if(r.players.length!==2)return reply({error:'Sayı Yarışı için iki oyuncu gerekli.'},409);
   Object.assign(r,numberRaceState(r.gridSize));r.gameId=crypto.randomUUID();r.state='playing';r.startedAt=now;r.players.forEach(p=>{p.marks=[];p.score=0});r.expiresAt=now+86400000;changed=true;
  }else if(['pick-number','find-number','mark-cells'].includes(b.action)){
   const {chooser,searcher}=numberRaceRoles(r),n=r.gridSize*r.gridSize;
   const previous=r.race.lastTurn,late=b.action==='mark-cells'&&previous?.turnId===b.turnId&&previous.chooserId===player.id&&now-previous.endedAt<=8000&&Array.isArray(b.clicks)&&b.clicks.length===b.cells?.length&&b.clicks.every((c,i)=>c&&c.index===b.cells[i]&&Number.isFinite(c.at)&&c.at>=previous.startsAt&&c.at<=previous.endedAt);
   if(r.state!=='playing'||(b.turnId!==r.race.turnId&&!late))error='Tur değişti. Güncel tabloyla devam et.';
   else if(b.action==='pick-number'){
    if(r.race.phase!=='choose'||player.id!==chooser.id)error='Hedef sayı seçme sırası rakibinde.';
    else if(!Number.isInteger(b.number)||b.number<1||b.number>n)error='Tablodaki sayılardan birini seç.';
    else if((r.usedNumbers||[]).includes(b.number))error='Bu sayı önceki turlarda seçildi. Başka bir sayı seç.';
    else{r.usedNumbers=[...(r.usedNumbers||[]),b.number];r.race.phase='ready';r.race.startsAt=now+2000;r.race.target=b.number;r.race.board=numberRaceShuffle(n);r.race.wrong=[];r.race.deadline=r.race.startsAt+20000;changed=true}
   }else if(r.race.phase!=='search'&&!late)error='Önce hedef sayı seçilmeli.';
   else if(b.action==='find-number'){
    if(player.id!==searcher.id)error='Sayıyı arama sırası rakibinde.';
    else if(!Number.isInteger(b.index)||b.index<0||b.index>=n)error='Geçerli kutuyu seç.';
    else if(r.race.board[b.index]===r.race.target){numberRaceNextTurn(r,'found',now);changed=true}
    else if(!r.race.wrong.includes(b.index)){r.race.wrong.push(b.index);changed=true}
   }else{
    if(player.id!==chooser.id&&!late)error='Kutucuk işaretleme sırası rakibinde.';
    else if(!Array.isArray(b.cells)||!b.cells.length||b.cells.length>n||b.cells.some(i=>!Number.isInteger(i)||i<0||i>=n))error='Geçerli kutulara tek tek bas.';
    else{player.marks=[...new Set([...player.marks,...b.cells])];player.score=player.marks.length;changed=true;if(player.marks.length===n)numberRaceFinish(r,player,now)}
   }
  }else if(b.action==='close'||b.action==='leave'){
   if(b.action==='close'&&r.host!==token)return reply({error:'Odayı yalnızca oda sahibi kapatabilir.'},403);
   if(b.action==='leave'&&r.state==='lobby'&&r.host!==token)r.players=r.players.filter(p=>p.token!==token);else r.state='closed';changed=true;
  }else if(!['get','join'].includes(b.action))error='Geçersiz işlem.';
  if(changed){r.raceVersion=(r.raceVersion||0)+1;const saved=await env.DB.prepare('UPDATE rooms SET data=?,version=version+1 WHERE code=? AND version=?').bind(JSON.stringify(r),code,row.version).run();if(!saved.meta.changes)continue}
  if(error)return reply({error},409);if(r.state==='closed')return reply({closed:true});if(b.action==='leave')return reply({left:true});return reply(numberRaceView(r,token));
 }return reply({error:'Oyun güncelleniyor. Tekrar dene.'},409);
}
