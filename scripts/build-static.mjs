import {mkdir,cp,rm,readFile,writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
await mkdir('public/vendor',{recursive:true});await cp('node_modules/qrcode-generator/qrcode.js','public/vendor/qrcode.js');
const py=`import zipfile,pathlib\nroot=pathlib.Path.cwd()\nwith zipfile.ZipFile(root/'public/pocketops-local-runner.zip','w',zipfile.ZIP_DEFLATED) as z:\n for name in ['runner.mjs','README.md','package.json','package-lock.json']:\n  z.write(root/name,'pocketops/'+name)\n for folder in ['public','demo-workspace','tests','scripts']:\n  for p in (root/folder).rglob('*'):\n   if p.is_file() and p.suffix!='.zip': z.write(p,'pocketops/'+str(p.relative_to(root)))\n`;
const result=spawnSync('python3',['-c',py],{stdio:'inherit'});if(result.status!==0)throw Error('Could not package local runner');await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});await cp('public','dist',{recursive:true});
