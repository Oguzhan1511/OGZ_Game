export function hasSupabase(env){return !!(env.OGZ_SUPABASE_URL&&env.OGZ_SUPABASE_KEY)}
export async function supabaseListings(env,items,action='insert'){
 const response=await fetch(env.OGZ_SUPABASE_URL,{method:items?'POST':'GET',headers:{'x-ogz-key':env.OGZ_SUPABASE_KEY,'content-type':'application/json'},body:items?JSON.stringify({listings:items,action}):undefined,signal:AbortSignal.timeout(15000)});
 if(!response.ok)throw Error('Supabase ilan servisine erişilemiyor. Lütfen tekrar dene.');return response.json();
}
export async function gameListings(env){
 const old=await env.DB.prepare('SELECT data FROM admin_listings ORDER BY created_at DESC').all();
 const local=old.results.map(row=>JSON.parse(row.data));if(!hasSupabase(env))return local;
 const remote=await supabaseListings(env);return [...new Map([...local,...remote.listings].map(item=>[item.id,item])).values()].sort((a,b)=>b.createdAt-a.createdAt);
}
export async function syncSupabase(request,env){
 if(request.method!=='POST')return new Response(null,{status:405});
 if(!hasSupabase(env)||request.headers.get('x-ogz-key')!==env.OGZ_SUPABASE_KEY)return new Response(null,{status:403});
 const old=await env.DB.prepare('SELECT data FROM admin_listings ORDER BY created_at DESC').all();const items=old.results.map(row=>JSON.parse(row.data));
 if(items.length)await supabaseListings(env,items);
 return new Response(JSON.stringify({synced:items.length}),{headers:{'content-type':'application/json','cache-control':'no-store'}});
}
