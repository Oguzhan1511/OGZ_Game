import { productCategories } from './products.js';
export const productGameStyles = String.raw`
.product-category-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}
.product-category-options label {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0;
  padding: 10px 12px;
  border: 1px solid #2d3648;
  border-radius: 10px;
  color: #cbd5e1;
  font-size: 12px;
  cursor: pointer;
}
.product-category-options label:has(input:checked) {
  background: #2d2226;
  border-color: #f0ad5f;
  color: #ffffff;
}
.product-category-options input {
  accent-color: #e24046;
}
.product-mode-note {
  color: #94a3b8;
  font-size: 11px;
  line-height: 1.6;
}
.product-game .game-visual {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto minmax(0, 1fr);
  gap: 12px;
}
.product-game .game-vehicle-info {
  grid-column: 1;
  grid-row: 1;
  display: block;
  min-width: 0;
  min-height: 0;
  max-height: 160px;
  overflow: auto;
  padding: 0;
  margin: 0;
}
.product-game .game-vehicle-info h1 {
  margin: 0;
  white-space: normal;
  overflow-wrap: anywhere;
  line-height: 1.2;
  font-size: clamp(20px, 1.8vw, 28px);
}
.product-game .photo-stage {
  grid-column: 1;
  grid-row: 2;
  height: 100%;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}
.product-game .game-photo {
  object-fit: contain;
}
.product-game .game-damage {
  display: none;
}
@media (min-width: 701px) {
  .product-game .game-board {
    grid-template-columns: minmax(0, 1fr) minmax(240px, 0.38fr);
    grid-template-rows: minmax(0, 1fr) minmax(200px, 0.65fr);
  }
  .product-game .game-board > .game-visual {
    grid-column: 1;
    grid-row: 1;
    padding: 20px;
  }
  .product-game .game-board > .game-scores {
    grid-column: 2;
    grid-row: 1/3;
  }
  .product-game .game-board .guess-card,
  .product-game .game-round-result {
    grid-column: 1;
    grid-row: 2;
    margin: 0 20px 16px;
  }
  .product-game .guess-card form {
    grid-template-columns: minmax(0, 1fr) minmax(180px, 0.5fr);
    grid-template-areas: "label label" "input submit" "shortcuts shortcuts";
    grid-template-rows: auto minmax(48px, 1fr) minmax(34px, 0.6fr);
  }
  .product-game .game-round-result {
    max-width: none;
  }
  .product-game .actual-price strong {
    font-size: 30px;
  }
}
@media (max-width: 700px) {
  .product-game .game-visual {
    grid-template-rows: auto auto;
  }
  .product-game .game-vehicle-info {
    max-height: none;
    overflow: visible;
  }
  .product-game .photo-stage {
    height: clamp(180px, 32svh, 280px);
  }
  .product-game .game-vehicle-info h1 {
    font-size: 22px;
  }
  .product-game .game-details {
    padding: 0;
  }
  .show-mobile-ranking.product-game .game-visual {
    display: none;
  }
  .product-game .game-board[data-mobile-panel="scores"] .game-visual {
    display: none;
  }
}
`;
export const productGameClient = String.raw`
const productCategories = ${JSON.stringify(productCategories)};
function productCategoryChooser(initialMode = 'car-price') {
  return (
    '<fieldset id="product-category-picker" ' +
    (initialMode === 'product-price' ? '' : 'hidden') +
    ' style="border:0;padding:0;margin:16px 0"><legend style="font-size:13px">Ürün kategorileri</legend><div class="product-category-options"><label><input id="product-mixed" type="checkbox" checked onchange="toggleProductMixed(this.checked)">Karışık · Tümü</label>' +
    Object.entries(productCategories)
      .map(
        ([key, name]) =>
          '<label><input type="checkbox" name="product-category" value="' +
          key +
          '" checked onchange="updateProductMixed()">' +
          name +
          '</label>'
      )
      .join('') +
    '</div><p class="product-mode-note">Bir veya birden fazla kategori seçebilirsin. Karışık mod, tüm kategorilerden ürünleri içerir.</p></fieldset>'
  );
}
function toggleProductCategories() {
  document.querySelector('#product-category-picker').hidden =
    document.querySelector('#game-mode').value !== 'product-price';
  const note = document.querySelector('#game-mode-description');
  if (note?.classList.contains('notice'))
    note.textContent =
      document.querySelector('#game-mode').value === 'product-price'
        ? 'Ürünün görselini ve adını incele, fiyatını tahmin et.'
        : 'Araç detaylarını incele, fiyata en yakın tahminle puan topla.';
}
function toggleProductMixed(checked) {
  for (const input of document.querySelectorAll('[name=product-category]')) input.checked = checked;
}
function updateProductMixed() {
  document.querySelector('#product-mixed').checked = [
    ...document.querySelectorAll('[name=product-category]'),
  ].every(input => input.checked);
}
function selectedProductCategories() {
  if (document.querySelector("#lobby-settings #product-mixed")?.checked) return Object.keys(productCategories);
  return [...document.querySelectorAll('[name=product-category]:checked')].map(
    input => input.value
  );
}
function setupProductGame() {
  const input = document.querySelector('#guess');
  if (input) {
    input.inputMode = 'decimal';
    input.placeholder = 'Örn. 1.299,90';
  }
  const visual = document.querySelector('.game-visual'),
    info = document.querySelector('.game-vehicle-info');
  if (visual && info) {
    for (const child of [...info.children]) if (child.tagName !== 'H1') child.remove();
    visual.prepend(info);
  }
  document.querySelector('.game-damage')?.remove();
  const carTab = document.querySelector('[data-panel=car]');
  if (carTab) carTab.textContent = 'Ürün';
  document.querySelector('.mobile-game-tabs')?.setAttribute('aria-label', 'Ürün inceleme');
}
`;
export const productAdminHtml = String.raw`<!doctype html><html lang="tr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ürün yönetimi · OGZ Game</title><style>
*{box-sizing:border-box}body{margin:0;background:#111520;color:#f8fafc;font:15px system-ui,sans-serif}main{max-width:1250px;margin:auto;padding:24px}header{display:flex;justify-content:space-between;border-bottom:1px solid #252b37;padding-bottom:20px}a{color:#f0ad5f}h1{font-size:34px;margin-bottom:8px}p{color:#94a3b8;line-height:1.6}.layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24px;margin-top:24px}.panel{background:#1c222e;border:1px solid #283040;padding:24px;border-radius:18px}h2{margin-top:0}label{display:block;color:#cbd5e1;margin-top:18px;font-size:13px}input,select,button{font:inherit}input,select{display:block;width:100%;margin-top:8px;padding:13px;border:1px solid #333d50;border-radius:10px;background:#111520;color:white}input[type=file]{font-size:12px}button{cursor:pointer;padding:12px 18px;border:1px solid #333d50;border-radius:10px;background:#242b3b;color:#f8fafc}button:disabled{opacity:.5;cursor:wait}button.primary{background:#e24046;color:#ffffff;border:0;font-weight:700;width:100%;margin-top:22px}button:focus-visible,input:focus-visible,select:focus-visible,a:focus-visible{outline:2px solid #f0ad5f;outline-offset:3px}#status{padding:15px;border-radius:10px;background:#181d28;border:1px solid #283040;margin-top:20px;min-height:48px}#preview{height:220px;margin-top:18px;display:flex;justify-content:center;align-items:center;background:#111520;border-radius:12px;color:#94a3b8}#preview img{width:100%;height:100%;object-fit:contain}.record{display:flex;gap:14px;padding:16px 0;border-bottom:1px solid #252b37}.record img{width:86px;height:86px;object-fit:contain;background:#111520;border-radius:10px}.record p{font-size:12px;margin:6px 0}.record button{padding:7px 10px;font-size:12px;margin-right:6px}.filters{display:flex;gap:10px;margin:15px 0}.filters input,.filters select{min-width:0;margin:0}.muted{font-size:12px;color:#94a3b8}.check{display:flex;align-items:center;gap:8px}.check input{width:auto;margin:0}#cancel{margin-top:10px}.badge{color:#f0ad5f;font-size:11px;letter-spacing:2px}@media(max-width:750px){main{padding:16px}.layout{grid-template-columns:1fr}.panel{padding:18px}h1{font-size:28px}.filters{flex-direction:column}}
</style><main><header><a href="/admin">← Oyun modları</a><a href="/">Oyuna dön ↗</a></header><h1>Ürün fiyatı tahmini</h1><p>Ürün adını, fiyatını ve görselini ekle. Kategori seçimine göre oyunlarda karıştırılır.</p><div id="status" role="status">Ürünler yükleniyor…</div><div class="layout"><section class="panel"><span class="badge">ÜRÜN HAVUZU</span><h2 id="form-title">Yeni ürün</h2><form id="product-form"><input name="editId" type="hidden"><label>Ürün adı<input name="name" required maxlength="160" placeholder="Örn. 1 L zeytinyağı / 128 GB telefon"></label><label>Kategori<select name="category">${Object.entries(
  productCategories
)
  .map(([key, name]) => '<option value="' + key + '">' + name + '</option>')
  .join(
    ''
  )}</select></label><label>Gerçek fiyat (₺)<input name="price" type="text" inputmode="decimal" required maxlength="24" placeholder="Örn. 1.299,90"></label><label>Ürün görseli<input name="photo" type="file" required accept="image/jpeg,image/png,image/webp"></label><p class="muted">Fiyat görünmeyen bir görsel yükle. JPG, PNG, WebP · En fazla 5 MB</p><div id="preview">Ürün görseli</div><button class="primary" id="save" disabled>Ürünü havuza ekle →</button><button type="button" id="cancel" hidden>Düzenlemeyi bırak</button></form></section><section class="panel"><h2>Ürün yönetimi</h2><p id="count" class="muted"></p><div id="category-counts" class="muted"></div><div class="filters"><input id="search" aria-label="Ürün ara" placeholder="Ürün ara"><select id="category-filter" aria-label="Kategori filtresi"><option value="">Tüm kategoriler</option>${Object.entries(
  productCategories
)
  .map(([key, name]) => '<option value="' + key + '">' + name + '</option>')
  .join(
    ''
  )}</select></div><label class="check"><input id="archived" type="checkbox">Kaldırılanları göster</label><button id="refresh" style="margin-top:15px">Listeyi yenile ↻</button><div id="records"></div></section></div></main><script>
const categories=${JSON.stringify(productCategories)},form=document.querySelector('#product-form'),q=s=>document.querySelector(s),endpoint='/api/admin/listings?mode=product-price';let items=[],saving=false,previewUrl=null;
const status=text=>q('#status').textContent=text,esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function imagePreview(url){q('#preview').replaceChildren();if(url){const image=new Image();image.src=url;image.alt='Ürün görseli';q('#preview').append(image)}else q('#preview').textContent='Ürün görseli'}
form.photo.addEventListener('change',()=>{if(previewUrl)URL.revokeObjectURL(previewUrl);const file=form.photo.files[0];if(file&&(file.size>5000000||!['image/jpeg','image/png','image/webp'].includes(file.type))){form.photo.value='';status('JPG, PNG veya WebP seç. En fazla 5 MB.');return}previewUrl=file?URL.createObjectURL(file):null;imagePreview(previewUrl)});
function reset(){form.reset();form.editId.value='';form.photo.required=true;q('#form-title').textContent='Yeni ürün';q('#save').textContent='Ürünü havuza ekle →';q('#cancel').hidden=true;imagePreview(null)}
function edit(item){reset();form.editId.value=item.id;form.elements.name.value=item.name;form.category.value=item.category;form.price.value=item.price.toLocaleString('tr-TR',{maximumFractionDigits:2});form.photo.required=false;imagePreview(item.image);q('#form-title').textContent='Ürünü düzenle';q('#save').textContent='Değişiklikleri kaydet →';q('#cancel').hidden=false;form.scrollIntoView({behavior:'smooth',block:'start'})}
async function archive(item){if(!confirm(item.archived?'Ürün oyun havuzuna geri alınsın mı?':'Ürün oyun havuzundan kaldırılsın mı? Daha sonra geri alabilirsin.'))return;try{await request({method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'archive',id:item.id,archived:!item.archived})});await load();status('Ürün havuzu güncellendi.')}catch(error){status(error.message)}}
function render(){const active=items.filter(item=>!item.archived),visible=items.filter(item=>item.archived===q('#archived').checked&&(!q('#category-filter').value||item.category===q('#category-filter').value)&&item.name.toLocaleLowerCase('tr-TR').includes(q('#search').value.toLocaleLowerCase('tr-TR')));q('#count').textContent=active.length+' aktif ürün · '+items.length+' toplam';q('#category-counts').textContent=Object.entries(categories).map(([key,name])=>name+': '+active.filter(item=>item.category===key).length).join(' · ');q('#records').replaceChildren();if(!visible.length)q('#records').textContent='Gösterilecek ürün yok.';for(const item of visible){const row=document.createElement('div');row.className='record';row.innerHTML='<img src="'+esc(item.image)+'" alt="'+esc(item.name)+'"><div><strong>'+esc(item.name)+'</strong><p>'+categories[item.category]+' · '+item.price.toLocaleString('tr-TR')+' ₺</p></div>';for(const [text,action] of [['Düzenle',()=>edit(item)],[item.archived?'Geri al':'Kaldır',()=>archive(item)]]){const button=document.createElement('button');button.textContent=text;button.onclick=action;row.lastElementChild.append(button)}q('#records').append(row)}}
async function request(options={}){const response=await fetch(endpoint,{cache:'no-store',...options}),data=await response.json();if(!response.ok)throw Error(data.error||'İşlem tamamlanamadı.');return data}
async function load(){try{items=(await request()).products;render();q('#save').disabled=false}catch(error){status(error.message);throw error}}
form.addEventListener('submit',async event=>{event.preventDefault();if(saving)return;saving=true;q('#save').disabled=true;status('Ürün kaydediliyor…');try{const data=new FormData(form),file=data.get('photo');if(file?.size>1500000){const bitmap=await createImageBitmap(file);try{const canvas=document.createElement('canvas'),scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,bitmap.height);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.85));if(!blob)throw Error('Görsel işlenemedi.');data.set('photo',blob,'product.jpg')}finally{bitmap.close()}}await request({method:'POST',body:data});reset();await load();status('✓ Ürün kaydedildi. Yeni oyunlarda seçilebilir.')}catch(error){status('Kayıt tamamlanamadı: '+error.message)}finally{saving=false;q('#save').disabled=false}});
q('#cancel').onclick=reset;q('#refresh').onclick=()=>load().then(()=>status('Ürün listesi güncellendi.')).catch(()=>{});for(const id of ['search','category-filter','archived'])q('#'+id).addEventListener('input',render);load().then(()=>status('Ürün eklemeye hazırsın.')).catch(()=>{});
</script></html>`;
