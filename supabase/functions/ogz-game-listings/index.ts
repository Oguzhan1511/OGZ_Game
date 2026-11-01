// Only OGZ Game's server can use this function. No browser keys or public prices.
Deno.serve(async (req: Request) => {
 const reply=(body: unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
 try {
  const base=Deno.env.get('SUPABASE_URL')!, key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const headers={apikey:key,authorization:'Bearer '+key,'content-type':'application/json'};
  const provided=req.headers.get('x-ogz-key');if(!provided||provided.length!==64)return reply({error:'Unauthorized'},401);
  const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(provided))),b=>b.toString(16).padStart(2,'0')).join('');
  const config=await fetch(base+'/rest/v1/ogz_game_integration?id=eq.sites&select=key_hash',{headers});if(!config.ok)throw Error('config');const rows=await config.json();if(rows[0]?.key_hash!==digest)return reply({error:'Unauthorized'},401);
  if(req.method==='GET'){
   const res=await fetch(base+'/rest/v1/ogz_game_listings?select=*&order=created_at.desc,id.asc&limit=10000',{headers});if(!res.ok)throw Error('read');return reply({listings:(await res.json()).map((r: any)=>({id:r.id,mode:r.mode,car:r.car,createdAt:r.created_at,archived:r.archived}))});
  }
  if(req.method!=='POST')return reply({error:'Method not allowed'},405);
  if(Number(req.headers.get('content-length'))>2000000)return reply({error:'Too large'},413);
  const input=await req.json(),items=Array.isArray(input.listings)?input.listings:[input.listing];
  if(!items.length||items.length>1000||items.some((r: any)=>!r||typeof r.id!=='string'||r.id.length>100||r.mode!=='car-price'||!Array.isArray(r.car)||r.car.length!==12||r.car[11]?.id!==r.id||!Number.isFinite(r.car[6])||!Number.isSafeInteger(r.createdAt)))return reply({error:'Invalid listing'},400);
  if(input.action==='update'){if(items.length!==1)return reply({error:'Invalid update'},400);const r=items[0];const updated=await fetch(base+'/rest/v1/ogz_game_listings?id=eq.'+encodeURIComponent(r.id),{method:'PATCH',headers:{...headers,prefer:'return=representation'},body:JSON.stringify({car:r.car,archived:r.archived===true})});if(!updated.ok)throw Error('update');if(!(await updated.json()).length)return reply({error:'Not found'},404);return reply({saved:1})}
  const res=await fetch(base+'/rest/v1/ogz_game_listings?on_conflict=id',{method:'POST',headers:{...headers,prefer:input.action==='import'?'resolution=merge-duplicates,return=minimal':'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify(items.map((r: any)=>({id:r.id,mode:r.mode,car:r.car,created_at:r.createdAt,archived:r.archived===true})))});if(!res.ok)throw Error('write');return reply({saved:items.length});
 }catch(e){console.error('OGZ listing operation failed');return reply({error:'Listing service unavailable'},503)}
});
