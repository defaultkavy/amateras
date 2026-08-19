#!/usr/bin/env bun

import packages_json from '../package.json';
import { packages } from './packages';

console.log(`Amateras v${packages_json.version}`);

const [a1, a2, mainCommand, ...args] = process.argv;
const projectDir = process.cwd();

if (mainCommand === 'link') {
    await Bun.$`cd ${projectDir}`
    const linked: string[] = []
    const failed: string[] = []

    for (const pkg of packages) {
        const pkgName = `@amateras/${pkg.name}`
        await Bun.$`bun link ${pkgName}`.quiet()
            .then(() => linked.push(pkgName))
            .catch(() => failed.push(pkgName))
    }

    if (linked.length) console.log(`Packages linked:\n${linked.map(name => ` + ${name}`).join('\n')}`);
    if (failed.length) console.log(`Packages link failed:\n${failed.map(name => ` ! ${name}`).join('\n')}`);
}

if (mainCommand === 'init') {
    await Bun.$`cd ${projectDir}`;
    await Bun.$`bun init -y`.quiet();
    await Bun.$`rm README.md`;
    await Bun.$`rm index.ts`;
    await Bun.$`bun add amateras vite`.quiet();

    const html = `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=0.9">
        <script type="module" src="src/index.ts"></script>
    </head>
    <body>
    </body>
</html>`

    await Bun.write(`${projectDir}/index.html`, html);

    const index = `import "amateras";
import "@amateras/widget";

const App = $.widget(() => {
    $('h1', $$ => $\`Hello, World!\`)
})

$.render(App, 'body');`

    await Bun.write(`${projectDir}/src/index.ts`, index);

    const vite_config = `import { defineConfig } from "vite";
import { ViteHMR } from "@amateras/hmr";

export default defineConfig({
    plugins: [
        ViteHMR()
    ]
})`

    await Bun.write(`${projectDir}/vite.config.ts`, vite_config);

    const tsconfig_text = await Bun.file(`${projectDir}/tsconfig.json`).text();

    await Bun.write(`${projectDir}/tsconfig.json`, tsconfig_text.replace('"lib": ["ESNext"],', '"lib": ["ESNext", "DOM"],'))

    const package_json = await Bun.file(`${projectDir}/package.json`).json();

    package_json.scripts = {
        dev: "bunx --bun vite dev",
        build: "bunx --bun vite build"
    }

    await Bun.write(`${projectDir}/package.json`, JSON.stringify(package_json, undefined, 2));

    console.log(`Project initialized.
        
+ src/index.ts
+ .gitignore
+ index.html
+ package.json
+ tsconfig.json
+ vite.config.ts

Use \`bun run dev\` to start dev server.
    `)
}

// if (mainCommand === 'add') {
//     await Bun.$`cd ${projectDir}`
//     const [arg1] = args;
//     if (arg1 === 'all') {
//         await Bun.$`bun add ${packages.filter(pkg => pkg.listed).map(pkg => `@amateras/${pkg.name}`).join(' ')}`
//     } else {
//         if (!arg1) throw 'No package name';
//         await Bun.$`bun add ${args.map(name => `@amateras/${name}`)}`;
//     }
// }