import { build } from "vite";
import { packages, type Package } from "./packages";
import package_json from '../package.json';
import fs from 'fs';
import path from 'path';

const outputDir = path.resolve(__dirname + '/../build')

console.log(`[build] Start build js file on v${package_json.version}`);

if (fs.existsSync(outputDir)) fs.rm(outputDir, {force: true, recursive: true}, () => {});

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
            outDir: outputDir,
            minify: 'terser',
        }
    });
}

await Promise.all(packages.map(buildJS));

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