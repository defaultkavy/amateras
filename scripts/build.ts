import { build } from "vite";
import { packages, type Package, Env } from "../packages/amateras/src/packages";
import package_json from '../packages/amateras/package.json';
import fs from 'fs';
import path from 'path';
import * as ts_async from 'typescript/async';
import { ScriptTarget } from "typescript/ast";
import { ModuleDetectionKind } from "typescript/proto";

const importMapDir = path.resolve(__dirname + '/../packages/amateras/dist');
const cdnDir = path.resolve(__dirname + '/../packages/cdn');
const cdnBuildDir = path.resolve(__dirname + '/../packages/cdn/dist');

console.log(`[build] Start build js file on v${package_json.version}`);

// if (fs.existsSync(importMapDir)) fs.rm(importMapDir, {force: true, recursive: true}, () => {});
if (fs.existsSync(cdnBuildDir)) fs.rm(cdnBuildDir, {force: true, recursive: true}, () => {});

async function buildCDN(pkg: Package) {
    await build({
        configFile: false,
        logLevel: 'silent',
        build: {
            lib: {
                entry: __dirname + `/../packages/${pkg.entry}`,
                formats: ['es'],
                fileName: `${pkg.name}`
            },
            rollupOptions: {
                external: [
                    /^@amateras/
                ]
            },
            emptyOutDir: false,
            write: true,
            outDir: cdnBuildDir,
            minify: 'terser',
        }
    });
}

async function buildESM(pkg: Package) {
    const [package_root_name, package_ext_name] = pkg.name.split('/');
    return build({
        configFile: false,
        logLevel: 'silent',
        root: __dirname + `/../packages/${package_root_name}`,
        build: {
            lib: {
                entry: __dirname + `/../packages/${pkg.entry}`,
                formats: ['es'],
                fileName: () => `index.js`
            },
            rollupOptions: {
                external: [
                    /^@amateras/,
                ]
            },
            emptyOutDir: true,
            write: true,
            outDir: package_ext_name ? `dist/${package_ext_name}` : `dist`,
            minify: 'terser'
        }
    })
}

async function tsc(pkg: Package) {
    const api = new ts_async.API();
    const program = await api.createProgram([__dirname + `/../packages/${pkg.entry}`], {
        target: ScriptTarget.ES2026,
        module: ts_async.ModuleKind.Preserve,
        moduleDetection: ModuleDetectionKind.Force,
        types: ["bun"],
        outDir: __dirname + `/../packages/${pkg.name}/dist`,

        // Bundler mode
        "moduleResolution": ts_async.ModuleResolutionKind.Bundler,
        "allowImportingTsExtensions": true,
        "verbatimModuleSyntax": true,

        // Best practices
        "strict": true,
        "skipLibCheck": true,
        "noFallthroughCasesInSwitch": true,
        "noUncheckedIndexedAccess": true,
        "noImplicitOverride": true,

        // Some stricter flags (disabled by default)
        "noUnusedLocals": false,
        "noUnusedParameters": false,
        "noPropertyAccessFromIndexSignature": false
    })
    return program.emit().then(() => api.close())
}

await Promise.all(Object.values(packages).filter(pkg => pkg.env !== Env.Server).map(buildCDN));

async function buildImportMapJS() {
    await build({
        configFile: false,
        logLevel: 'silent',
        build: {
            emptyOutDir: false,
            lib: {
                entry: __dirname + '/importmap.ts',
                formats: ['es'],
                name: 'import-name',
                fileName: () => 'importmap.js'
            },
            outDir: importMapDir,
            minify: 'terser'
        }
    })
}

await tsc(packages.sw);
await buildImportMapJS();

console.log('[build] Done.')