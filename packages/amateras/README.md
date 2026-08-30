# Amateras
Amateras is a JavaScript library for building user interface. Its gold is to allow writing and running code directly without a compiler, enabling developers to build user interfaces efficiently using only JavaScript or TypeScript syntax.

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
Amateras provides two ways to import the library.

1. **Using Import Map**
   
   This script will create a import map in your page, insert this line before your project code.
   ```html
   <script src="https://unpkg.com/amateras"></script>
   ```

2. **Install via Package Manager**
   ```sh
   bun add amateras
   ```

## Example
```ts
import 'amateras';

const $h1 = $('h1', {class: 'title'}, () => $`Hello World!`)

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

| Modules | Size | Gziped | Description |
| --- | --- | --- | --- |
| core | 9.03 kB | 3.59 kB | Core module |
| widget | 0.56 kB | 0.19 kB | Component module |
| signal | 3.47 kB | 1.21 kB | Reactive data module |
| store | 0.54 kB | 0.20 kB | Access data between widgets |
| css | 3.24 kB | 1.27 kB | CSS-in-JS module |
| for | 1.54 kB | 0.46 kB | For loop control-flow |
| if | 5.06 kB | 1.66 kB | If/Else/ElseIf control-flow |
| match | 1.77 kB | 0.50 kB | Match/Case/Default control-flow |
| router | 7.70 kB | 2.74 kB | Router module |
| i18n | 4.80 kB | 1.63 kB | Translation module |
| idb | 5.69 kB | 2.08 kB | IndexedDB module |
| markdown | 8.04 kB | 3.02 kB | Markdown to HTML module |
| prefetch | 1.90 kB | 0.74 kB | SSR data prefetch |
| meta | 1.01 kB | 0.38 kB | SSR `meta` tag manager |
| ui | 0.00 kB | 0.00 kB | UI components |
| fluent | 0.00 kB | 0.00 kB | One line object descriptor |
| utils | 0.00 kB | 0.00 kB | Utilities module |