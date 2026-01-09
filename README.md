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

| 模块库 | 体积 | Gzip | 简介 |
| --- | --- | --- | --- |
| amateras/core | 3.82 kB | 1.71 kB | 核心模块 |
| amateras/widget | 0.37 kB | 0.18 kB | 组件模块 |
| amateras/signal | 1.42 kB | 0.55 kB | 响应式数据模块 |
| amateras/css | 1.29 kB | 0.60 kB | 样式模块 |
| amateras/for | 0.98 kB | 0.32 kB | 控制流 For 模块 |
| amateras/if | 1.60 kB | 0.56 kB | 控制流 If 模块 |
| amateras/match | 1.00 kB | 0.33 kB | 控制流 Match 模块 |
| amateras/router | 4.10 kB | 1.64 kB | 页面路由器模块 |
| amateras/i18n | 1.88 kB | 0.73 kB | 多语言界面模块 |
| amateras/idb | 5.26 kB | 2.01 kB | IndexedDB 模块 |
| amateras/markdown | 0.00 kB | 0.00 kB | Markdown 转换 HTML 模块 |

## 文档
1. [基础入门](/docs/Basic.md)
2. [理解原型树](/docs/ProtoTree.md)
3. [组件](/docs/Widget.md)
4. [组件数据仓库](/docs/WidgetStore.md)