# amateras/signal

## Import
```ts
import 'amateras';
import 'amateras/signal';
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

## Set as Attribute Value
```ts
const src$ = $.signal('/image-1.png');

$('div', $$ => {
    // you can set signal variable in attribute
    $('img', { src: src$ }),

    $('button', $$ => {
        $$.on('click', () => src$.set('/image-2.png'))
        $`Change Image`
    })
})
```

## Signal Object
```ts
const user$ = $.signal({
    name: 'Amateras',
    age: 16,
    avatar: {
        url: '/amateras/avatar.png',
        size: '350x350'
    }
})

user$.name$() // "Amateras"
user$.age$() // 16
user$.avatar$.url() // "/amateras/avatar.png"
```

## Compute and Effect
```ts
const count$ = $.signal(0);
const double$ = $.compute(() => count$() + 1);

$.effect(() => {
    console.log(`Count is ${count$()}`)
})

$('button', $$ => {
    $$.on('click', () => count$.set(value => value + 1))
    $`You have clicked this button in half of ${double$} times.`
})
```