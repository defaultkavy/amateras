import { build } from "vite";
import { packages, type Package } from "../packages/amateras/src/packages";
import package_json from '../packages/amateras/package.json';
import fs from 'fs';
import path from 'path';

const importMapDir = path.resolve(__dirname + '/../packages/amateras');
const cdnDir = path.resolve(__dirname + '/../packages/cdn');
const cdnBuildDir = path.resolve(__dirname + '/../packages/cdn/build');

console.log(`[build] Start build js file on v${package_json.version}`);

// if (fs.existsSync(importMapDir)) fs.rm(importMapDir, {force: true, recursive: true}, () => {});
if (fs.existsSync(cdnBuildDir)) fs.rm(cdnBuildDir, {force: true, recursive: true}, () => {});

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
            outDir: cdnBuildDir,
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

await Bun.$`cd ${cdnDir} && bun pm version ${package_json.version}`.quiet();

console.log('[build] Done.')