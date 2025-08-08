# amateras/idb

## Usage
```ts
import 'amateras';
import 'amateras/idb';

// configure indexedDB
const idb = await $.idb('MyDB', 1)
// add store
.store('userStore', store => store
    .keyPath('id')
    .autoIncrement(true)
    // define store object type
    .schema<{
        id: number,
        name: string,
        age: number
    }>()
    .index('by_age', { keyPath: 'age' })
)
// open idb
.open();

// open `readwrite` transaction with `userStore`
const result = await idb.store('userStore', true, async store => {
    store.put({name: 'Amateras', age: 16});
    return store.getAll();
})

console.log(result); // [ { name: 'Amateras', age: 16, id: 1 } ]
```

## Quick Examples

### Get object from store
```ts
await idb.store('userStore', store => store.get(1))
```

### Get all object from store
```ts
await idb.store('userStore', store => store.getAll())
```

### Add object to store
Any changes to database without `readwrite` mode is resisted, pass `true` value to `writable` argument to enable `readwrite` mode.
``` ts
await idb.store('userStore', true, store => store.add({name: 'Tsukimi', age: 16}))
```

### Put object to store
The `.put()` method is different with `.add()` method, put object will replace the object of existed key.
``` ts
await idb.store('userStore', true, store => store.put({name: 'Amateras', age: 17}))
```

### Use index
```ts
await idb.store('userStore', true, store => store.index('by_age').getAll(16))
```

### Operating multiple stores in one transaction
```ts
await idb.transaction(['userStore', 'itemStore'], true, async transaction => {
    transaction.store('itemStore').put({id: 2, name: 'Item 2'})
    return {
        users: await transaction.store('userStore').getAll(),
        items: await transaction.store('itemStore').getAll()
    }
})
```

### Open cursor for advance operations
```ts
await idb.store('userStore', true, async store => {
    const teenagers = []
    await store.cursor(cursor => {
        if (cursor.value.age < 18) teenagers.push(cursor.value);
        cursor.continue();
    })
    return teenagers;
})
```

## Upgrade Database
Using `.upgrade()` in `$IDBStoreBuilder` can set the store upgrade handle function to list. The store upgrade function is used for change object structure when the store is upgrading. 

For example, in version 10:
```ts
{
    id: number,
    name: string
}
```

After version 11, we want to change the object structure:
```ts
{
    id: string,
    name: string,
    intro: string
}
```

You see the `id` is change to `string` type, and come with the new property `intro`. In the following example, we will upgrade this object structure, and this upgrade is only executed when client IDB version is lower than argument `version`.

```ts
store.upgrade(11, (objects) => {
    return objects.map({key, value} => {
        // since we didn't defined the object type in every different version,
        // the object is any type, please handle the upgrade carefully
        return { key,
            value: {
                ...value,
                id: value.id.toString(), // convert to string
                intro: `Hi, my name is ${object.name}` // add new intro property
            }
        }
    })
})
```

The upgrade function is set, this will be executed on `$IDBBuilder.open()`.

> [!NOTE]
> You should leave all the upgrade function in your codebase, unless you are sure the client database version is larger than this upgrade function.