import { readdir } from "node:fs/promises";

const args = Bun.argv.slice(2);

const tag = prompt('Publish Tag (null): ');
const target = prompt('Target: ')

const packagesPath = `${process.cwd()}/packages`;
const packageFolders = await readdir(packagesPath);

for (const folderName of packageFolders) {
    const packageName = folderName === 'amateras' ? folderName : `@amateras/${folderName}`;
    const publishArgs = tag?.trim().length ? `--tag ${tag.trim()}` : '';
    Bun.$`(cd ${packagesPath}/${folderName} && bun publish ${publishArgs})`;
}
