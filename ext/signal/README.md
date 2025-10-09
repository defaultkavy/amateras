# amateras/signal

## Usage

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

## Read and Write

```ts
const number$ = $.signal(0);
const string$ = $.singal('');
const boolean$ = $.signal(false);
const object$ = $.signal({ number: 1 });

// write value
number$.set(42);
string$.set('New Content');
boolean$.set(true);
object$.set({ number: 42 });

// read value
number$(); // 42
string$(); // 'New Content'
boolean$(); // true
object$(); // { number: 42 }
```

## Use in attribute methods

```ts
const src$ = $.signal('/image-1.png');

$(document.body).content([
    // you can set signal variable in attribute
    $('img').src( src$ ),

    $('button').content('Change Image').on('click', () => src$.set('/image-2.png'))
])
```

## Reactive object

```ts
const user$ = $.signal({
    name: 'Amateras',
    age: 16,
    avatar: {
        url: '/amateras/avatar.png',
        size: '350x350'
    }
})

$(document.body).content([
    // Display name and age
    $('h1').content( $`${user$.name$} (${user$.age$})` ),
    // Display avatar image
    $('img').src( user$.avatar$.url$ ),
    // Change the user$ when button is clicked
    $('button')
    .content('Change User')
    .on('click', () => user$.set({
        name: 'Tsukimi',
        age: 10,
        avatar: {
            url: '/tsukimi/avatar.png',
            size: '350x350'
        }
    }))
])
```