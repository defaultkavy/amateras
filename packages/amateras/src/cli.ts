#!/usr/bin/env bun

import packages_json from '../package.json';
import { packages } from './packages';

const [,, mainCommand, ...args] = process.argv;
const projectDir = process.cwd();

console.log(`amateras ${mainCommand} v${packages_json.version}`);

if (mainCommand === 'link') {
    await Bun.$`cd ${projectDir}`
    const linked: string[] = []
    const failed: string[] = []

    for (const pkg of Object.values(packages)) {
        if (!pkg.link) continue;
        const pkgName = `@amateras/${pkg.name}`
        await Bun.$`bun link ${pkgName}`.quiet()
            .then(() => linked.push(pkgName))
            .catch(() => failed.push(pkgName))
    }

    if (linked.length) console.log(`Packages linked:\n${linked.map(name => ` + ${name}`).join('\n')}`);
    if (failed.length) console.log(`Packages link failed:\n${failed.map(name => ` ! ${name}`).join('\n')}`);
}

if (mainCommand === 'init') {
    const SSR = args.includes('--ssr');

    await Bun.$`cd ${projectDir}`;
    await Bun.$`bun init -y`.quiet();
    await Bun.$`rm README.md`;
    await Bun.$`rm index.ts`;

    const libs = ['amateras', 'vite'];
    if (SSR) libs.push('tsukimi');

    await Bun.$`bun add ${libs}`.quiet();

    const html = await Bun.file(`${import.meta.dir}/template/index.html`).text();
    await Bun.write(`${projectDir}/index.html`, html);

    // Setup index.ts
    const index = await Bun.file(`${import.meta.dir}/template/index.ts`).text();
    await Bun.write(`${projectDir}/src/index.ts`, index);

    // Setup index.ts
    const app = await Bun.file(`${import.meta.dir}/template/App.ts`).text();
    await Bun.write(`${projectDir}/src/widget/App.ts`, app);

    // Setup vite.config.ts
    const vite_config = await Bun.file(`${import.meta.dir}/template/vite.config.ts`).text();
    await Bun.write(`${projectDir}/vite.config.ts`, vite_config);

    // Setup tsconfig.json
    const tsconfig_text = await Bun.file(`${projectDir}/tsconfig.json`).text();
    await Bun.write(`${projectDir}/tsconfig.json`, tsconfig_text.replace('"lib": ["ESNext"],', '"lib": ["ESNext", "DOM"],'))

    // Setup package.json
    const package_json = await Bun.file(`${projectDir}/package.json`).json();
    package_json.scripts = {
        dev: "bunx --bun vite dev",
        build: "bunx --bun vite build",
        ...(SSR ? {
            start: "bun server.ts"
        } : {})
    }
    await Bun.write(`${projectDir}/package.json`, JSON.stringify(package_json, undefined, 2));

    if (args.includes('--ssr')) {
        // Setup server.ts
        const server = await Bun.file(`${import.meta.dir}/template/server.ts`).text();
        await Bun.write(`${projectDir}/server.ts`, server);
    }

    const files = [
        'index.html',
        SSR ? 'server.ts' : undefined,
        'src/index.ts',
        'src/widget/App.ts',
        'package.json',
        'tsconfig.json',
        'vite.config.ts'
    ]

    console.log(`Project initialized.\n\n${files.filter(f => f).map(t => `+ ${t}`).join('\n')}\n\nUse \`bun run dev\` to start dev server.
    `)
}