import assert from 'node:assert/strict';
import {createSandbox} from '../public/sandbox.mjs';
const box=createSandbox();let job=await box.submit('Run the tests');assert.equal(job.status,'awaiting_approval');await box.act(job.id,'approve');assert.equal((await box.state()).jobs[0].result.exitCode,1);job=await box.submit('Propose a pricing fix');await box.act(job.id,'approve');assert.equal((await box.state()).jobs[0].result.exitCode,0);console.log('Browser sample tests fail before the reviewed fix and pass after approval.');
