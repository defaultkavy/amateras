type Package = {
    name: string;
    description: string;
    codeInsert?: string;
    
}

export const packages: Package[] = [
    {
        name: "core",
        description: "Core module",
    }, {
        name: "widget",
        description: "Component module",
    }, {
        name: "signal",
        description: "Reactive data module",
    }, {
        name: 'store',
        description: 'Access data between widgets'
    }, {
        name: "css",
        description: "CSS-in-JS module",
    }, {
        name: "for",
        description: "For loop control-flow",
    }, {
        name: "if",
        description: "If/Else/ElseIf control-flow",
    }, {
        name: "match",
        description: "Match/Case/Default control-flow",
    }, {
        name: "router",
        description: "Router module",
    }, {
        name: "i18n",
        description: "Translation module",
    }, {
        name: "idb",
        description: "IndexedDB module",
    }, {
        name: "markdown",
        description: "Markdown to HTML module",
        codeInsert: 'import { Markdown } from "amateras/markdown"; new Markdown();'
    }, {
        name: "prefetch",
        description: "SSR data prefetch"
    }, {
        name: "meta",
        description: "SSR `meta` tag manager"
    }, {
        name: "ui",
        description: "UI components"
    }, {
        name: "utils",
        description: "Utilities module",
        codeInsert: 'import * as utils from "amateras/utils";'
    }
]