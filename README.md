# Amateras
Amateras 是一个构建用户界面的 JavaScript 库，目标是无需编译器也能直接编写和运行，让开发者只需用 JavaScript 或 TypeScript 的语法就能高效地构建用户界面。支持响应式数据、模板函数和组件化。

[English](/docs/README_en.md)

## 优势
- **极简开发**：无需 JSX，无需编译器。
- **原生性能**：没有 Diff 开销，没有 VDOM，细粒度响应式框架。
- **类型安全**：强类型安全的编写环境（通过 TypeScript 编译）。
- **两端运行**：能够在客户端和服务端运行。
- **轻量体积**：极小的包体积，所有功能模块化，按需导入模块库。

## 功能
- 组件化模块（Widget）
- 支持控制流（If、Match、For）
- 页面路由器（Router）
- 响应式数据（Signal）
- 热模块更新（HMR）
- 多语言切换（I18n）
- 样式表直写（CSS-in-JS）
- 服务端渲染（SSR）

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

const Counter = $.widget(() => ({
    layout() {
        const count$ = $.signal(0);
        const double$ = $.compute(() => count$() * 2);

        console.log('This template only run once.');

        $('button', $$ => { $(double$)
            $$.on('click', () => count$.set(val => val + 1));
        })
    }
}))

$.render($(Counter), () => document.body);
```

## 为什么是 Amateras？
我喜欢纯粹的开发环境，而对我来说目前主流的前端框架都过于复杂。它们依赖复杂的工具链，使用类似 JSX 这种非原生的文件格式，编写的是脱离 JavaScript 语法的代码。这并没有什么不好，但我更喜欢纯粹的 JavaScript，所有的逻辑都能从代码表面推导出来。为此，我一次又一次地研发这样的库，而经历多次重构的结果就是 Amateras。

### 不是 JSX
Amateras 能让你编写接近 HTML 排版的模板代码，实现了在原生 JavaScript 语法下也能写出高可读性的 UI 代码。配合 TypeScript 的类型检查，能大幅减少新手编写时的疑惑。

### 高性能
我们都不知道用户究竟用的是什么样的设备使用我们的应用，因此一个足够高性能的构建工具必不可少。Amateras 只会将模板构建一次，任何的更新都只会改动必要的元素。

### 模块化与拓展性
这是一个贯彻模块化风格的 JavaScript 库，除了核心功能（amateras/core）之外的所有功能几乎都能分割成不同的模块库。例如 `If` 和 `Signal` 都能够按项目需求来导入，就连组件功能 `Widget` 也被模块化。模块化风格让 Amateras 拥有极强的拓展性，只要理解 Amateras 的运作原理就能写出一个配合 Amateras 类型系统的自定义模块。

### 小体积
得益于模块化风格，开发者能按照自己的需求导入模块，这使得项目依赖工具可以进一步缩小代码体积。

| 模块库 | 体积 | Gzip | 简介 |
| --- | --- | --- | --- |
| amateras/core | 4.97 kB | 2.13 kB | 核心模块 |
| amateras/widget | 0.36 kB | 0.17 kB | 组件模块 |
| amateras/signal | 1.41 kB | 0.56 kB | 响应式数据模块 |
| amateras/css | 1.55 kB | 0.71 kB | 样式模块 |
| amateras/for | 1.03 kB | 0.34 kB | 控制流 For 模块 |
| amateras/if | 1.75 kB | 0.62 kB | 控制流 If 模块 |
| amateras/match | 1.29 kB | 0.40 kB | 控制流 Match 模块 |
| amateras/router | 5.76 kB | 2.16 kB | 页面路由器模块 |
| amateras/i18n | 1.99 kB | 0.75 kB | 多语言界面模块 |
| amateras/idb | 5.27 kB | 2.01 kB | IndexedDB 模块 |
| amateras/markdown | 7.47 kB | 2.93 kB | Markdown 转换 HTML 模块 |
| amateras/prefetch | 0.56 kB | 0.26 kB | SSR 数据预取 |
| amateras/meta | 0.07 kB | 0.04 kB | SSR 页面 `meta` 标签管理 |
| amateras/ui | 2.83 kB | 1.13 kB | UI 组件模块 |

## 文档
1. [基础入门](/docs/Basic.md)
2. [理解原型树](/docs/ProtoTree.md)
3. [组件](/docs/Widget.md)
4. [组件数据仓库](/docs/WidgetStore.md)
5. [控制流](/docs/ControlFlow.md)
6. [路由器](/docs/Router.md)