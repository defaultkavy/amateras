import package_json from '../package.json';

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
}

const SEM = Bun.argv[2];
const targetVersion = versionTarget();

console.log(`Amateras version: ${color(`v${package_json.version}`, 'cyan')}`);

console.log(`Publish version: ${color(targetVersion, 'yellow')}\n`);

// check user npm account
try {
    console.log('Checking your NPM account')
    const output = await Bun.$`npm whoami`.quiet();
    console.log(color(output.text(), 'cyan'))
} catch (err) {
    console.log('NPM account not found, login first')
    await login();
}

// user comfirm before publish
comfirm(`Confirm publish the package in v${targetVersion}? (y/n)`);
// new line
console.log('');
step(1, `Set the package version to ${targetVersion}.`);
if (targetVersion !== package_json.version) {
    await Bun.$`bun pm version ${SEM} --no-git-tag-version`.quiet();
    await Bun.$`git add package.json`.quiet();
    await Bun.$`git commit -m v${targetVersion}`.quiet();
    await Bun.$`git tag v${targetVersion}`.quiet();
}

step(2, 'Building JS files...');
await Bun.$`bun run build`.quiet();

step(3, `Publishing Amateras in v${targetVersion}...`)

try {
    Bun.spawnSync(['npm', 'publish'], {
        stdin: 'inherit',
        stdout: 'inherit'
    })
} catch(err) {
    console.log(`Publish process failed.`)
    process.exit();
}

console.log(color(`Amateras v${targetVersion} Published.\n`, 'cyan'))

comfirm('Sync these changes and tags to GitHub repository? (y/n)');

await Bun.$`git push --tags`

console.log('\nCompleted.')


async function login() {
    try {
        await Bun.$`npm login`;
    } catch(err) {
        console.log('Login failed, try again.')
    }
}

function versionTarget() {
    if (!SEM) return package_json.version;
    let version_semList = package_json.version.split('.')
    switch (SEM) {
        case 'patch': {
            bump(2)
            break;
        }
        case 'minor': {
            bump(1)
            break;
        }
        case 'major': {
            bump(0)
            break;
        }
    }

    return version_semList.join('.')

    function bump(index: number) {
        const num = Number(version_semList[index]);
        version_semList[index] = `${num + 1}`;
    }
}

function comfirm(message: string) {
    const reply = prompt(message);

    if (reply === null) comfirm(message);
    else if (reply === 'n') {
        console.log('Exit.')
        process.exit();
    }
    else if (reply !== 'y') comfirm(message);
}

function color(message: string, color: keyof typeof colors) {
    return `${colors[color]}${message}${colors.reset}`
}

function step(step: number, message: string) {
    console.log(`(${step}/3) - ${message}`)
}