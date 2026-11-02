// Server-only products and image service; prices never exposed without integration authentication.
Deno.serve(async(req:Request)=>{
 const reply=(data:unknown,status=200)=>Response.json(data,{status,headers:{'cache-control':'no-store'}});
 try{
 const base=Deno.env.get('SUPABASE_URL')!,key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
 const headers={apikey:key,authorization:'Bearer '+key,'content-type':'application/json'};
 const provided=req.headers.get('x-ogz-key');if(!provided||provided.length!==64)return reply({error:'Unauthorized'},401);
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(provided))),b=>b.toString(16).padStart(2,'0')).join('');
 const auth=await fetch(base+'/rest/v1/ogz_game_integration?select=key_hash&id=in.(sites,products-transfer)',{headers});if(!auth.ok||!(await auth.json()).some((r:any)=>r.key_hash===hash))return reply({error:'Unauthorized'},401);
 const url=new URL(req.url);
 if(req.method==='PUT'){
 const path=url.searchParams.get('image');if(!/^media\/admin\/admin-[a-f0-9-]{36}-[01]$/.test(path||''))return reply({error:'Invalid path'},400);
 const bytes=new Uint8Array(await req.arrayBuffer());const type=bytes[0]===255&&bytes[1]===216?'image/jpeg':bytes[0]===137&&bytes[1]===80?'image/png':String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP'?'image/webp':null;
 if(!type||bytes.length<12||bytes.length>5000000)return reply({error:'Invalid image'},400);
 const uploaded=await fetch(base+'/storage/v1/object/ogz-game/'+path,{method:'POST',headers:{...headers,'content-type':type,'x-upsert':'true'},body:bytes});if(!uploaded.ok)throw Error('upload');return reply({image:base+'/storage/v1/object/public/ogz-game/'+path});
 }
 if(req.method==='GET'){
 const out=[];for(let offset=0;;offset+=1000){const r=await fetch(base+'/rest/v1/ogz_game_products?select=data&order=created_at.desc,id.asc&offset='+offset+'&limit=1000',{headers});if(!r.ok)throw Error('read');const rows=await r.json();out.push(...rows.map((r:any)=>r.data));if(rows.length<1000)break}return reply({products:out});
 }
 if(req.method!=='POST')return reply({error:'Method not allowed'},405);
 const input=await req.json(),items=input.products;if(!Array.isArray(items)||!items.length||items.length>1000||items.some((p:any)=>!/^product-[a-f0-9-]{36}$/.test(p.id)||typeof p.name!=='string'||!p.name||p.name.length>160||!['market','clothing','shoes','cosmetics','technology','kitchen','home','toys','diy','office'].includes(p.category)||!Number.isFinite(p.price)||p.price<=0||p.price>1e10||!Number.isSafeInteger(p.createdAt)||typeof p.image!=='string'))return reply({error:'Invalid products'},400);
 const r=await fetch(base+'/rest/v1/ogz_game_products?on_conflict=id',{method:'POST',headers:{...headers,prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(items.map((p:any)=>({id:p.id,data:p,created_at:p.createdAt})))});if(!r.ok)throw Error('write');return reply({saved:items.length});
 }catch{console.error('Product storage operation failed');return reply({error:'Product service unavailable'},503)}
});
