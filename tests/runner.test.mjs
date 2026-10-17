import assert from 'node:assert/strict';
import {mkdtemp,cp,readFile,writeFile,rm,symlink} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {createRunner} from '../runner.mjs';
const temp=await mkdtemp(path.join(os.tmpdir(),'pocketops-test-'));await cp(new URL('../demo-workspace/',import.meta.url),temp,{recursive:true});const runner=await createRunner({workspace:temp,port:0,persist:false}),base=runner.addresses()[0],headers={Authorization:'Bearer '+runner.token,'Content-Type':'application/json'};
async function request(route,method='GET',data,auth=true){const r=await fetch(base+route,{method,headers:auth?headers:{},body:data?JSON.stringify(data):undefined});return {status:r.status,data:await r.json()};}
async function approve(id){const j=await waitJob(id,['awaiting_approval']);return request('/api/tasks/'+id+'/approve','POST',{approvalHash:j.approvalHash});}
async function waitJob(id,wanted){for(let i=0;i<100;i++){const {data}=await request('/api/state'),j=data.jobs.find(j=>j.id===id);if(wanted.includes(j.status))return j;await new Promise(r=>setTimeout(r,20));}throw Error('Task timed out');}
try{
 assert.equal((await request('/api/state','GET',undefined,false)).status,401);
 const inspect=await request('/api/tasks','POST',{instruction:'Inspect the project'});assert.equal(inspect.status,201);const inspected=await waitJob(inspect.data.id,['succeeded','failed']);assert.equal(inspected.status,'succeeded');assert.equal(inspected.result.files.length,3);
 const tests=await request('/api/tasks','POST',{instruction:'Run the tests'});const awaiting=await waitJob(tests.data.id,['awaiting_approval']);assert(awaiting.review.command.includes('node --test'));assert.equal((await request('/api/tasks/'+tests.data.id+'/approve','POST',{approvalHash:'wrong'})).status,409);await approve(tests.data.id);assert.equal((await waitJob(tests.data.id,['failed','succeeded'])).status,'failed');
 const repair=await request('/api/tasks','POST',{instruction:'Propose a pricing fix'});const proposal=await waitJob(repair.data.id,['awaiting_approval']);assert(proposal.review.after.includes('discountPercent / 100'));assert(!(await readFile(path.join(temp,'src/pricing.mjs'),'utf8')).includes('discountPercent / 100'));await approve(repair.data.id);const result=await waitJob(repair.data.id,['failed','succeeded']);assert.equal(result.status,'succeeded');assert.match(result.result.output,/pass 4/);
 assert.equal((await request('/api/tasks/'+repair.data.id+'/approve','POST')).status,409);
 const more=await request('/api/tasks','POST',{instruction:'Run the tests'});await waitJob(more.data.id,['awaiting_approval']);await request('/api/tasks/'+more.data.id+'/reject','POST');assert.equal((await waitJob(more.data.id,['rejected'])).status,'rejected');
 await assert.rejects(()=>runner.safePath('../outside-file'));await symlink('/etc/hosts',path.join(temp,'outside-link'));await assert.rejects(()=>runner.safePath('outside-link'));
 const original=(await readFile(path.join(temp,'src/pricing.mjs'),'utf8')).replace('discountPercent / 100','discountPercent');await writeFile(path.join(temp,'src/pricing.mjs'),original);const stale=await request('/api/tasks','POST',{instruction:'Fix the pricing'});await waitJob(stale.data.id,['awaiting_approval']);await writeFile(path.join(temp,'src/pricing.mjs'),original+'\n');await approve(stale.data.id);const staleResult=await waitJob(stale.data.id,['failed']);assert.match(staleResult.result.summary,/changed since review/);
 const changed=await request('/api/tasks','POST',{instruction:'Run tests'});await waitJob(changed.data.id,['awaiting_approval']);const testFile=path.join(temp,'tests/pricing.test.mjs');await writeFile(testFile,(await readFile(testFile,'utf8'))+'\n');await approve(changed.data.id);assert.match((await waitJob(changed.data.id,['failed'])).result.summary,/Test file changed/);
 const syntax=await request('/api/tasks','POST',{instruction:'Check JavaScript syntax'});assert.equal((await waitJob(syntax.data.id,['succeeded','failed'])).status,'succeeded');
 console.log('Verified: pairing authentication, inspection, real failing tests, approved patch, passing tests, rejection, path boundaries, stale patch protection, and syntax checking.');
}finally{await runner.close();await rm(temp,{recursive:true,force:true});}
