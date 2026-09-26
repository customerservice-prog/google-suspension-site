import {copyFileSync,mkdirSync,readdirSync,cpSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
mkdirSync(new URL('../public/',import.meta.url),{recursive:true});
copyFileSync(require.resolve('pdfjs-dist/build/pdf.worker.min.mjs'),new URL('../public/pdf.worker.min.mjs',import.meta.url));
const pdfRoot=new URL('./','file://'+require.resolve('pdfjs-dist/package.json'));for(const [src,dst] of [['wasm','pdf-wasm'],['cmaps','pdf-cmaps'],['standard_fonts','pdf-fonts']])cpSync(new URL(src,pdfRoot),new URL('../public/'+dst,import.meta.url),{recursive:true});
const ocrDir=new URL('../public/ocr/',import.meta.url);mkdirSync(new URL('core/',ocrDir),{recursive:true});mkdirSync(new URL('lang/',ocrDir),{recursive:true});
copyFileSync(require.resolve('tesseract.js/dist/worker.min.js'),new URL('worker.min.js',ocrDir));
const tessRequire=createRequire(require.resolve('tesseract.js/package.json'));const coreDir=new URL('./', 'file://'+tessRequire.resolve('tesseract.js-core/package.json'));
for(const file of readdirSync(coreDir).filter(f=>/^tesseract-core.*\.wasm(?:\.js)?$/.test(f)))copyFileSync(new URL(file,coreDir),new URL('core/'+file,ocrDir));
copyFileSync(require.resolve('@tesseract.js-data/eng/4.0.0_best_int/eng.traineddata.gz'),new URL('lang/eng.traineddata.gz',ocrDir));
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { readExecutionProfile } from "./execution-profile.mjs";

const [command, ...args] = process.argv.slice(2);
if (!["dev", "build"].includes(command)) throw new Error("Expected dev or build.");
const managedLinux = readExecutionProfile() === "managed-linux";

if (managedLinux && command === "build") {
  const result = spawnSync("bash", [
    fileURLToPath(new URL("./build-verified.sh", import.meta.url)), ...args,
  ], { stdio: "inherit" });
  if (result.error) throw result.error;
  process.exit(result.status ?? 1);
}

// Import in this process so the preview owner retains its PID and signals.
const cli = new URL(managedLinux
  ? "../node_modules/vite/bin/vite.js"
  : "../node_modules/vinext/dist/cli.js", import.meta.url);
process.argv = [process.execPath, fileURLToPath(cli), command,
  ...(!managedLinux && command === "dev" ? ["--port", "5173"] : []), ...args];
await import(cli.href);
