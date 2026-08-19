import package_json from '../packages/amateras/package.json';
import { packages } from '../packages/amateras/src/packages';
const prefix = `https://unpkg.com/@amateras/cdn@${package_json.version}/build`

const remap = {
    'amateras': `${prefix}/core.js`
}

const packageNames = packages.map(p => p.name);

const map = {
    ...remap,
    ...Object.fromEntries(
        packageNames.map(name => {
            const packageName = `amateras/${name}`;
            const packageUrl = `${prefix}/${name}.js`;
            return [`@${packageName}`, packageUrl]
        })
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