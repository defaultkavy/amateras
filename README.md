# Amateras
Amateras 是一个构建用户界面的 JavaScript 库，目标是无需编译器也能直接编写和运行，让开发者只需用 JavaScript 或 TypeScript 的语法就能高效地构建用户界面。支持响应式数据、模板和组件系统。

## 优势
- 没有编译器。
- 没有 Diff 开销的模板系统。
- 强类型安全的编写环境（通过 TypeScript 编译）。
- 能够在客户端和伺服器端运行。
- 极小的包体积，所有功能模块化，按需导入模块库。

## 功能
- 组件化模块（Widget）
- 支持控制流（If、Match、For）
- 页面路由器（Router）
- 响应式数据（Signal）
- 热模块更新（HMR）
- 多语言切换（I18n）
- CSS-in-JS

## 安装库
```
bun add amateras
```

## 使用方式
```ts
import 'amateras';

const App = $('app', () => {
    $('h1', {class: 'title'}, () => $`Hello World!`)
})

$.render(App, () => document.body);
```

## 计数组件范例
```ts
import 'amateras';
import 'amateras/signal';
import 'amateras/widget';

const Counter = $.widget(() => [
    function () {
        const count$ = $.signal(0);
        const double$ = $.compute(() => count$() * 2);

        console.log('This template only run once.');

        $('button', $$ => { $(double$)
            $$.on('click', () => count$.set(val => val + 1));
        })
    }
])

$.render($(Counter), () => document.body);
```

## 为什么是 Amateras？
我喜欢纯粹的开发环境，而对我来说目前主流的前端框架都过于复杂。它们依赖复杂的工具链，使用类似 JSX 这种非原生的文件格式，编写的是脱离 JavaScript 语法的代码。这并没有什么不好，但我更喜欢纯粹的 JavaScript，所有的逻辑都能从代码表面推导出来。为此，我一次又一次地研发这样的库，而经历多次重构的结果就是 Amateras。

### 不是 JSX
Amateras 能让你编写接近 HTML 排版的模板代码，虽然初次看上去会有些凌乱，但如果能按照规范去编写模板，它其实具有相当的可读性。配合 TypeScript 的类型检查，能大幅减少新手编写时的疑惑。

### 高性能
我们都不知道用户究竟用的是什么样的设备使用我们的应用，因此一个足够高性能的构建工具必不可少。Amateras 只会将模板构建一次，任何的更新都只会改动必要的元素。

### 模块化与拓展性
这是一个贯彻模块化风格的 JavaScript 库，除了核心功能（amateras/core）之外的所有功能几乎都能分割成不同的模块库。例如 `If` 和 `Signal` 都能够按项目需求来导入，就连组件功能 `Widget` 也被模块化。模块化风格让 Amateras 拥有极强的拓展性，只要理解 Amateras 的运作原理就能写出一个配合 Amateras 类型系统的自定义模块。

### 小体积
得益于模块化风格，开发者能按照自己的需求导入模块，这使得项目依赖工具可以进一步缩小代码体积。


| 库 | 体积 | Gzip | 注释 |
| --- | --- | --- | --- |
| amateras/core | 3.85 kB | 1.72 kB | 核心模块 |
| amateras/signal | 0 | 0 | 响应式数据 |
| amateras/if | 0 | 0 | 控制流 If 模块，根据条件通过与否动态变更组件内容 |
| amateras/match | 0 | 0 | 控制流 Match 模块，根据条件匹配动态变更组件内容 |
| amateras/for | 0 | 0 | 控制流 For 模块，根据数组内容动态变更组件内容 |
| [amateras/widget](./packages/widget/README.md) | 0 | 0 | 大型组件模块，能让组件数据在组件之间沟通 |
| [amateras/css](./packages/css/README.md) | 1.32 kB | 0.61 kB | 样式模块，在模板中直接编写样式，并与组件进行绑定 |
| [amateras/router](./packages/router/README.md) | 3.74 kB | 1.69 kB | 页面路由器模块，针对路径进行模板内容的替换 |
| [amateras/i18n](./packages/i18n/README.md) | 1.49 kB | 0.57 kB | 多语言界面模块 |