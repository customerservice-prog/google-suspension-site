import {createWorker,PSM} from 'tesseract.js';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
const root=fileURLToPath(new URL('../',import.meta.url));
for(const family of ['', '-lstm','-simd','-simd-lstm','-relaxedsimd','-relaxedsimd-lstm'])for(const ext of ['.wasm','.wasm.js'])assert.ok(existsSync(root+'public/ocr/core/tesseract-core'+family+ext));
const input=process.argv[2];if(!input)throw Error('Pass a test image path.');
const worker=await createWorker('eng',1,{langPath:root+'public/ocr/lang',cacheMethod:'none'});
try{await worker.setParameters({tessedit_pageseg_mode:PSM.AUTO});const {data}=await worker.recognize(input);assert.match(data.text,/NORTHLINE PLUMBING/);assert.match(data.text,/Business Profile has been suspended/);assert.ok(data.confidence>70);console.log('PASS actual English OCR recognizes the synthetic suspension notice; all self-hosted engine assets exist.');}finally{await worker.terminate();}
