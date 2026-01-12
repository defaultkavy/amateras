import { build } from "vite";
import { packages } from "./packages";
const root = process.cwd() + `/size_temp`;
const outputDir = process.cwd() + '/output'
const indexfile = root + `/index.ts`;
const outputFilename = 'amateras.js';

async function bundle(code: string) {

    await Bun.write(root + `/index.html`, '<html><head><script type="module" src="./index.ts"></script></head><body></body></html>')
    await Bun.write(indexfile, code)

    let size = 0;
    let gzipSize = 0;

    await build({
        configFile: false,
        // logLevel: 'silent',
        root: root,
        build: {
            outDir: outputDir,
            rollupOptions: {
                output: {
                    entryFileNames: `js/${outputFilename}`
                }
            },
            write: true,
            minify: 'esbuild',
        }
    });

    await Bun.$`rm -rf ${root}`;
    await Bun.$`mv ${outputDir}/js/${outputFilename} ${process.cwd()}/../unpkg/${outputFilename}`;
    await Bun.$`rm -rf ${outputDir}`

    return {moduleSize: size, gzipSize}
}

bundle(packages.map(pkg => `import '${pkg.name}';`).join(''))