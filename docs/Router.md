# 路由器（Router）
路由器负责将 URL 路径正确导向至目标页面，是实现单页应用（SPA）以及服务端渲染（SSR）的基础模块之一。

## 概念

### 路由器函数 `$.router`
路由器函数帮助开发者便利的创建一个路由器原型构造器，并且透过函数能够定义不同路径多对应的页面。

### 路由器原型构造器（Router Constructor）
路由器函数会返回一个路由器原型构造器，每个构造器都拥有独一无二的路由蓝图，将这个构造器传入创建函数 `$` 就能创建路由器了。

## 基础使用方式
我们来构建一个简单的网页路由器，这个路由器拥有两个路径：`/` 和 `/about`。
```ts
import 'amateras';
import 'amateras/router';

const Router = $.router($$ => {
    $$.route('/', () => {
        $('h1', () => $`Home Page`)
    })

    $$.route('/about', () => {
        $('h1', () => $`About Page`)
    })
})

$.render($(Router), () => document.body);
```

## 定义路径参数
使用路径参数能便利地获取路径中的片段，并且能保证参数类型安全。
```ts
$.router($$ => {
    $$.route('/greating/:name', ({params}) => {
        $('h1', () => $`Hello, ${params.name}!`)
    })

    $$.route('/user/@:username/post/:postId', ({params}) => {
        $('p', () => $`Username: ${params.username}`)
        $('p', () => $`Post ID: ${params.postId}`)
    })
})
```

## 使用组件页面
我们可以定义一个页面组件，并将它传入到指定的路径当中。
```ts
const UserPage = $.widget((props: {username: string}) => ({
    $('h1', () => $`${props.username}'s Profile`)
}))

$.router($$ => {
    $$.route('/@:username', UserPage)
    $$.route('/user', UserPage) // TS 报错：组件要求 username 路径参数作为属性参数
})
```

## 页面代码分割
透过 `import()` 语法，代码构建工具（Bundler）可以对页面代码进行分割，从而实现按需加载代码以提升单页加载速度。
```ts
// HomePage.ts
export default $.widget(() => {
    $('h1', () => $`Home Page`)
})

// UserPage.ts
export default $.widget((props: {username: string}) => {
    $('h1', () => $`${props.username}'s Profile`)
})

// index.ts
$.router($$ => {
    $$.route('/', [() => import('./HomePage')])
    $$.route('/@:username', [() => import('./UserPage')])
})
```

> [!IMPORTANT]
> 页面代码分割有两点需要注意：
> 1. 使用动态导入代码文件的话，该文件必须 `export default` 为目标页面组件。
> 2. 动态导入函数必须用数组 `[]` 包裹。

## 子路由嵌套
Amateras Router 支持多层路由嵌套，可以让多个页面使用的相同组件无需再次构建。
```ts
$.router($$ => {
    $$.route('/@:username', UserPage, $$ => {
        $$.route('/', UserPostsPage)
        $$.route('/videos', UserVideosPage)
        $$.route('/images', UserImagesPage, $$ => {
            $$.route('/:albumId', UserAlbumPage)
        })
    })
})
```

## 路径别名
我们可以为一个页面定义多个路径名字，这些别名（Alias）将会共享同一个页面原型（Page Proto），避免重复构建。
```ts
$.router($$ => {
    $$.route('/@:username', UserPage, $$ => {
        $$.alias('/profile', { username: CLIENT_USERNAME })
        $$.route('/', UserPostsPage, $$ => {
            $$.alias('/posts')
        })
    })
})
```
以上路由器可以实现的路径：

- /@amateras: `UserPage { username: "amateras" }`
- /profile: `UserPage { username: CLIENT_USERNAME }`
- /@amateras/posts: `UserPostsPage { username: "amateras" }`
- /profile/posts: `UserPostsPage { username: CLIENT_USERNAME }`

## 路径分组
我们可以设定一个路径节点作为组别，并在这个节点之后做子路径规划。
```ts
$.router($$ => {
    $$.group('/settings', $$ => {
        $$.route('/', SettingsPage)
        $$.route('/account', AccountSettingsPage)
    })
})
```