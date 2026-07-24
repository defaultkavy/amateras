#!/usr/bin/env bun

import packages from './package.json';

console.log(`Amateras v${packages.version}`);

const [a1, a2, mainCommand] = process.argv;

if (mainCommand === 'link') {
    await Bun.$`cd ${process.cwd()}`
    const linked: string[] = []
    const failed: string[] = []

    for (const [pkgName] of Object.entries(packages.dependencies)) {
        await Bun.$`bun link ${pkgName}`.quiet()
            .then(() => linked.push(pkgName))
            .catch(() => failed.push(pkgName))
    }

    if (linked.length) console.log(`Packages linked:\n${linked.map(name => ` + ${name}`).join('\n')}`);
    if (failed.length) console.log(`Packages link failed:\n${failed.map(name => ` ! ${name}`).join('\n')}`);
}