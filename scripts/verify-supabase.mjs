// Credentials arrive via hidden stdin, never arguments or files.
if(process.stdin.isTTY)process.stdin.setRawMode(true);
process.stdout.write('Ready for verification credentials on stdin (hidden).\n');
let input='';process.stdin.on('data',async chunk=>{input+=chunk.toString();if(!input.includes('\n'))return;process.stdin.pause();try{const config=JSON.parse(input.trim());
 if(config.sync){const res=await fetch(config.site+'/api/admin/supabase-sync',{method:'POST',headers:{'x-ogz-key':config.key,'OAI-Sites-Authorization':'Bearer '+config.siteToken}});if(!res.ok)throw Error('Site sync HTTP '+res.status);console.log('Synced existing admin listings:',await res.text())}
 const unauthorized=await fetch(config.url);if(unauthorized.status!==401)throw Error('Missing-key access was not blocked');
 const res=await fetch(config.url,{headers:{'x-ogz-key':config.key}});if(!res.ok)throw Error('Supabase HTTP '+res.status);const {listings}=await res.json();console.log(JSON.stringify({verified:true,count:listings.length,legacy:listings.filter(x=>!x.id.startsWith('admin-')).length,admin:listings.filter(x=>x.id.startsWith('admin-')).length,unauthorized:unauthorized.status}));process.exit(0)
 }catch(e){console.error(e.message);process.exit(1)}});
