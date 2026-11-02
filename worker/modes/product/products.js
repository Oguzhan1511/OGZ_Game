export const productCategories={market:'Market',clothing:'Kıyafet',shoes:'Ayakkabı',cosmetics:'Kozmetik',technology:'Teknoloji',kitchen:'Mutfak',home:'Ev ve Yaşam',toys:'Oyuncak',diy:'Yapı Market',office:'Ofis ve Kırtasiye'};
export function normalizeProductCategories(value){if(value==='mixed')return Object.keys(productCategories);if(!Array.isArray(value)||!value.length||value.some(key=>!Object.hasOwn(productCategories,key)))return null;return [...new Set(value)]}
export async function productListings(env){const rows=await env.DB.prepare('SELECT data FROM products ORDER BY created_at DESC').all();return rows.results.map(row=>JSON.parse(row.data))}
export function productAsRound(item){return [item.name,'',0,0,'','',item.price,'','','',item.image,{id:item.id,source:'user',family:item.id,kind:'product',productCategory:item.category}]}
export async function productAdminApi(req,env){
 const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
 if(req.headers.get('oai-authenticated-user-email')?.toLowerCase()!=='selenetarotspell@gmail.com')return reply({error:'Yönetici girişi gerekli.'},403);
 if(!env.DB||!env.BUCKET)return reply({error:'Depolama servisi hazır değil.'},503);
 if(req.method==='GET')return reply({products:await productListings(env)});
 if(req.method!=='POST')return reply({error:'Geçersiz yöntem'},405);
 if(req.headers.get('origin')!==new URL(req.url).origin)return reply({error:'Geçersiz kaynak'},403);
 if(Number(req.headers.get('content-length'))>5500000)return reply({error:'En fazla 5 MB görsel yükleyebilirsin.'},413);
 if(req.headers.get('content-type')?.includes('application/json')){
  const body=await req.json();if(body.action!=='archive'||typeof body.id!=='string'||typeof body.archived!=='boolean')return reply({error:'Geçersiz işlem'},400);
  const item=(await productListings(env)).find(item=>item.id===body.id);if(!item)return reply({error:'Ürün bulunamadı'},404);
  item.archived=body.archived;await env.DB.prepare('UPDATE products SET data=? WHERE id=?').bind(JSON.stringify(item),item.id).run();return reply({product:item});
 }
 const form=await req.formData(),name=String(form.get('name')||'').trim(),category=String(form.get('category')||''),text=String(form.get('price')||'').trim().replace(/\s/g,'');
 const price=/^\d{1,3}(\.\d{3})+(,\d{1,2})?$/.test(text)?Number(text.replaceAll('.','').replace(',','.')):/^\d+([,.]\d{1,2})?$/.test(text)?Number(text.replace(',','.')):NaN;
 if(!name||name.length>160||!Object.hasOwn(productCategories,category)||!Number.isFinite(price)||price<1||price>10000000000)return reply({error:'Ürün adını, kategoriyi ve fiyatı kontrol et. Örnek fiyat: 1.299,90'},400);
 const editId=String(form.get('editId')||''),existing=editId?(await productListings(env)).find(item=>item.id===editId):null;
 if(editId&&!existing)return reply({error:'Ürün bulunamadı'},404);
 const file=form.get('photo');let image=existing?.image,uploaded=null;
 if(file?.size){if(file.size>5000000)return reply({error:'Görsel en fazla 5 MB olabilir.'},400);const bytes=new Uint8Array(await file.arrayBuffer());const type=bytes[0]===255&&bytes[1]===216&&bytes[2]===255?'image/jpeg':bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71?'image/png':String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP'?'image/webp':null;if(!type||bytes.length<12)return reply({error:'JPG, PNG veya WebP görsel seç.'},400);image='/media/admin/admin-'+crypto.randomUUID()+'-0';uploaded={bytes,type};}
 if(!image)return reply({error:'Ürün görseli yükle.'},400);
 const item={id:existing?.id||'product-'+crypto.randomUUID(),name,category,price:Math.round(price*100)/100,image,createdAt:existing?.createdAt||Date.now(),archived:existing?.archived||false};
 try{if(uploaded)await env.BUCKET.put(image.slice(1),uploaded.bytes,{httpMetadata:{contentType:uploaded.type}});if(existing)await env.DB.prepare('UPDATE products SET data=? WHERE id=?').bind(JSON.stringify(item),item.id).run();else await env.DB.prepare('INSERT INTO products(id,data,created_at) VALUES(?,?,?)').bind(item.id,JSON.stringify(item),item.createdAt).run()}catch(error){if(uploaded)await env.BUCKET.delete(image.slice(1));throw error}
 return reply({product:item},201);
}
