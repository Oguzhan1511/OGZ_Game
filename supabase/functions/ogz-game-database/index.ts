// Server-to-server only. Public game requests continue through the authorized game API.
Deno.serve(async(req:Request)=>{
 const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'cache-control':'no-store'}});
 try{
 const base=Deno.env.get('SUPABASE_URL')!,service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,provided=req.headers.get('x-ogz-key');if(!provided||provided.length!==64)return reply({error:'Unauthorized'},401);
 const headers={apikey:service,authorization:'Bearer '+service,'content-type':'application/json'},hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(provided))),b=>b.toString(16).padStart(2,'0')).join('');
 const config=await fetch(base+'/rest/v1/ogz_game_integration?id=in.(sites,database-transfer)&select=id,key_hash',{headers});if(!config.ok)throw Error('config');const grant=(await config.json()).find((r:any)=>r.key_hash===hash);if(!grant)return reply({error:'Unauthorized'},401);
 const tables:Record<string,string>={rooms:'ogz_game_rooms',listing_history:'ogz_game_listing_history',listing_reservations:'ogz_game_listing_reservations',admin_login_attempts:'ogz_game_login_attempts'};
 if(req.method==='GET'){
 if(grant.id!=='database-transfer')return reply({error:'Forbidden'},403);const url=new URL(req.url),table=url.searchParams.get('table')||'',offset=Number(url.searchParams.get('offset')||0);if(!Object.hasOwn(tables,table)||!Number.isSafeInteger(offset)||offset<0)return reply({error:'Invalid table'},400);
 const order=table==='rooms'?'code':table==='admin_login_attempts'?'key':'token,listing_id';const r=await fetch(base+'/rest/v1/'+tables[table]+'?select=*&order='+order+'&offset='+offset+'&limit=500',{headers});if(!r.ok)throw Error('export');return reply({rows:await r.json(),limit:500});
 }
 if(req.method!=='POST')return reply({error:'Invalid method'},405);
 const body=await req.json();let rpc,args;
 if(body.action==='import'){
 if(grant.id!=='database-transfer'||!Object.hasOwn(tables,body.table)||!Array.isArray(body.rows)||body.rows.length>500)return reply({error:'Forbidden'},403);rpc='ogz_game_import_state';args={table_name:body.table,items:body.rows};
 }else{
 if(!Array.isArray(body.operations)||!body.operations.length||body.operations.length>100||body.operations.some((o:any)=>!o||typeof o.op!=='string'||!Array.isArray(o.params)))return reply({error:'Invalid operations'},400);rpc='ogz_game_state';args={operations:body.operations};
 }
 const r=await fetch(base+'/rest/v1/rpc/'+rpc,{method:'POST',headers,body:JSON.stringify(args)});if(!r.ok){const error=await r.json().catch(()=>({}));console.error('Game database RPC failed',error.code);return reply({error:'Game database operation failed',code:error.code},error.code==='23505'?409:503)}const result=await r.json();return reply(rpc==='ogz_game_state'?{results:result}:{imported:result});
 }catch{console.error('Game database service failed');return reply({error:'Game database unavailable'},503)}
});
