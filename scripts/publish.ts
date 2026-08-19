import { readdir } from "node:fs/promises";

const args = Bun.argv.slice(2);

const tag = prompt('Publish Tag (null): ');

const packagesDir = `${process.cwd()}/packages`;
const packageFolders = await readdir(packagesDir);

const publishPackages: {name: string, dir: string, version: string, registryVersion: string}[] = [];

console.log('Comparing packages version from registry...');
await Promise.all(packageFolders.map(async folderName => {
    const packagePath = `${packagesDir}/${folderName}`;
    const packageName = folderName === 'amateras' ? folderName : `@amateras/${folderName}`;
    const version = await Bun.$`(cd ${packagePath} && bun pm pkg get version)`.quiet().then(res => res.json() as string);
    const registryVersion = await Bun.$`bun info ${packageName} version`.quiet().then(res => res.text().trim()).catch(() => 'none');
    if (version === registryVersion) return;
    publishPackages.push({
        name: packageName,
        dir: packagePath,
        version: version,
        registryVersion
    });
}))

console.log(`Publish Packages:\n${publishPackages.map(pkg => {
    const length = `+ ${pkg.name}`.length;
    return `+ ${pkg.name.slice(0, 40)}${' '.repeat(40 - length)}${pkg.registryVersion} -> ${pkg.version}`
}).join('\n')}`)

const confirm = prompt('Publish all packages? (y/N)');

if (!confirm) process.exit();
else if (confirm.toLowerCase() === 'n') process.exit();
else if (confirm.toLowerCase() === 'y') {
    await Bun.$`bun update`.quiet();
    for (const pkg of publishPackages) {
        const publishArgs = tag?.trim().length ? [`--tag ${tag.trim()}`] : [];
        await Bun.$`(cd ${pkg.dir} && bun publish --access public)`;
    }
    console.log('Done')
}
