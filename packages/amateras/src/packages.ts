export type Package = {
    name: string;
    description: string;
    entry: string;
    mapped: boolean;
    listed: boolean;
    link: boolean;
    standalone: boolean;
    includedCore: boolean;
}

type PackageSequence = [
    name: string,
    description: string,
    entry: string,
    mapped: boolean,
    listed: boolean,
    link: boolean,
    standalone: boolean,
    includedCore: boolean
]

const packageSequences: PackageSequence[] = [
    ["core", "Core module", 'core/src/index.ts', true, true, true, false, false],
    ["widget", "Component module", 'widget/src/index.ts', true, true, true, false, true],
    ["signal", "Reactive data module", 'signal/src/index.ts', true, true, true, false, true],
    ['store', 'Access data between widgets', 'store/src/index.ts', true, true, true, false, true],
    ["css", "CSS-in-JS module", 'css/src/index.ts', true, true, true, false, true],
    ["css/variable", "CSS variable module", 'css/src/ext/variable.ts', true, false, false, false, true],
    ["css/keyframes", "CSS keyframes module", 'css/src/ext/keyframes.ts', true, false, false, false, true],
    ["css/property", "CSS property module", 'css/src/ext/property.ts', true, false, false, false, true],
    ["css/colors", "CSS Colors module", 'css/src/ext/colors.ts', true, false, false, false, true],
    ["css/cssc", "CSS Fluent Templates module", 'css/src/ext/cssc.ts', true, false, false, false, true],
    ["css/static-colors", "CSS Static Colors module", 'css/src/ext/static-colors.ts', true, false, false, false, true],
    ["css/variables", "CSS Preset Variables module", 'css/src/ext/variables.ts', true, false, false, false, true],
    ["for", "For loop control-flow", 'for/src/index.ts', true, true, true, false, true],
    ["if", "If/Else/ElseIf control-flow", 'if/src/index.ts', true, true, true, false, true],
    ["match", "Match/Case/Default control-flow", 'match/src/index.ts', true, true, true, false, true],
    ["router", "Router module", 'router/src/index.ts', true, true, true, false, true],
    ["i18n", "Translation module", 'i18n/src/index.ts', true, true, true, false, true],
    ["prefetch", "SSR data prefetch", 'prefetch/src/index.ts', true, true, true, false, true],
    ["meta", "SSR `meta` tag manager", 'meta/src/index.ts', true, true, true, false, true],
    ["hmr", "Utilities module", 'hmr/src/index.ts', false, false, true, false, true],
    ["sw", "Utilities module", 'sw/src/index.ts', false, false, true, false, true],
    ["ui", "UI components", 'ui/src/index.ts', true, true, true, true, true],

    ["idb", "IndexedDB module", 'idb/src/index.ts', true, true, true, true, false],
    ["markdown", "Markdown to HTML module", 'markdown/src/index.ts', true, true, true, true, false],
    ["fluent", "One line object descriptor", 'fluent/src/index.ts', true, true, true, true, false],
    ["utils", "Utilities module", 'utils/src/index.ts', true, true, true, true, false],
    ["opfs", "OPFS module", 'opfs/src/index.ts', true, true, true, true, false]
]

export const packages: Package[] = packageSequences.map(([name, description, entry, mapped, listed, link, standalone, includedCore]) => ({
    name,
    description,
    entry,
    mapped,
    listed,
    link,
    standalone,
    includedCore
}))