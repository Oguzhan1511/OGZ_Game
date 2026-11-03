import sys,os,json,io,hashlib,time,threading,termios,tty
from concurrent.futures import ThreadPoolExecutor,as_completed
import requests
from PIL import Image,ImageOps
fd=sys.stdin.fileno();old=termios.tcgetattr(fd);tty.setraw(fd);line=b''
while not line.endswith(b'\n'):line+=os.read(fd,1)
termios.tcsetattr(fd,termios.TCSADRAIN,old);key=json.loads(line)['key']
urls=json.load(open('.local/backups/media-optimization-inputs.json'));prefix='https://kwidsvgcwcgjydfybtfv.supabase.co/storage/v1/object/public/ogz-game/';endpoint='https://kwidsvgcwcgjydfybtfv.supabase.co/functions/v1/ogz-game-products';result={'saved':[],'skipped':[],'failed':[]};lock=threading.Lock();local=threading.local()
def run(url):
 try:
  if not hasattr(local,'session'):local.session=requests.Session()
  session=local.session;r=session.get(url,timeout=30);r.raise_for_status();original=r.content;im=ImageOps.exif_transpose(Image.open(io.BytesIO(original)));im.load();path=url[len(prefix):];diagram='damage' in path or path.endswith('-1');
  if not diagram:im.thumbnail((1200,1200))
  im=im.convert('RGBA' if im.mode=='RGBA' else 'RGB');out=io.BytesIO();im.save(out,format='WEBP',lossless=diagram,quality=85,method=4);data=out.getvalue()
  if len(data)>=len(original)*.9:return 'skipped',{'path':path,'before':len(original),'after':len(original)}
  target='media/optimized/'+path.replace('/','_').replace('.','_')+'_v1.webp';r=session.put(endpoint,params={'image':target},headers={'x-ogz-key':key},data=data,timeout=40);r.raise_for_status();r=session.get(prefix+target,timeout=30);r.raise_for_status()
  if hashlib.sha256(r.content).digest()!=hashlib.sha256(data).digest():raise ValueError('hash mismatch')
  return 'saved',{'path':path,'before':len(original),'after':len(data)}
 except Exception as e:return 'failed',{'url':url,'error':str(e)}
with ThreadPoolExecutor(max_workers=16) as pool:
 for i,f in enumerate(as_completed([pool.submit(run,u) for u in urls]),1):
  kind,row=f.result();result[kind].append(row)
  if i%50==0 or i==len(urls):
   with open('.local/backups/media-optimization-result.json','w') as out:json.dump(result,out)
   print(json.dumps({'processed':i,'total':len(urls),'optimized':len(result['saved']),'failed':len(result['failed'])}),flush=True)
paths=sorted(row['path'] for row in result['saved']);open('worker/image-variants.js','w').write('export const optimizedImagePaths='+json.dumps(paths)+';\n');print(json.dumps({'complete':True,'optimized':len(paths),'skipped':len(result['skipped']),'failures':len(result['failed']),'before':sum(r['before'] for r in result['saved']),'after':sum(r['after'] for r in result['saved'])}),flush=True)
