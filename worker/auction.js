export const auctionCategories={
 'gun-tabagi':{name:'Gün tabağı',icon:'🫖',items:[['Yaprak sarma','🍃'],['Su böreği','🥧'],['İçli köfte','🧆'],['Poğaça','🥐'],['Mercimek köftesi','🥙'],['Kısır','🥗'],['Rus salatası','🥣'],['Patates salatası','🥔'],['Tuzlu kurabiye','🍪'],['Salatalık dilimleri','🥒']]},
 'kahvalti':{name:'Kahvaltı sofrası',icon:'🍳',items:[['Menemen','🍳'],['Sucuklu yumurta','🥘'],['Pişi','🥯'],['Bal kaymak','🍯'],['Sıcak simit','🥨'],['Beyaz peynir','🧀'],['Zeytin','🫒'],['Reçel','🍓'],['Domates','🍅'],['Salatalık','🥒']]}
};
function auctionView(r,token){const p=r.players.find(p=>p.token===token);return {code:r.code,mode:'auction',state:r.state,gameId:r.gameId,category:r.category,categoryName:auctionCategories[r.category].name,round:r.round,rounds:10,budget:20,guessSeconds:15,deadline:r.deadline,serverNow:Date.now(),isHost:r.host===token,me:p?.id,players:r.players.map(({token,...p})=>p),item:r.state==='lobby'||r.state==='finished'?null:r.items[r.round],bid:r.bid,lastSale:r.lastSale,sales:r.sales,auctionVersion:r.auctionVersion||0}}
function auctionAward(r,player,price,automatic=false){const item=r.items[r.round];player.balance-=price;player.plate.push({...item,price,automatic});const sale={...item,playerId:player.id,price,automatic};r.sales.push(sale);r.lastSale=sale}
function auctionNext(r){r.round++;r.bid=null;while(r.round<10){const slots=r.players.filter(p=>p.plate.length<5);if(slots.length===2&&slots.every(p=>p.balance>0)){r.state='playing';r.deadline=Date.now()+15000;return}const eligible=slots.filter(p=>p.balance>0);const winner=eligible[0]||slots[0];auctionAward(r,winner,0,true);r.round++}r.state='finished';r.deadline=null}
function auctionSettle(r){if(r.bid){auctionAward(r,r.players.find(p=>p.id===r.bid.playerId),r.bid.amount);r.state='reveal';r.deadline=null}else{r.bid=null;r.deadline=Date.now()+15000;r.noBidNotice=true}}
export async function auctionApi(b,env){
 const reply=(v,status=200)=>Response.json(v,{status,headers:{'cache-control':'no-store'}}),token=b.token;
 if(b.action==='create'){
  if(!Object.hasOwn(auctionCategories,b.category))return reply({error:'Açık artırma kategorisi seç.'},400);
  for(let n=0;n<8;n++){const r={code:crypto.randomUUID().replaceAll('-','').slice(0,6).toUpperCase(),host:token,mode:'auction',category:b.category,state:'lobby',gameId:crypto.randomUUID(),expiresAt:Date.now()+86400000,round:0,players:[{...b.profile,token,id:crypto.randomUUID(),balance:20,plate:[],score:0}],sales:[],bid:null,items:[],auctionVersion:0};const out=await env.DB.prepare('INSERT OR IGNORE INTO rooms(code,data,created_at) VALUES(?,?,?)').bind(r.code,JSON.stringify(r),Date.now()).run();if(out.meta.changes)return reply(auctionView(r,token))}return reply({error:'Oda oluşturulamadı.'},503);
 }
 const code=String(b.code||'').trim().toUpperCase();if(!/^[A-F0-9]{6}$/.test(code))return reply({error:'Geçerli oda kodu gir.'},400);
 for(let retry=0;retry<8;retry++){
 const row=await env.DB.prepare('SELECT data,version FROM rooms WHERE code=?').bind(code).first();if(!row)return reply({error:'Oda bulunamadı.',closed:true},404);const r=JSON.parse(row.data);if(r.mode!=='auction')return reply({error:'Geçersiz oyun modu.'},400);if(r.state==='closed'||Date.now()>=r.expiresAt)return reply({error:'Oda kapatıldı.',closed:true},410);
 let player=r.players.find(p=>p.token===token);if(!player&&b.action!=='join')return reply({error:'Önce odaya katılmalısın.'},403);
 if(b.gameId&&b.gameId!==r.gameId&&['bid','next','restart','pass'].includes(b.action))return reply({error:'Oyun değişti. Odayı yenile.'},409);
 let changed=false,error=null;const expired=r.state==='playing'&&Date.now()>=r.deadline;if(expired){auctionSettle(r);changed=true}
 if(b.action==='join'&&!player){if(r.state!=='lobby'||r.players.length>=2)return reply({error:'Bu oyun iki kişilik. Oda dolu veya oyun başladı.'},409);r.players.push({...b.profile,token,id:crypto.randomUUID(),balance:20,plate:[],score:0});changed=true}
 else if(b.action==='start'||b.action==='restart'){
 if(r.host!==token||r.state!==(b.action==='start'?'lobby':'finished'))return reply({error:'Oyunu yalnızca oda sahibi başlatabilir.'},403);if(r.players.length!==2)return reply({error:'Açık artırma için iki oyuncu gerekli.'},409);
 r.gameId=crypto.randomUUID();r.items=auctionCategories[r.category].items.map(([name,icon],i)=>({id:r.category+'-'+i,name,icon}));for(let i=9;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r.items[i],r.items[j]]=[r.items[j],r.items[i]]}r.round=0;r.bid=null;r.sales=[];r.lastSale=null;r.players.forEach(p=>{p.balance=20;p.plate=[]});r.state='playing';r.deadline=Date.now()+15000;r.expiresAt=Date.now()+86400000;changed=true;
 }else if(b.action==='bid'){
 const amount=Number(b.amount);if(expired||r.state!=='playing'||b.round!==r.round)error='Bu ürünün teklif süresi kapandı.';
 else if(!Number.isSafeInteger(amount)||amount<1||amount>player.balance)error='Kalan bütçene uygun tam TL teklif et.';
 else if(player.plate.length>=5)error='Tabağın dolu; 5 ürün aldın.';
 else if(r.bid?.playerId===player.id)error='En yüksek teklif zaten sende.';
 else if(amount<=(r.bid?.amount||0))error='Mevcut tekliften en az 1 TL fazla teklif et.';
 else{r.bid={amount,playerId:player.id};r.deadline=Date.now()+15000;r.noBidNotice=false;changed=true}
 }else if(b.action==='pass'){
 if(expired||r.state!=='playing'||b.round!==r.round)error='Bu ürünün teklif süresi kapandı.';
 else if(!r.bid||r.bid.playerId===player.id)error='Rakibinin teklifinden sonra çekilebilirsin.';
 else{auctionSettle(r);changed=true}
 }else if(b.action==='next'){
 if(r.host!==token||r.state!=='reveal'||b.round!==r.round)error='Sonraki ürünü oda sahibi açar.';else{auctionNext(r);changed=true}
 }else if(b.action==='close'||b.action==='leave'){
 if(b.action==='close'&&r.host!==token)return reply({error:'Odayı yalnızca oda sahibi kapatabilir.'},403);
 if(r.state==='lobby'&&b.action==='leave'&&r.host!==token)r.players=r.players.filter(p=>p.token!==token);else r.state='closed';changed=true;
 }else if(!['get','join'].includes(b.action))error='Geçersiz işlem.';
 if(!changed){if(error)return reply({error},409);return reply(auctionView(r,token))}
 r.auctionVersion=(r.auctionVersion||0)+1;const result=await env.DB.prepare('UPDATE rooms SET data=?,version=version+1 WHERE code=? AND version=?').bind(JSON.stringify(r),code,row.version).run();if(!result.meta.changes)continue;
 if(error)return reply({error},409);if(r.state==='closed')return reply({closed:true});if(b.action==='leave')return reply({left:true});return reply(auctionView(r,token));
 }return reply({error:'Teklifler güncelleniyor, tekrar dene.'},409);
}
