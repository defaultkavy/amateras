# Amateras Store
Create data and access it with Proto binded lifecycle.

## Usage
```ts
import 'amateras';
import 'amateras/widget';
import 'amateras/store';

const AppStore = $.store((user: User) => ({
    client: user
}))

const App = $.widget(() => {
    const user: User = {
        id: 42,
        name: 'Amateras'
    }
    // where store created is binding lifecycle with
    const store = AppStore.create(user);
    console.log(store.client.id) // 42

    $(Greating)
})

const Greating = $.widget(() => {
    // get store from ancestor proto
    const store = AppStore.get();
    $('h1', () => $`Welcome, ${store.client.name}!`)
})
```