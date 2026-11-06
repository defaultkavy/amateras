import { packages } from '../packages/amateras/src/packages';
import { version } from '../packages/amateras/package.json';
const prefix = `https://unpkg.com/@amateras/cdn@${version}/dist`
const remap = {
    'amateras': `${prefix}/core`
}

const map = {
    ...remap,
    ...Object.fromEntries(
        Object.values(packages).map((pkg) => {
            const packageUrl = `${prefix}/${pkg.name}.js`;
            return [`@amateras/${pkg.name}`, packageUrl]
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