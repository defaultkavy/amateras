# Amateras
Amateras is a DOM Utility library.

## Build DOM tree in JS
```ts
import 'amateras';

$(document.body).content([
    $('h1').attr({ class: 'title' }).content('Hello, World')
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
    $('span').css({ color: 'blue', fontWeight: 700 }).content('DOM Utility Library.')
])
```

## DOM Operating
```ts
import 'amateras';

const count$ = $.signal(0);

$(document.body).content([
    $('button').content('Click me')
        .class('class1', 'class2')
        .on('click', () => count$(oldValue => oldValue + 1)),
    $('p').content($`Clicked ${count$} times.`)
])
```

## State Management
```ts
import 'amateras'

const count$ = $.signal(0);
const doubleCount$ = $.compute(() => count() * 2);

setInterval(() => count$(oldValue => oldValue + 1), 1000);

$(document.body).content([
    $('p').content($`Count: ${count$}`),
    $('p').content($`Double: ${doubleCount$}`)
])
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