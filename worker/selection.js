// Prefer unseen listings, spread brands/models, and recycle older listings when needed.
export function selectListings(cars, rounds, excluded=new Set(), random=Math.random, history=new Map()){
 const normalize=value=>String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').toLowerCase().replace(/[^a-z0-9]/g,'');
 const ids=new Set(),entries=[];
 cars.forEach((car,index)=>{const meta=car[11];if(meta?.source!=='user'||excluded.has(meta.id)||ids.has(meta.id))return;ids.add(meta.id);const seen=history.get(meta.id);entries.push({index,id:meta.id,brand:car[0],family:normalize(meta.family)||normalize(car[0]+' '+car[1]),category:meta.vehicleType==='suv'?'suv':'automobile',seen:!!seen,count:seen?.seenCount||1,last:seen?.lastSeen||0,priceBand:Math.floor(Math.log10(Math.max(1,car[6]))*2)})});
 if(entries.length<rounds)return {error:rounds+' tur için '+entries.length+' uygun ilan var. Daha az tur seç veya diğer açık oyunların bitmesini bekle.',available:entries.length};
 const availableFamilies=new Set(entries.map(e=>e.family)).size;if(availableFamilies<rounds)return {error:rounds+' tur için '+availableFamilies+' farklı model ailesi var. Aynı model tekrarlanmaması için daha az tur seç.',available:availableFamilies};
 const fresh=entries.filter(e=>!e.seen),old=entries.filter(e=>e.seen);
 // When fresh stock is ample, only some games contain a 10% nostalgia round.
 const freshFamilies=new Set(fresh.map(e=>e.family)).size;
 const occasional=freshFamilies>=rounds&&old.length&&random()<.3?Math.max(1,Math.floor(rounds*.1)):0;
 const repeatTarget=Math.min(old.length,Math.max(rounds-freshFamilies,occasional));
 const positions=Array.from({length:rounds},(_,i)=>i);for(let i=positions.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[positions[i],positions[j]]=[positions[j],positions[i]]}const repeatSlots=new Set(positions.slice(0,repeatTarget));
 const brands=new Map(),families=new Map(),bands=new Map(),categories=new Map(),order=[];let previous=null,repeated=0;
 const pick=items=>items[Math.floor(random()*items.length)];
 for(let round=0;round<rounds;round++){
  let pool=repeatSlots.has(round)?old:fresh;if(!pool.length)pool=fresh.length?fresh:old;
  if(pool===old){const minCount=Math.min(...pool.map(e=>e.count));let least=pool.filter(e=>e.count===minCount).sort((a,b)=>a.last-b.last);pool=least.slice(0,Math.max(1,Math.ceil(least.length*.5)))}
  const score=e=>(families.get(e.family)||0)*100+(e.brand===previous?30:0)+(brands.get(e.brand)||0)*10+(categories.get(e.category)||0)*12+(bands.get(e.priceBand)||0);
  const best=Math.min(...pool.map(score));const chosen=pick(pool.filter(e=>score(e)===best));order.push(chosen.index);if(chosen.seen)repeated++;
  for(const source of [fresh,old])for(let i=source.length-1;i>=0;i--)if(source[i].family===chosen.family)source.splice(i,1);categories.set(chosen.category,(categories.get(chosen.category)||0)+1);brands.set(chosen.brand,(brands.get(chosen.brand)||0)+1);families.set(chosen.family,(families.get(chosen.family)||0)+1);bands.set(chosen.priceBand,(bands.get(chosen.priceBand)||0)+1);previous=chosen.brand;
 }
 return {order,available:entries.length,repeated,brandCap:Math.max(...brands.values())};
}
