export type Package = {
    name: string;
    description: string;
    entry: string;
    mapped: boolean;
    listed: boolean;
    link: boolean;
    standalone: boolean;
    includedCore: boolean;
    env: Env;
}

export const enum Env {
    Browser,
    Server,
    Both
}

type PackageSequence = [
    description: string,
    entry: string,
    mapped: boolean,
    listed: boolean,
    link: boolean,
    standalone: boolean,
    includedCore: boolean,
    env: Env
]

const packageSequences = {
    core: ["Core module", 'core/src/index.ts', true, true, true, false, false, Env.Both],
    widget: ["Component module", 'widget/src/index.ts', true, true, true, false, true, Env.Both],
    signal: ["Reactive data module", 'signal/src/index.ts', true, true, true, false, true, Env.Both],
    store: ['Access data between widgets', 'store/src/index.ts', true, true, true, false, true, Env.Both],
    css: ["CSS-in-JS module", 'css/src/index.ts', true, true, true, false, true, Env.Both],
    "css/variable": ["CSS variable module", 'css/src/ext/variable.ts', true, false, false, false, true, Env.Both],
    "css/keyframes": ["CSS keyframes module", 'css/src/ext/keyframes.ts', true, false, false, false, true, Env.Both],
    "css/property": ["CSS property module", 'css/src/ext/property.ts', true, false, false, false, true, Env.Both],
    "css/colors": ["CSS Colors module", 'css/src/ext/colors.ts', true, false, false, false, true, Env.Both],
    "css/cssc": ["CSS Fluent Templates module", 'css/src/ext/cssc.ts', true, false, false, false, true, Env.Both],
    "css/static-colors": ["CSS Static Colors module", 'css/src/ext/static-colors.ts', true, false, false, false, true, Env.Both],
    "css/variables": ["CSS Preset Variables module", 'css/src/ext/variables.ts', true, false, false, false, true, Env.Both],
    for: ["For loop control-flow", 'for/src/index.ts', true, true, true, false, true, Env.Both],
    if: ["If/Else/ElseIf control-flow", 'if/src/index.ts', true, true, true, false, true, Env.Both],
    match: ["Match/Case/Default control-flow", 'match/src/index.ts', true, true, true, false, true, Env.Both],
    router: ["Router module", 'router/src/index.ts', true, true, true, false, true, Env.Both],
    i18n: ["Translation module", 'i18n/src/index.ts', true, true, true, false, true, Env.Both],
    prefetch: ["SSR data prefetch", 'prefetch/src/index.ts', true, true, true, false, true, Env.Both],
    meta: ["SSR `meta` tag manager", 'meta/src/index.ts', true, true, true, false, true, Env.Both],
    hmr: ["Utilities module", 'hmr/src/index.ts', false, false, true, false, true, Env.Server],
    sw: ["Utilities module", 'sw/src/index.ts', false, false, true, false, true, Env.Server],
    ui: ["UI components", 'ui/src/index.ts', true, true, true, true, true, Env.Both],

    idb: ["IndexedDB module", 'idb/src/index.ts', true, true, true, true, false, Env.Both],
    markdown: ["Markdown to HTML module", 'markdown/src/index.ts', true, true, true, true, false, Env.Both],
    fluent: ["One line object descriptor", 'fluent/src/index.ts', true, true, true, true, false, Env.Both],
    utils: ["Utilities module", 'utils/src/index.ts', true, true, true, true, false, Env.Both],
    opfs: ["OPFS module", 'opfs/src/index.ts', true, true, true, true, false, Env.Both]
} satisfies Record<string, PackageSequence>

export const packages = Object.fromEntries(Object.entries(packageSequences).map(([name, [description, entry, mapped, listed, link, standalone, includedCore, env]]) => [name, {
    name,
    description,
    entry,
    mapped,
    listed,
    link,
    standalone,
    includedCore,
    env
} satisfies Package
])) as Record<keyof typeof packageSequences, Package>