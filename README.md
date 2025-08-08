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

## DOM Operating
```ts
import 'amateras';

const count$ = $.signal(0);

$(document.body).content([
    $('button')
        .content('Click me')
        .class('class1', 'class2')
        .on('click', () => count$(oldValue => oldValue + 1)),
    $('p').content($`Clicked ${count$} times.`)
])
```

## State Management
```ts
import 'amateras';

const count$ = $.signal(0);
const doubleCount$ = $.compute(() => count() * 2);

setInterval(() => count$(oldValue => oldValue + 1), 1000);

$(document.body).content([
    $('p').content($`Count: ${count$}`),
    $('p').content($`Double: ${doubleCount$}`)
])
```

## HTMLElement Methods Import
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
| amateras | 5.67 kB | 2.52 kB | Core |
| amateras/html | 0.99 kB | 0.26 kB | Import HTMLElement types and methods |
| [amateras/css](./ext/css/README.md) | 3.65 kB | 1.41 kB | Style in JS |
| [amateras/router](./ext/router/README.md) | 3.79 kB | 1.71 kB | Amateras Router |
| [amateras/i18n](./ext/i18n/README.md) | 1.48 kB | 0.58 kB | I18n translations |
| [amateras/idb](./ext/idb/README.md) | 5.35 kB | 2.03 kB | IndexedDB Builder and API Wrapper |
| amateras/markdown | 1.89 kB | 0.67 kB | Markdown Converter |