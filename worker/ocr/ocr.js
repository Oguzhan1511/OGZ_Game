export function parseListingScreenshot(text){
 const norm=s=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').toLowerCase().replace(/[^a-z0-9]/g,'');
 const labels=[['brand',['Marka']],['family',['Seri']],['model',['Model']],['year',['Model Yılı','Yıl']],['km',['Kilometre','KM']],['fuel',['Yakıt / Motor Tipi','Yakıt Tipi','Yakıt']],['gear',['Vites']],['heavy',['Ağır Hasar Kayıtlı','Ağır Hasar Kaydı']],['listingId',['İlan No']]];
 const lines=text.split(/\n/).map(s=>s.trim()).filter(Boolean),out={};
 for(const [key,names] of labels){for(let i=0;i<lines.length;i++){
  for(const label of names){const tokens=lines[i].split(/\s+/);let end=0,found=false;for(let n=1;n<=Math.min(tokens.length,6);n++){if(norm(tokens.slice(0,n).join(' '))===norm(label)){end=n;found=true;break}}
   if(!found)continue;let value=tokens.slice(end).join(' ').replace(/^[:|—\-\s]+/,'');
   if(!value&&i+1<lines.length&&!labels.some(([,variants])=>variants.some(v=>norm(lines[i+1]).startsWith(norm(v)))))value=lines[i+1];
   if(value){out[key]=value;break}
  }if(out[key])break;
 }}
 const price=text.match(/(\d[\d.\s]*\d|\d)(?:,\d{1,2})?\s*(?:TL|₺)/i);if(price)out.price=price[0].replace(/TL|₺/gi,'').replace(/\s/g,'');
 for(const name of ['year','km'])if(out[name]){const m=out[name].match(/\d[\d.,]*/);out[name]=m?m[0]:''}
 if(out.year&&!/^(19|20)\d{2}$/.test(out.year))delete out.year;
 if(out.fuel){const value=norm(out.fuel);out.fuel=value.includes('lpg')?'LPG':value.includes('hibrit')?'Hibrit':value.includes('elektrik')?'Elektrik':value.includes('dizel')?'Dizel':value.includes('benzin')?'Benzin':''}
 if(out.gear){const value=norm(out.gear);out.gear=value.includes('yari')?'Yarı otomatik':value.includes('otomatik')?'Otomatik':value.includes('manuel')?'Manuel':''}
 if(out.model&&out.family&&!norm(out.model).startsWith(norm(out.family)))out.model=out.family+' '+out.model;
 out.damage=out.heavy?'Ağır hasar kaydı: '+out.heavy:'Belirtilmedi';delete out.heavy;
 out.paint='Yüklenen şemada gösterilmiştir';out.changed='Yüklenen şemada gösterilmiştir';return out;
}
export function detectListingPhoto(pixels,width,height){
 const sample=(x,y)=>{const i=(y*width+x)*4;return [pixels[i],pixels[i+1],pixels[i+2]]};
 const right=Math.floor(width*.63),step=Math.max(2,Math.floor(width/350));let best={top:0,bottom:0},start=-1;
 for(let y=0;y<height;y+=step){let occupied=0,total=0;for(let x=0;x<right;x+=step){const [r,g,b]=sample(x,y);if(Math.max(r,g,b)-Math.min(r,g,b)>22||Math.max(r,g,b)<175)occupied++;total++}const dense=occupied/total>.48;
  if(dense&&start<0)start=y;if((!dense||y+step>=height)&&start>=0){const bottom=dense?height:y;if(bottom-start>best.bottom-best.top)best={top:start,bottom};start=-1}}
 if(best.bottom-best.top<height*.15)return {x:0,y:0,width:Math.floor(width*.62),height:Math.floor(height*.65),uncertain:true};
 let left=0,end=right;const y=Math.floor((best.top+best.bottom)/2);
 for(let x=0;x<width*.78;x+=step){const [r,g,b]=sample(x,y);if(Math.max(r,g,b)-Math.min(r,g,b)>22||Math.max(r,g,b)<175){left=x;break}}
 let whites=0;for(let x=right;x<width*.85;x+=step){const [r,g,b]=sample(x,y);if(Math.min(r,g,b)>235)whites++;else whites=0;if(whites*step>width*.012){end=x-whites*step+step;break}}
 return {x:left,y:best.top,width:Math.max(1,end-left),height:best.bottom-best.top,uncertain:false};
}
export const ocrClient=String.raw`
const parseListingScreenshot=${parseListingScreenshot.toString()};
const detectListingPhoto=${detectListingPhoto.toString()};
let screenshotImage=null,ocrBusy=false,ocrWorker=null,cropFile=null,importGeneration=0;
const cropCanvas=$('#crop-canvas'),cropContext=cropCanvas.getContext('2d');
function cropRect(){return Object.fromEntries(['x','y','width','height'].map(k=>[k,Number($('#crop-'+k).value)]))}
function cropBounds(){let r=cropRect();r.x=Math.max(0,Math.min(screenshotImage.width-1,r.x));r.y=Math.max(0,Math.min(screenshotImage.height-1,r.y));r.width=Math.max(1,Math.min(screenshotImage.width-r.x,r.width));r.height=Math.max(1,Math.min(screenshotImage.height-r.y,r.height));return r}
function drawCrop(){if(!screenshotImage)return;const r=cropBounds();cropCanvas.width=screenshotImage.width;cropCanvas.height=screenshotImage.height;cropContext.drawImage(screenshotImage,0,0);cropContext.fillStyle='#07171599';cropContext.fillRect(0,0,cropCanvas.width,cropCanvas.height);cropContext.drawImage(screenshotImage,r.x,r.y,r.width,r.height,r.x,r.y,r.width,r.height);cropContext.strokeStyle='#43e5c1';cropContext.lineWidth=Math.max(3,screenshotImage.width/350);cropContext.strokeRect(r.x,r.y,r.width,r.height);$('#crop-caption').textContent='Seçilen fotoğraf: '+r.width+' × '+r.height+' piksel. Fiyatın çerçevenin dışında olduğunu kontrol et.'}
async function applyPhotoCrop(){if(!screenshotImage)return;const generation=importGeneration,r=cropBounds(),c=document.createElement('canvas');const scale=Math.min(1,1600/r.width);c.width=Math.round(r.width*scale);c.height=Math.round(r.height*scale);c.getContext('2d').drawImage(screenshotImage,r.x,r.y,r.width,r.height,0,0,c.width,c.height);const blob=await new Promise(resolve=>c.toBlob(resolve,'image/jpeg',.9));if(generation!==importGeneration)return;if(!blob)throw Error('Fotoğraf hazırlanamadı.');cropFile=new File([blob],'arac-fotografi.jpg',{type:'image/jpeg'});const transfer=new DataTransfer();transfer.items.add(cropFile);form.elements.photo.files=transfer.files;form.elements.photo.dispatchEvent(new Event('change'));$('#crop-confirm').checked=false}
for(const k of ['x','y','width','height'])$('#crop-'+k).addEventListener('input',()=>{drawCrop();$('#crop-confirm').checked=false});
$('#apply-crop').addEventListener('click',async()=>{try{await applyPhotoCrop();status('Fotoğraf güncellendi. Fiyatın görünmediğini kontrol edip onayla.')}catch(e){status(e.message)}});
$('#crop-confirm').addEventListener('change',async()=>{if($('#crop-confirm').checked){await applyPhotoCrop();$('#crop-confirm').checked=true}});
function ocrTimeout(promise,ms){let timer;return Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Okuma süresi aşıldı. İnternet bağlantını kontrol edip tekrar dene.')),ms)})]).finally(()=>clearTimeout(timer))}
function engine(){if(window.Tesseract)return Promise.resolve();return new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='/admin/ocr-engine.js';script.onload=()=>resolve();script.onerror=()=>{script.remove();reject(Error('Metin okuma aracı yüklenemedi. İnternet bağlantını kontrol edip tekrar dene.'))};document.head.append(script)})}
async function importScreenshot(){const file=$('#listing-screenshot').files[0];if(!file||ocrBusy)return;if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>15000000){status('İlan ekran görüntüsü JPG, PNG veya WebP ve en fazla 15 MB olmalı.');return}if([...form.querySelectorAll('#fields input')].some(input=>input.value)&&!confirm('Formdaki mevcut araç bilgileri, yeni görselden okunan bilgilerle değiştirilecek. Devam edilsin mi?'))return;
 ocrBusy=true;const generation=++importGeneration;$('#read-screenshot').disabled=true;$('#save').disabled=true;$('#listing-screenshot').disabled=true;$('#import-status').textContent='Görsel hazırlanıyor…';
 try{const bitmap=await createImageBitmap(file);if(bitmap.width*bitmap.height>25000000){bitmap.close();throw Error('Görsel çok büyük. En fazla 25 megapiksel bir ekran görüntüsü kullan.')}const scale=Math.min(1,2200/bitmap.width);const original=document.createElement('canvas');original.width=Math.round(bitmap.width*scale);original.height=Math.round(bitmap.height*scale);original.getContext('2d').drawImage(bitmap,0,0,original.width,original.height);bitmap.close();screenshotImage=original;
 const rect=detectListingPhoto(original.getContext('2d').getImageData(0,0,original.width,original.height).data,original.width,original.height);
 for(const k of ['x','y','width','height']){$('#crop-'+k).max=k==='x'||k==='width'?original.width:original.height;$('#crop-'+k).value=rect[k]}$('#crop-editor').hidden=false;drawCrop();await applyPhotoCrop();
 await ocrTimeout(engine(),20000);if(!ocrWorker)ocrWorker=await ocrTimeout(Tesseract.createWorker('tur+eng',1,{workerPath:'https://cdn.jsdelivr.net/npm/tesseract.js@7.0.0/dist/worker.min.js',corePath:'https://cdn.jsdelivr.net/npm/tesseract.js-core@7.0.0',logger:m=>{$('#import-status').textContent=m.status==='recognizing text'?'Araç bilgileri okunuyor… %'+Math.round(m.progress*100):'Metin okuma hazırlanıyor… İlk kullanım biraz sürebilir.'}}),90000);
 const textLeft=Math.min(original.width-1,rect.x+rect.width+Math.round(original.width*.008));const textArea=original.width-textLeft>original.width*.18?{rectangle:{left:textLeft,top:0,width:original.width-textLeft,height:original.height}}:{};const result=await ocrTimeout(ocrWorker.recognize(original,textArea),90000);if(generation!==importGeneration)return;const values=parseListingScreenshot(result.data.text);for(const [name] of fields){form.elements[name].value=values[name]||''}form.dispatchEvent(new Event('input'));
 const missing=['brand','model','family','year','km','price','fuel','gear'].filter(k=>!values[k]);const names=Object.fromEntries(fields.map(([k,label])=>[k,label]));$('#import-status').textContent=missing.length?'Bazı bilgiler okunamadı: '+missing.map(k=>names[k]).join(', ')+'. Bu alanları kontrol et.':'Araç bilgileri dolduruldu. Fotoğrafı kontrol et, hasar görselini yükle ve kaydet.';
 $('#ocr-text').textContent=result.data.text;status('Görsel okundu. Bilgileri ve fotoğraf kırpmasını kontrol et; fiyatın görünmediğini onayla.');
 }catch(e){$('#import-status').textContent='Okuma tamamlanamadı: '+e.message;status('Form kaydedilmedi. Tekrar deneyebilir veya bilgileri elle tamamlayabilirsin.');if(ocrWorker){await ocrWorker.terminate().catch(()=>{});ocrWorker=null}}
 finally{ocrBusy=false;$('#read-screenshot').disabled=false;$('#listing-screenshot').disabled=false;$('#save').disabled=!authorized}
}
$('#read-screenshot').addEventListener('click',importScreenshot);
form.addEventListener('reset',()=>{importGeneration++;cropFile=null;screenshotImage=null;$('#listing-screenshot').value='';$('#crop-editor').hidden=true;$('#crop-confirm').checked=false;$('#import-status').textContent='';$('#ocr-text').textContent=''});
window.addEventListener('pagehide',()=>{if(ocrWorker)ocrWorker.terminate()});
`;
