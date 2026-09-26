// Run outside the hosting account. Credentials are read only from environment variables.
import {writeFile,mkdir} from 'node:fs/promises';
import {encryptBackup,bytesHash} from '../lib/backup-crypto.ts';
const base=process.env.PROFILEPATH_URL;const token=process.env.PROFILEPATH_BACKUP_TOKEN;const pass=process.env.PROFILEPATH_BACKUP_PASSPHRASE;
if(!base||!token||!pass||pass.length<16)throw Error('Set PROFILEPATH_URL, PROFILEPATH_BACKUP_TOKEN and a 16+ character PROFILEPATH_BACKUP_PASSPHRASE.');
if(new URL(base).protocol!=='https:')throw Error('Use an HTTPS site URL.');
const headers={Authorization:'Bearer '+token,...(process.env.PROFILEPATH_SITE_ACCESS_TOKEN?{'OAI-Sites-Authorization':process.env.PROFILEPATH_SITE_ACCESS_TOKEN}:{})};
async function get(path){const response=await fetch(new URL(path,base),{headers,redirect:'error',signal:AbortSignal.timeout(120000)});if(!response.ok)throw Error('Backup request failed: HTTP '+response.status);return response;}
const manifest=await (await get('/api/operations/backup')).json();if(manifest.format!=='profilepath-system-backup')throw Error('Expected backup manifest. Check site access.');
const objects=[];let total=0;for(const file of manifest.tables.evidence){const bytes=new Uint8Array(await (await get('/api/operations/backup?document='+encodeURIComponent(file.id))).arrayBuffer());total+=bytes.length;if(total>100*1024*1024)throw Error('This runner supports 100 MB of documents. Arrange a streaming database-native backup before exceeding this limit.');if(bytes.length!==file.size)throw Error('Incomplete object.');objects.push({id:file.id,mime:file.mime,size:bytes.length,sha256:await bytesHash(bytes),base64:Buffer.from(bytes).toString('base64')});}
const after=await (await get('/api/operations/backup')).json();if(after.fingerprint!==manifest.fingerprint)throw Error('Concurrent edits detected. Retry backup.');
const encrypted=await encryptBackup({...manifest,objects},pass);const dir=process.env.PROFILEPATH_BACKUP_DIR||'./private-backups';await mkdir(dir,{recursive:true,mode:0o700});const filename=dir+'/profilepath-'+new Date().toISOString().replaceAll(':','-')+'.ppbackup';await writeFile(filename,encrypted,{mode:0o600,flag:'wx'});console.log('Encrypted backup written. Store the passphrase separately.');
