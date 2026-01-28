import { build } from 'vite';
import { packages } from './packages';

const root = process.cwd() + `/size_temp`;
const filename = root + `/index.ts`;
const analysisOutput = root + '/stats.json';

type ModuleInfo = {
    bytes: number,
    total_size: string,
    total_gzip: string,
    diff_size: string,
    diff_gzip: string,
    description: string
}

async function analysisPackageSize() {
    const packageMap = new Map<string, ModuleInfo>();
    let coreSize = 0;
    let coreGzipSize = 0;

    for (const {name, description, codeInsert} of packages) {
        const code = `import 'amateras'; ${codeInsert ?? `import "amateras/${name}";`}`
        console.log(`Packaging '${name}'...`)
        const packageSize = await getSize(code);

        if (name === 'amateras/core') {
            coreSize = packageSize.moduleSize;
            coreGzipSize = packageSize.gzipSize;
        }

        packageMap.set(name, {
            bytes: packageSize.moduleSize,
            total_size: toKB(packageSize.moduleSize),
            total_gzip: toKB(packageSize.gzipSize),
            diff_size: toKB(packageSize.moduleSize - coreSize),
            diff_gzip: toKB(packageSize.gzipSize - coreGzipSize),
            description
        })

    }

    return Object.fromEntries(packageMap)
}

function toKB(num: number) {
    return `${(num / 1024).toFixed(2)} kB`
}

async function getSize(code: string) {

    await Bun.write(root + `/index.html`, '<html><head><script type="module" src="./index.ts"></script></head><body></body></html>')
    await Bun.write(filename, code)

    let size = 0;
    let gzipSize = 0;

    await build({
        configFile: false,
        logLevel: 'silent',
        plugins: [
            {
                name: 'vite-plugin-size-stats',
                enforce: 'post',
                generateBundle(_, bundle) {
                    for (const [name, chunk] of Object.entries(bundle)) {
                        if (chunk.type === 'chunk') {
                            size = chunk.code.length;
                            gzipSize = Bun.gzipSync(chunk.code).length;
                        }
                    }
                }
            }
        ],
        root: root,
        build: {
            outDir: './test',
            write: false,
            minify: 'esbuild',
        }
    });

    await Bun.$`rm -rf ${root}`;

    return {moduleSize: size, gzipSize}
}
const data = await analysisPackageSize()

console.table(data);

function toMarkdownTable(data: Record<string, ModuleInfo>) {
    const header = ['模块库', '体积', 'Gzip', '简介'];
    const contents: string[][] = [];
    for (const [name, info] of Object.entries(data)) {
        if (name === 'core') contents.push([name, info.total_size, info.total_gzip, info.description])
        else contents.push([name, info.diff_size, info.diff_gzip, info.description]);
    }

    const headerLines = header.map(() => '---');

    const rows: string[][] = [header, headerLines, ...contents];

    return rows.map(row => '|' + row.map(content => ` ${content} `).join('|') + '|').join('\n')
}

console.debug(toMarkdownTable(data))

// function watcher() {
//     const watche = watch(process.cwd() + '/node_modules/amateras', {
//         recursive: true,
//     }, (e, filename) => {
//         console.debug(filename);
//     })
// }

// watcher();