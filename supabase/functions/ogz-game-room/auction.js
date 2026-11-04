import { auctionSeed } from "./auction-seed.js";
import { selectAuctionItems } from "./auction-selection.js";
import { returnToLobby } from "./room-lifecycle.js";
import { gameImage } from "./performance.js";
import { auctionCatalog } from "./auction-admin.js";
export const auctionCategories=Object.fromEntries(auctionSeed.categories.map(c=>[c.id,{name:c.name,icon:c.icon,items:c.products.map(p=>[p.name,p.icon,p.image,p.imageSource])}]));
function auctionPicture(item){if(!item)return null;const match=Object.values(auctionCategories).flatMap(c=>c.items).find(row=>row[0]===item.name);return {...item,image:gameImage(item.image||match?.[2]),imageSource:item.imageSource||match?.[3]}}
// Keep revealing one shuffled item at a time when only one player can bid.
function auctionChoice(r){
 if(r.state!=='playing'||r.bid)return null;
 const slots=r.players.filter(p=>p.plate.length<5),minimum=r.items[r.round]?.startPrice||1;
 const eligible=slots.filter(p=>p.balance>=minimum);if(eligible.length===2)return null;
 const candidates=eligible.length?eligible:slots.filter(p=>p.balance>0).length?slots.filter(p=>p.balance>0):slots;
 const player=candidates.find(p=>p.id===r.players[r.round%2]?.id)||candidates[0];
 const other=r.players.find(p=>p.id!==player?.id);
 return player?{playerId:player.id,price:player.balance>=minimum?minimum:0,canGive:other.plate.length<5}:null;
}
function auctionTurn(r){return r.state==='playing'?(auctionChoice(r)?.playerId||(r.bid?r.players.find(p=>p.id!==r.bid.playerId)?.id:r.players[r.round%2]?.id)):null}
function auctionView(r,token){const p=r.players.find(p=>p.token===token);return {code:r.code,mode:'auction',state:r.state,gameId:r.gameId,category:r.category,categoryName:r.categoryName||auctionCategories[r.category]?.name||'Açık artırma',round:r.round,rounds:10,budget:20,turnPlayerId:auctionTurn(r),choice:auctionChoice(r),serverNow:Date.now(),isHost:r.host===token,me:p?.id,players:r.players.map(({token,...p})=>({...p,plate:p.plate.map(auctionPicture)})),item:r.state==='lobby'||r.state==='finished'?null:auctionPicture(r.items[r.round]),bid:r.bid,lastSale:auctionPicture(r.lastSale),sales:r.sales.map(auctionPicture),auctionVersion:r.auctionVersion||0,lastGame:r.lastGame}}
function auctionAward(r,player,price,automatic=false){const item=r.items[r.round];player.balance-=price;player.plate.push({...item,price,automatic});const sale={...item,playerId:player.id,price,automatic};r.sales.push(sale);r.lastSale=sale}
function auctionNext(r){r.round++;r.bid=null;if(r.players.every(p=>p.plate.length===5)){returnToLobby(r);return}r.state='playing';r.deadline=null}
function auctionSettle(r){auctionAward(r,r.players.find(p=>p.id===r.bid.playerId),r.bid.amount);r.state='reveal';r.deadline=null}
export async function auctionApi(b,env){
 const reply=(v,status=200)=>Response.json(v,{status,headers:{'cache-control':'no-store'}}),token=b.token;
 if(b.action==='create'){
  const chosen=(await auctionCatalog(env)).catalog.categories.find(c=>c.id===b.category&&!c.archived);if(!chosen)return reply({error:'Açık artırma kategorisi seç.'},400);
  for(let n=0;n<8;n++){const r={code:crypto.randomUUID().replaceAll('-','').slice(0,6).toUpperCase(),host:token,mode:'auction',category:b.category,categoryName:chosen.name,state:'lobby',gameId:crypto.randomUUID(),expiresAt:Date.now()+86400000,round:0,players:[{...b.profile,token,id:crypto.randomUUID(),balance:20,plate:[],score:0}],sales:[],bid:null,items:[],auctionVersion:0};const out=await env.DB.prepare('INSERT OR IGNORE INTO rooms(code,data,created_at) VALUES(?,?,?)').bind(r.code,JSON.stringify(r),Date.now()).run();if(out.meta.changes)return reply(auctionView(r,token))}return reply({error:'Oda oluşturulamadı.'},503);
 }
 const code=String(b.code||'').trim().toUpperCase();if(!/^[A-F0-9]{6}$/.test(code))return reply({error:'Geçerli oda kodu gir.'},400);
 for(let retry=0;retry<8;retry++){
 const row=await env.DB.prepare('SELECT data,version FROM rooms WHERE code=?').bind(code).first();if(!row)return reply({error:'Oda bulunamadı.',closed:true},404);const r=JSON.parse(row.data);if(r.mode!=='auction')return reply({error:'Geçersiz oyun modu.'},400);if(r.state==='closed'||Date.now()>=r.expiresAt)return reply({error:'Oda kapatıldı.',closed:true},410);
 let player=r.players.find(p=>p.token===token);if(!player&&b.action!=='join')return reply({error:'Önce odaya katılmalısın.'},403);
 if(b.gameId&&b.gameId!==r.gameId&&['bid','choose','next','restart','pass'].includes(b.action))return reply({error:'Oyun değişti. Odayı yenile.'},409);
 let changed=false,error=null,recordSelection=false;if(r.state==='finished'&&b.action==='get'){returnToLobby(r);changed=true}
 if(b.action==='join'&&!player){if(r.state!=='lobby'||r.players.length>=2)return reply({error:'Bu oyun iki kişilik. Oda dolu veya oyun başladı.'},409);r.players.push({...b.profile,token,id:crypto.randomUUID(),balance:20,plate:[],score:0});changed=true}
 else if(b.action==='start'||b.action==='restart'){
 if(r.host!==token||!(b.action==='start'?r.state==='lobby':r.state==='finished'||(r.state==='lobby'&&r.lastGame)))return reply({error:'Oyunu yalnızca oda sahibi başlatabilir.'},403);if(r.players.length!==2)return reply({error:'Açık artırma için iki oyuncu gerekli.'},409);
 const category=(await auctionCatalog(env)).catalog.categories.find(c=>c.id===r.category&&!c.archived);if(!category||category.products.filter(p=>!p.archived).length<10)return reply({error:'Bu kategoride en az 10 aktif ürün gerekli.'},409);r.categoryName=category.name;r.gameId=crypto.randomUUID();const tokens=r.players.map(p=>p.token);const history=await env.DB.prepare('SELECT listing_id,SUM(seen_count) AS seen_count,MAX(seen_at) AS last_seen FROM listing_history WHERE token IN ('+tokens.map(()=>'?').join(',')+') GROUP BY listing_id').bind(...tokens).all();r.items=selectAuctionItems(category.products.map(p=>({...p,historyKey:'auction:'+r.category+':'+p.id})),history.results);recordSelection=true;r.round=0;r.bid=null;r.sales=[];r.lastSale=null;r.players.forEach(p=>{p.balance=20;p.plate=[]});r.state='playing';r.deadline=null;r.expiresAt=Date.now()+86400000;changed=true;
 }else if(b.action==='bid'){
 const amount=Number(b.amount);if(r.state!=='playing'||b.round!==r.round)error='Bu ürünün açık artırması kapandı.';
 else if(auctionChoice(r))error='Bu ürünü al veya rakibine ver.';
 else if(auctionTurn(r)!==player.id)error='Teklif sırası rakibinde.';
 else if(!Number.isSafeInteger(amount)||amount<1||amount>player.balance)error='Kalan bütçene uygun tam TL teklif et.';
 else if(player.plate.length>=5)error='Tabağın dolu; 5 ürün aldın.';
 else if(r.bid?.playerId===player.id)error='En yüksek teklif zaten sende.';
 else if(amount<Math.max((r.bid?.amount||0)+1,r.items[r.round].startPrice||1))error='Başlangıç fiyatına uygun, mevcut tekliften en az 1 TL fazla teklif et.';
 else{r.bid={amount,playerId:player.id};r.deadline=null;r.noBidNotice=false;changed=true}
 }else if(b.action==='choose'){
 const choice=auctionChoice(r),other=r.players.find(p=>p.id!==player.id);
 if(r.state!=='playing'||b.round!==r.round)error='Bu ürünün seçimi kapandı.';
 else if(!choice||choice.playerId!==player.id)error='Ürün seçme sırası rakibinde.';
 else if(!['keep','give'].includes(b.decision))error='Bu ürünü al veya rakibine ver.';
 else if(b.decision==='give'&&!choice.canGive)error='Rakibin 5 ürün aldı; bu ürünü kendine almalısın.';
 else{const price=b.decision==='keep'?choice.price:0;auctionAward(r,b.decision==='keep'?player:other,price,price===0);r.state='reveal';r.deadline=null;changed=true}
 }else if(b.action==='pass'){
 if(r.state!=='playing'||b.round!==r.round)error='Bu ürünün açık artırması kapandı.';
 else if(auctionTurn(r)!==player.id)error='Teklif sırası rakibinde.';
 else if(!r.bid||r.bid.playerId===player.id)error='Önce ilk teklif verilmeli. Rakibinin teklifinden sonra Kal diyebilirsin.';
 else{auctionSettle(r);changed=true}
 }else if(b.action==='next'){
 if(r.host!==token||r.state!=='reveal'||b.round!==r.round)error='Sonraki ürünü oda sahibi açar.';else{auctionNext(r);changed=true}
 }else if(b.action==='close'||b.action==='leave'){
 if(b.action==='close'&&r.host!==token)return reply({error:'Odayı yalnızca oda sahibi kapatabilir.'},403);
 if(r.state==='lobby'&&b.action==='leave'&&r.host!==token)r.players=r.players.filter(p=>p.token!==token);else r.state='closed';changed=true;
 }else if(!['get','join'].includes(b.action))error='Geçersiz işlem.';
 if(!changed){if(error)return reply({error},409);return reply(auctionView(r,token))}
 r.auctionVersion=(r.auctionVersion||0)+1;const update=env.DB.prepare('UPDATE rooms SET data=?,version=version+1 WHERE code=? AND version=?').bind(JSON.stringify(r),code,row.version);let result;if(recordSelection){const writes=[];for(const p of r.players)for(const [round,item] of r.items.entries())writes.push(env.DB.prepare("INSERT INTO listing_history(token,listing_id,room_code,round_number,seen_at,seen_count) SELECT ?,?,?,?,?,1 WHERE EXISTS(SELECT 1 FROM rooms WHERE code=? AND version=?) ON CONFLICT(token,listing_id) DO UPDATE SET room_code=excluded.room_code,round_number=excluded.round_number,seen_at=excluded.seen_at,seen_count=listing_history.seen_count+1").bind(p.token,'auction:'+r.category+':'+item.id,code,round,Date.now(),code,row.version));const batch=await env.DB.batch([...writes,update]);result=batch[batch.length-1]}else result=await update.run();if(!result.meta.changes)continue;
 if(error)return reply({error},409);if(r.state==='closed')return reply({closed:true});if(b.action==='leave')return reply({left:true});return reply(auctionView(r,token));
 }return reply({error:'Teklifler güncelleniyor, tekrar dene.'},409);
}
