import {scryptSync,timingSafeEqual,createHmac,randomBytes} from 'node:crypto';
import worker from '../worker/index.js';
const cookieName='__Host-ogz_admin';
function cookieToken(request){return request.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1)}
export function createAdminSession(env,now=Date.now()){
 const payload=Buffer.from(JSON.stringify({user:env.ADMIN_USERNAME,exp:now+8*3600000,nonce:randomBytes(16).toString('hex')})).toString('base64url');return payload+'.'+createHmac('sha256',env.ADMIN_SESSION_SECRET).update(payload).digest('base64url');
}
export function validAdminSession(request,env,now=Date.now()){
 const token=cookieToken(request);if(!token||!env.ADMIN_SESSION_SECRET)return false;const [payload,signature,...extra]=token.split('.');if(extra.length||!payload||!signature)return false;
 const expected=createHmac('sha256',env.ADMIN_SESSION_SECRET).update(payload).digest('base64url');if(signature.length!==expected.length||!timingSafeEqual(Buffer.from(signature),Buffer.from(expected)))return false;
 try{const value=JSON.parse(Buffer.from(payload,'base64url'));return value.user===env.ADMIN_USERNAME&&Number.isFinite(value.exp)&&value.exp>now}catch{return false}
}
const loginHtml=`<!doctype html><html lang="tr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Admin girişi · OGZ Game</title><style>*{box-sizing:border-box}body{background:#101719;color:#eaf3ef;font:15px system-ui;margin:0;min-height:100vh;display:grid;place-items:center}main{width:min(420px,calc(100% - 32px));padding:30px;background:#1a2527;border:1px solid #30413f;border-radius:20px}input,button{width:100%;font:inherit;padding:14px;border-radius:9px;margin:8px 0 18px}input{background:#111b1d;color:white;border:1px solid #40544d}button{background:#63e4c6;color:#09241e;border:0;font-weight:700;cursor:pointer}a{color:#63e4c6}p{line-height:1.6;color:#afc2b8}</style><main><a href="/">← Oyuna dön</a><h1>Yönetici girişi</h1><p>İlan yönetimine erişmek için giriş yap.</p><form id="login"><label>Kullanıcı adı<input name="username" autocomplete="username" required></label><label>Şifre<input name="password" type="password" autocomplete="current-password" required></label><button>Giriş yap →</button></form><p id="message" role="status"></p></main><script>document.querySelector('#login').addEventListener('submit',async e=>{e.preventDefault();const form=e.target,button=form.querySelector('button');button.disabled=true;try{const response=await fetch('/api/admin/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({username:form.elements.username.value,password:form.elements.password.value})});const data=await response.json();if(!response.ok)throw Error(data.error);location.href='/admin'}catch(error){document.querySelector('#message').textContent=error.message;button.disabled=false}})</script></html>`;
export async function handleVercelRequest(request,env){
 const json=(value,status=200,headers={})=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json','cache-control':'no-store',...headers}});
 if(!env.OGZ_BACKEND_ORIGIN||!env.OGZ_BACKEND_TOKEN||!env.OGZ_DEPLOYMENT_KEY||!env.ADMIN_PASSWORD_HASH||!env.ADMIN_USERNAME||!env.ADMIN_SESSION_SECRET)return json({error:'Sunucu yapılandırması hazır değil.'},503);
 const url=new URL(request.url),path=url.pathname,isAdmin=validAdminSession(request,env);
 const bridgeHeaders={'OAI-Sites-Authorization':'Bearer '+env.OGZ_BACKEND_TOKEN,'x-ogz-deployment-key':env.OGZ_DEPLOYMENT_KEY};
 if(path==='/'||/^\/oda\/[a-f0-9]{6}\/?$/i.test(path)||path==='/mascot.jpg'||path==='/logo.png'||path==='/home-background-v1.webp')return await worker.fetch(request,env);
 if(path==='/admin/login'){if(isAdmin)return Response.redirect(url.origin+'/admin',303);return new Response(loginHtml,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}})}
 if(path==='/api/admin/login'){
  if(request.method!=='POST')return json({error:'Geçersiz yöntem'},405);if(request.headers.get('origin')!==url.origin)return json({error:'Geçersiz kaynak'},403);
  let body;try{body=await request.json()}catch{return json({error:'Geçersiz istek'},400)}if(typeof body.username!=='string'||typeof body.password!=='string'||body.password.length>256)return json({error:'Geçersiz giriş'},400);
  const ip=request.headers.get('x-vercel-forwarded-for')||request.headers.get('x-real-ip')||'unknown';const key=createHmac('sha256',env.ADMIN_SESSION_SECRET).update(ip).digest('hex');
  const gate=await fetch(env.OGZ_BACKEND_ORIGIN+'/api/deployment-login',{method:'POST',headers:{...bridgeHeaders,'content-type':'application/json'},body:JSON.stringify({key,action:'attempt'}),signal:AbortSignal.timeout(15000)});if(!gate.ok)return json({error:'Giriş servisine erişilemiyor.'},503);if(!(await gate.json()).allowed)return json({error:'Çok fazla deneme. 15 dakika sonra tekrar dene.'},429);
  const [salt,hash]=env.ADMIN_PASSWORD_HASH.split(':');const expected=Buffer.from(hash,'hex'),actual=scryptSync(body.password,salt,64);if(body.username!==env.ADMIN_USERNAME||expected.length!==actual.length||!timingSafeEqual(expected,actual))return json({error:'Kullanıcı adı veya şifre hatalı.'},401);
  await fetch(env.OGZ_BACKEND_ORIGIN+'/api/deployment-login',{method:'POST',headers:{...bridgeHeaders,'content-type':'application/json'},body:JSON.stringify({key,action:'reset'})});
  return json({ok:true},200,{'set-cookie':cookieName+'='+createAdminSession(env)+'; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800'});
 }
 if(path.startsWith('/api/admin/')&&!isAdmin)return json({error:'Yönetici girişi gerekli.'},401);
 if(path==='/admin'&&!isAdmin)return Response.redirect(url.origin+'/admin/login',303);
 if(!['GET','HEAD'].includes(request.method)&&path.startsWith('/api/admin/')&&request.headers.get('origin')!==url.origin)return json({error:'Geçersiz kaynak'},403);
 const allowed=['/admin','/admin/ocr-engine.js','/api/room','/api/admin/listings'].includes(path)||/^\/media\/[a-zA-Z0-9_./-]+$/.test(path);
 if(!allowed)return json({error:'Sayfa bulunamadı.'},404);
 const headers=new Headers(bridgeHeaders);for(const name of ['content-type','if-none-match','origin'])if(request.headers.has(name))headers.set(name,request.headers.get(name));headers.set('x-ogz-path',url.pathname+url.search);headers.set('x-ogz-origin',url.origin);if(isAdmin)headers.set('x-ogz-admin','1');
 const result=await fetch(env.OGZ_BACKEND_ORIGIN+'/api/vercel-bridge',{method:request.method,headers,body:['GET','HEAD'].includes(request.method)?undefined:request.body,duplex:'half',redirect:'manual',signal:AbortSignal.timeout(55000)});
 const responseHeaders=new Headers(result.headers);responseHeaders.delete('set-cookie');responseHeaders.delete('content-encoding');responseHeaders.delete('content-length');responseHeaders.set('x-content-type-options','nosniff');if(path.startsWith('/admin')||path.startsWith('/api/'))responseHeaders.set('cache-control','no-store');return new Response(result.body,{status:result.status,headers:responseHeaders});
}
