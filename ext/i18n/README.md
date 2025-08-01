# amateras/i18n

## Usage
```ts
import 'amateras';
import 'amateras/i18n';

const $t = $.i18n()
// add 'en' locale dictionary context
.add('en', {
    homepage: {
        _: 'Home',
        hello: 'Hello, $name$!',
    }
})
// set 'en' as locale language
.locale('en')

$(document.body).content([
    $('h1').content( $t('homepage') )
    // <h1><text>Home</text></h1>
    $t('homepage.hello', {name: 'Amateras'}) 
    // <text>Hello, Amateras!</text>
])
```

## Change Language
```ts
$t.locale('zh')
// all translation text will be updated
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
// set 'zh' as locale language
// and fetch file automatically from path
.locale('zh');
```