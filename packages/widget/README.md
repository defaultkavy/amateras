# Amateras Widget
Use `$.widget` for writing component templates.

## Usage
```ts
import 'amateras';
import 'amateras/widget';

const App = $.widget((props) => {
    $('h1', () => $`Hello, World!`)
})

$.render(App, 'body');
```