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
import 'amateras/signal';
import 'amateras/widget';

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
| core | 7.45 kB | 2.91 kB | Core module |
| widget | 0.14 kB | 0.06 kB | Component module |
| signal | 2.50 kB | 0.97 kB | Reactive data module |
| store | 0.50 kB | 0.19 kB | Access data between widgets |
| css | 1.63 kB | 0.73 kB | CSS-in-JS module |
| for | 1.20 kB | 0.39 kB | For loop control-flow |
| if | 3.86 kB | 1.38 kB | If/Else/ElseIf control-flow |
| match | 1.44 kB | 0.44 kB | Match/Case/Default control-flow |
| router | 6.02 kB | 2.24 kB | Router module |
| i18n | 3.12 kB | 1.04 kB | Translation module |
| idb | 5.26 kB | 2.00 kB | IndexedDB module |
| markdown | 7.48 kB | 2.93 kB | Markdown to HTML module |
| prefetch | 0.45 kB | 0.22 kB | SSR data prefetch |
| meta | 0.18 kB | 0.09 kB | SSR `meta` tag manager |
| ui | 18.70 kB | 5.19 kB | UI components |
| utils | 0.00 kB | 0.00 kB | Utilities module |