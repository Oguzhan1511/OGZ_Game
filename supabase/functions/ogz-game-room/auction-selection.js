// Shuffle equally familiar products, then prefer unseen and least-recently-seen items.
export function selectAuctionItems(products,history=[],random=Math.random){
 const seen=new Map(history.map(h=>[h.listing_id,{count:Number(h.seen_count)||0,time:Number(h.last_seen)||0}]));
 const pool=products.filter(p=>!p.archived).map(p=>({...p}));
 for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
 pool.sort((a,b)=>{const x=seen.get(a.historyKey||a.id)||{count:0,time:0},y=seen.get(b.historyKey||b.id)||{count:0,time:0};return x.count-y.count||x.time-y.time});
 const chosen=pool.slice(0,10);for(let i=chosen.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[chosen[i],chosen[j]]=[chosen[j],chosen[i]]}
 return chosen.map(({historyKey,...item})=>item);
}
