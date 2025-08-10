# amateras/router

## Usage
```ts
import 'amateras';
import 'amateras/router';
```

## Create Route Map
```ts
// create home page route
const HomePage = $.route(page => page
    .pageTitle('Home | My Site') // set window title
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

> [!NOTE]
> Don't forget to `.listen()` the path change!

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

## Async Route
```ts
// ./page/home_page.ts
export default $.route(page => {
    return page
    .content([
        $('h1').content('Home Page')
    ])
})

// ./router.ts
$('router')
.route('/about', () => import('./page/home_page'))
```

## Path Parameter
TypeScript will parse the parameter in the path, parameter always start with `:`, after the colon comes the name of the parameter. You can access theses parameter using `Page.params`.

```ts
$('router')
.route('/user/@:username', page => {
    console.log(page.params.username);
    return page;
})
.listen()
// simulate page open
.resolve('/user/@amateras') // 'amateras'
```

If you want separate router and route builder to different file, use generic parameter to define parameter name on `$.route` method. 

```ts
// greating_page.ts
export default $.route<['name']>(page => {
    return page
    .content(`Hello, ${name}`)
})

// router.ts
$('router')
.route('/greating', () => import('./greating_page'))
// ^ typescript wiil report an error, the route builder required 'name' parameter

.route('/greating/:name', () => import('./greating_page'))
// ^ pass
```

### Optional Parameter
Sometime we parameter can be optional, you can define the optional parameter by add `?` sign after the name of the parameter.

```ts
const userPage = $.route<'photoId', 'postId?'>(page => {
    return page
    .content([
        `Photo ID: ${page.params.photoId}`, // photoId: string
        `Post ID: ${page.params.postId}` // postId: string | undefined 
    ])
})

$('router')
.route('/photos/:photoId', userPage)
// ^ pass
.route('/posts/:postId/photos/:photoId', userPage)
// ^ pass
```

## Nesting Route
`Router` element is the container of `Page` element, we can archieve nesting route by create `Router` and append it inside `Page`.
```ts
const ContactPage = $.route(page => page
    .pageTitle('Home')
    .content([
        $('h1').content('Contact'),
        $('router', page) 
        // here is the magic happened,
        // pass the Page into router arguments
    ])
)
```

Then, we need to declare the router map like this: 

```ts
$('router')
.route('/', HomePage)
.route('/contact', ContactPage, route => route
    // we can define more child routes inside this '/contact' route!
    .route('/', () => 'My name is Amateras.')
    .route('/phone', () => '0123456789')
)
```

### Alias Path

Sometime, the page doesn't have just one path. We can declare the alias paths to one route!

```ts
$('router')
.route('/', HomePage, route => route
    .alias('/home')
    .alias('/the/another/way/to/home')
    // ... more alias path
)
```

What if the main path included parameters? Here is how to deal with it:

```ts
$('router')
.route('/users/:username', UserPage, route = route
    .alias('/u/:username')
    .alias('/profile')
    // ^ typescript will report an error

    .alias('/profile', { username: 'amateras' })
    // ^ pass, the params required is fulfilled

    .alias('/profile', () => { return { username: getUsername() } })
    // ^ even you can pass an arrow function!
)
```

### Group Path

There have a lot of paths got same prefix? We provide the solution:

```ts
$('router')
.route('/', HomePage)
.group('/search', route => route
    .route('/', SearchPage)
    .route('/users', SearchUserPage)
)
```