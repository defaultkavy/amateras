# Amateras
Amateras is a DOM Utility library.

## Build DOM Tree in JS
```ts
import 'amateras';

$(document.body).content([
    $('h1').class('title').content('Hello, World')
])
```

## Style in JS
```ts
import 'amateras';
import 'amateras/css';

const paragraphStyle = $.css({
    border: '2px solid black',
    padding: '0.4rem',
    textAlign: 'center'
})

$('p').css(paragraphStyle).content([
    'Amateras is a ', 
    $('span')
        .css({ color: 'blue', fontWeight: 700 })
        .content('DOM Utility Library.')
])
```

## State Management
```ts
import 'amateras';
import 'amateras/signal';

// define a signal with value 0
const count$ = $.signal(0);

// this variable will be auto recalculate when count$ changes
const doubleCount$ = $.compute(() => count$() * 2);

// the console message will fired when count$ changes
$.effect(() => console.log( count$() ))

$(document.body).content([
    // Display Counts
    $('p').content( $`Counts: ${count$}` ),

    // Display Double Counts
    $('p').content( $`Double Counts: ${doubleCount$}` ),

    // Create a button that make counts plus 1 on click
    $('button').content('Add Count').on('click', () => count$.set(value => value + 1))
])
```

## HTMLElement Native Methods Import
```ts
import 'amateras';
import 'amateras/html';

// without html package
$('a').attr({ href: '/user' });
$('img').attr({ src: '/profile.jpg' });
// with html package
$('a').href('/user');
$('img').src('/profile.jpg');
```

## Custom Components
```ts
import 'amateras';
import 'amateras/html';

function NameCard(name: string, avatarURL: string) {
    return $('div')
    .css({ 
        borderRadius: '1rem', 
        background: '#1e1e1e', 
        display: 'flex', 
        overflow: 'hidden'
    })
    .content([
        $('img').src(avatarURL),
        $('div').css({ padding: '1rem' }).content([
            $('h2').css({ color: '#e1e1e1' }).content(name)
        ])
    ])
}

$(document.body).content([
    $(NameCard, 'The dancing man', 'https://media.tenor.com/x8v1oNUOmg4AAAAM/rickroll-roll.gif')
])
```

## Packages
The packages size result using Vite 7.0 with default bundle settings, polyfills code included.
| Package name | Size | Size(gzip) | Description |
| --- | --- | --- | --- |
| amateras | 4.79 kB | 2.20 kB | Core |
| amateras/html | 0.98 kB | 0.26 kB | Import HTMLElement types and methods |
| [amateras/signal](./ext/signal/README.md) | 1.26 kB | 0.49 kB | Reactive data |
| [amateras/css](./ext/css/README.md) | 3.70 kB | 1.44 kB | Style in JS |
| [amateras/router](./ext/router/README.md) | 3.70 kB | 1.64 kB | Amateras Router |
| [amateras/i18n](./ext/i18n/README.md) | 3.02 kB | 1.13 kB | I18n translations |
| [amateras/idb](./ext/idb/README.md) | 5.39 kB | 2.06 kB | IndexedDB Builder and API Wrapper |
| [amateras/markdown](./ext/markdown/README.md) | 6.81 kB | 2.68 kB | Markdown Converter |