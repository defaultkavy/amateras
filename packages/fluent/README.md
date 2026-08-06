# @amateras/fluent
Amateras Fluent is a oneline object descriptor builder.

## Install
```sh
bun add @amateras/fluent
```

## Basic
```ts
const css = new Fluent()
    .prop('fontSize', {
        sm: '0.825rem',
        md: '1rem',
        lg: '1.25rem'
    })
    .prop('color', {
        red: '#ff0000',
        green: '#00ff00',
        blue: '#0000ff'
    })
    .proxy();

css.sm.red.$ // => { fontSize: '0.825rem', color: '#ff0000' }
```

## Convert Result
```ts
const message = new Fluent()
    .prop('person', {
        me: 'I am',
        you: 'You are',
        he: 'He is',
        she: 'She is'
    })
    .prop('action', {
        run: 'running',
        sit: 'sitting',
        stand: 'standing'
    })
    .prop('on', {
        ontable: 'on the table',
        onfloor: 'on the floor',
        onsofa: 'on the sofa'
    })
    .executor('text', (result) => {
        return `${result.person ?? 'No one is'} ${result.action ?? 'doing something'} ${result.on ?? 'on something'}.`
    })
    .proxy();

message.he.sit.onsofa.text // => He is sitting on the sofa.
message.run.text // => No one is running on something.
message.onsofa.run.text // => No one is running on sofa.
```