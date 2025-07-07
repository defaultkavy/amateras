# amateras/router

## Usage
```ts
import 'amateras';
import 'amateras/router';
```

## Create Route Map
```ts
// create home page route
const HomePage = $('route', '/', page => page
    .pageTitle('Home')
    .content([
        $('h1').content('Home')
    ])
)
// append router and mapping home page route into router
$(document.body).content([
    $('router')
    .route('/', HomePage)
    .route('/hello', page => 'Hello!')
    .listen() // start to listen path change
])
```

## Router Anchor
Use `RouterAnchor` to prevent load page when open link by default `HTMLAnchorElement` element.
```ts
$('ra').content('Contact').href('/contact');
```

## Common Methods
- `$.open(url)`: Open page without load page.
- `$.replace(url)`: Replace history state with url and open page.
- `$.forward()`: Forward page.
- `$.back()`: Back page.

## Path Parameter and Query
```ts
$('router')
.route('/user/@:username', page => {
    console.log(page.params)
})
.route('/posts?search'), page => {
    console.log(page.query)
}
.listen()
// simulate page open
.resolve('/user/@amateras') // { username: 'amateras' }
.resolve('/posts"') // { }
.resolve('/posts?search=tsukimi&user') // { search: 'tsukimi', user: '' }
```

## Nesting Route
```ts
const ContactPage = $('route', '/contact', page => page
    .pageTitle('Home')
    .content([
        $('h1').content('Contact'),
        // append router with page, nested routes will show in this router
        $('router', page)
    ])
)

const ContactEmailPage = $('route', '/contact/email', () => 'amateras@example.com')

$('router')
.route('/', HomePage)
.route('/contact', ContactPage, route => route
    .route('/', () => 'My name is Amateras.')
    .route('/phone', () => '0123456789')
    .route('/email', ContactEmailPage)
)
```

## Async Route
```ts
$('router')
.route('/about', () => import('./pages/about.ts'))
```