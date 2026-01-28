import { build } from "vite";
import { packages } from "./packages";
import fs from 'fs';
import path from 'path';
const outputDir = path.resolve(__dirname + '/../build')

console.log('[build] Start build js file');

if (fs.existsSync(outputDir)) fs.rm(outputDir, {force: true, recursive: true}, () => {});

async function buildJS(packageName: string) {
    await build({
        configFile: false,
        logLevel: 'silent',
        build: {
            lib: {
                entry: __dirname + `/../packages/${packageName}/src/index.ts`,
                formats: ['es'],
                fileName: `${packageName}`
            },
            rollupOptions: {
                external: [
                    /^@amateras/
                ]
            },
            emptyOutDir: false,
            write: true,
            outDir: outputDir,
            minify: 'terser',
        }
    });
}

await Promise.all(packages.map(p => buildJS(p.name)));

async function buildImportMapJS() {
    await build({
        configFile: false,
        build: {
            emptyOutDir: false,
            lib: {
                entry: __dirname + '/import-map.ts',
                formats: ['es'],
                name: 'import-name',
                fileName: '[name]'
            },
            outDir: outputDir,
            minify: 'terser',
        }
    })
}

await buildImportMapJS();

console.debug('[build] Done')