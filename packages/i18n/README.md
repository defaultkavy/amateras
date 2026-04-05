# amateras/i18n

## Import
```ts
import 'amateras';
import 'amateras/i18n';
```

## Usage
```ts
const i18n = $.i18n('en')
.add('en', {
    homepage: {
        _: 'Home',
        hello: 'Hello, $name$!',
    }
})

$('div', $$ => {
    $('h1', $$ => $([ i18n.t('homepage') ]))
    $('p', $$ => $([ i18n.t('homepage.hello', { name: 'Amateras' }) ]))
})
```

## Change Language
```ts
i18n.locale('zh');
```

## Import Dictionary Context
```ts
// ./i18n/en.ts
export default {
    hello: 'Hello, $name$!'
}

// ./i18n/zh.ts
export default {
    hello: '您好，$name$！'
}

// ./entry_file.ts
const $t = $.i18n()
.add('en', () => import('./i18n/en.ts'))
.add('zh', () => import('./i18n/zh.ts'))
```

## Translation Directory Shortcut
```ts
const i18n = $.i18n('en')
.add('en', {
    page1: {
        section2: {
            button3: {
                text: 'Deep Button Text'
            }
        }
    }
})

const i18n_button = i18n.dir('page1.section2.button3');

i18n.t('page1.section2.button3.text') // Deep Button Text
i18n_button.t('text') // Deep Button Text
```