# Amateras
Amateras is a JavaScript library for building user interface. Its goal is to allow writing and running code directly without a compiler, enabling developers to build user interfaces efficiently using only JavaScript or TypeScript syntax.

## Advantages
- **Minimalist Development**: No JSX, no compiler, zero setup.
- **Fast Performance**：No diffing overhead, a fine-grained reactive framework.
- **Type Safety**：Provides a TypeScript type-safe coding experience.
- **Execute Everywhere**：Capable of running on both the client and server sides。
- **Lightweight Size**：Extremely small bundle size with high modularity design, only import the code that you need.

## Features
- Component-based modules (widget)
- Control flow support (if, match, for)
- SPA Router (router)
- Reactive data (signal)
- Internationalization (i18n)
- CSS-in-JS (css)
- Server-Side Rendering ([tsukimi](https://github.com/defaultkavy/tsukimi))

## How to Use
- **Install via Package Manager**
   ```sh
   bun add amateras
   ```
- **Quick Setup via Command**
  ```sh
  bunx amateras init
  ```
- **Using Import Map**
   
   This script will create a import map in your page, insert this line before your project code.
   ```html
   <script src="https://unpkg.com/amateras"></script>
   ```

## Hello World Example
```ts
import 'amateras';

const $h1 = $('h1', {class: 'title'}, () => $`Hello, World!`)

$.render($h1, 'body');
```

## Counter Widget Example
```ts
import 'amateras';
import '@amateras/signal';
import '@amateras/widget';

const Counter = $.widget(() => {
    const count$ = $.signal(0);
    const double$ = $.compute(() => count$() * 2);

    console.log('This template only run once.');

    $('button', $$ => { 
        $([ double$ ])
        $$.on('click', () => count$.set(val => val + 1));
    })
})

$.render(Counter, 'body');
```

| Modules | Size | Gziped | Module Type | Description |
| --- | --- | --- | --- | --- |
| core | 9.03 kB | 3.59 kB | The Core | Core module |
| widget | 0.50 kB | ~0.16 kB | Extension Module | Component module |
| signal | 3.17 kB | ~1.15 kB | Extension Module | Reactive data module |
| store | 0.50 kB | ~0.19 kB | Extension Module | Access data between widgets |
| css | 2.66 kB | ~1.21 kB | Extension Module | CSS-in-JS module |
| for | 1.31 kB | ~0.43 kB | Extension Module | For loop control-flow |
| if | 4.50 kB | ~1.56 kB | Extension Module | If/Else/ElseIf control-flow |
| match | 1.54 kB | ~0.46 kB | Extension Module | Match/Case/Default control-flow |
| router | 7.32 kB | ~2.66 kB | Extension Module | Router module |
| i18n | 4.43 kB | ~1.57 kB | Extension Module | Translation module |
| prefetch | 1.72 kB | ~0.70 kB | Extension Module | SSR data prefetch |
| meta | 0.67 kB | ~0.31 kB | Extension Module | SSR `meta` tag manager |
| ui | 58.15 kB | ~12.97 kB | Extension Module | UI components |
| idb | 6.64 kB | 2.76 kB | Standalone Tool | IndexedDB module |
| markdown | 8.88 kB | 3.72 kB | Standalone Tool | Markdown to HTML module |
| fluent | 2.30 kB | 1.06 kB | Standalone Tool | One line object descriptor |
| utils | 3.72 kB | 1.91 kB | Standalone Tool | Utilities module |
| opfs | 3.15 kB | 1.31 kB | Standalone Tool | OPFS module |