import package_json from '../package.json';
const prefix = 
`https://unpkg.com/amateras@${package_json.version}/build`

const remap = {
    'amateras': `${prefix}/core.js`,
}

const packageNames = [
    'core',
    'utils',
    'signal',
    'for',
    'if',
    'match',
    'css',
    'i18n',
    'idb',
    'meta',
    'prefetch',
    'router',
    'widget'
]

const map = {
    ...remap,
    ...Object.fromEntries(
        packageNames.map(name => {
            const packageName = `amateras/${name}`;
            const packageUrl = `${prefix}/${name}.js`;
            return [[packageName, packageUrl], [`@${packageName}`, packageUrl]]
        }).flat()
    )
}

const $script = document.querySelector('script[type="importmap"]');
if ($script) {
    const json = JSON.parse($script.innerHTML);
    json.imports = {
        ...json.imports,
        ...map
    }
    $script.innerHTML = JSON.stringify(json, null, "\t");
}

else {
    const $script = document.createElement('script');
    $script.setAttribute('type', 'importmap');
    $script.innerHTML = JSON.stringify({
        imports: map
    }, null, "\t");
    document.head.prepend($script);
}