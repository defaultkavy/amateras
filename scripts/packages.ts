export type Package = {
    name: string;
    description: string;
    codeInsert?: string;
    entry: string;
    mapped: boolean;
    listed: boolean;
}

export const packages: Package[] = [
    {
        name: "core",
        description: "Core module",
        entry: 'core/src/index.ts',
        mapped: true,
        listed: true
    }, {
        name: "widget",
        description: "Component module",
        entry: 'widget/src/index.ts',
        mapped: true,
        listed: true
    }, {
        name: "signal",
        description: "Reactive data module",
        entry: 'signal/src/index.ts',
        mapped: true,
        listed: true
    }, {
        name: 'store',
        description: 'Access data between widgets',
        entry: 'store/src/index.ts',
        mapped: true,
        listed: true
    }, {
        name: "css",
        description: "CSS-in-JS module",
        entry: 'css/src/index.ts',
        mapped: true,
        listed: true
    }, {
        name: "css-variable",
        description: "CSS variable module",
        entry: 'css/src/ext/variable.ts',
        mapped: false,
        listed: false
    }, {
        name: "css-keyframes",
        description: "CSS keyframes module",
        entry: 'css/src/ext/keyframes.ts',
        mapped: false,
        listed: false
    }, {
        name: "css-property",
        description: "CSS property module",
        entry: 'css/src/ext/property.ts',
        mapped: false,
        listed: false
    }, {
        name: "for",
        description: "For loop control-flow",
        entry: 'for/src/index.ts',
        mapped: true,
        listed: true
    }, {
        name: "if",
        description: "If/Else/ElseIf control-flow",
        entry: 'if/src/index.ts',
        mapped: true,
        listed: true
    }, {
        name: "match",
        description: "Match/Case/Default control-flow",
        entry: 'match/src/index.ts',
        mapped: true,
        listed: true
    }, {
        name: "router",
        description: "Router module",
        entry: 'router/src/index.ts',
        mapped: true,
        listed: true
    }, {
        name: "i18n",
        description: "Translation module",
        entry: 'i18n/src/index.ts',
        mapped: true,
        listed: true
    }, {
        name: "idb",
        description: "IndexedDB module",
        entry: 'idb/src/index.ts',
        mapped: true,
        listed: true
    }, {
        name: "markdown",
        description: "Markdown to HTML module",
        codeInsert: 'import { Markdown } from "amateras/markdown"; new Markdown();',
        entry: 'markdown/src/index.ts',
        mapped: true,
        listed: true
    }, {
        name: "prefetch",
        description: "SSR data prefetch",
        entry: 'prefetch/src/index.ts',
        mapped: true,
        listed: true
    }, {
        name: "meta",
        description: "SSR `meta` tag manager",
        entry: 'meta/src/index.ts',
        mapped: true,
        listed: true
    }, {
        name: "ui",
        description: "UI components",
        entry: 'ui/src/index.ts',
        mapped: true,
        listed: true
    }, {
        name: "utils",
        description: "Utilities module",
        codeInsert: 'import * as utils from "amateras/utils";',
        entry: 'utils/src/index.ts',
        mapped: true,
        listed: true
    }
]