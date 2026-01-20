# Amateras
Amateras is a JavaScript library for building user interfaces. Its goal is to allow direct writing and running without a compiler, enabling developers to efficiently build UIs using only JavaScript or TypeScript syntax. It supports reactive data, templates, and a component system.

> [!NOTE]
> This document is translated by AI.

## Advantages
- **Minimalist Development**: No JSX required, no compiler needed.
- **Native Performance**: No Diff overhead, the abstract tree is built only once.
- **Type Safety**: A strongly type-safe coding environment (compiled via TypeScript).
- **Cross-platform**: Capable of running on both the client and server sides.
- **Lightweight**: Tiny bundle size, with all functions modularized for on-demand imports.

## Features
- Component Modules (Widget)
- Control Flow Support (If, Match, For)
- Page Router (Router)
- Reactive Data (Signal)
- Hot Module Replacement (HMR)
- Internationalization (I18n)
- Direct Styles (CSS-in-JS)

## Installation
```
bun add amateras
```

## Usage
```ts
import 'amateras';

const App = $('app', () => {
    $('h1', {class: 'title'}, () => $`Hello World!`)
})

$.render(App, () => document.body);
```

## Counter Component Example
```ts
import 'amateras';
import 'amateras/signal';
import 'amateras/widget';

const Counter = $.widget(() => [
    function () {
        const count$ = $.signal(0);
        const double$ = $.compute(() => count$() * 2);

        console.log('This template only run once.');

        $('button', $$ => { $(double$)
            $$.on('click', () => count$.set(val => val + 1));
        })
    }
])

$.render($(Counter), () => document.body);
```

## Why Amateras?
I love pure development environments, and to me, mainstream frontend frameworks have become overly complex. They rely on complicated toolchains, use non-native file formats like JSX, and involve writing code that deviates from standard JavaScript syntax. There's nothing inherently wrong with that, but I prefer pure JavaScript where all logic can be inferred directly from the code. For this reason, I have developed such libraries time and again, and the result of multiple refactors is Amateras.

### Not JSX
Amateras allows you to write template code that closely resembles HTML layout. While it might look a bit messy at first glance, it is actually quite readable if written according to conventions. Combined with TypeScript's type checking, it significantly reduces confusion for beginners.

### High Performance
We never know what kind of devices users are using to access our applications, so a high-performance build tool is essential. Amateras builds the template only once; any subsequent updates only modify the necessary elements.

### Modularity and Extensibility
This is a JavaScript library that strictly follows a modular style. Almost all functions, except for the core (amateras/core), can be split into different module libraries. For example, `If` and `Signal` can be imported based on project needs, and even the component functionality `Widget` is modularized. This modular style gives Amateras extreme extensibility; as long as you understand how Amateras works, you can write a custom module that integrates with the Amateras type system.

### Small Size
Thanks to the modular style, developers can import modules according to their needs, allowing project dependency tools to further reduce code size.

| Module Library | Size | Gzip | Description |
| --- | --- | --- | --- |
| amateras/core | 3.78 kB | 1.69 kB | Core Module |
| amateras/widget | 0.36 kB | 0.17 kB | Component Module |
| amateras/signal | 1.42 kB | 0.55 kB | Reactive Data Module |
| amateras/css | 1.32 kB | 0.61 kB | Styling Module |
| amateras/for | 0.97 kB | 0.32 kB | Control Flow For Module |
| amateras/if | 1.60 kB | 0.56 kB | Control Flow If Module |
| amateras/match | 1.00 kB | 0.33 kB | Control Flow Match Module |
| amateras/router | 4.33 kB | 1.71 kB | Page Router Module |
| amateras/i18n | 1.88 kB | 0.73 kB | Internationalization Module |
| amateras/idb | 5.26 kB | 2.01 kB | IndexedDB Module |
| amateras/markdown | 6.66 kB | 2.62 kB | Markdown to HTML Module |

## Documentation
1. [Getting Started](/docs/Basic.md)
2. [Understanding ProtoTree](/docs/ProtoTree.md)
3. [Widgets](/docs/Widget.md)
4. [Widget Store](/docs/WidgetStore.md)