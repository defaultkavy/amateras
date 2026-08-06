import { build } from "vite";
import { packages, type Package } from "./packages";
import package_json from '../packages/amateras/package.json';
import fs from 'fs';
import path from 'path';

const importMapDir = path.resolve(__dirname + '/../packages/amateras');
const cdnDir = path.resolve(__dirname + '/../packages/cdn/build');

console.log(`[build] Start build js file on v${package_json.version}`);

// if (fs.existsSync(importMapDir)) fs.rm(importMapDir, {force: true, recursive: true}, () => {});
if (fs.existsSync(cdnDir)) fs.rm(cdnDir, {force: true, recursive: true}, () => {});

async function buildJS(pkg: Package) {
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
            outDir: cdnDir,
            minify: 'terser',
        }
    });
}

await Promise.all(packages.map(buildJS));

async function buildImportMapJS() {
    await build({
        configFile: false,
        logLevel: 'silent',
        build: {
            emptyOutDir: false,
            lib: {
                entry: __dirname + '/import-map.ts',
                formats: ['es'],
                name: 'import-name',
                fileName: 'map'
            },
            outDir: importMapDir,
            minify: 'terser',
        }
    })
}

await buildImportMapJS();

console.debug('[build] Done')