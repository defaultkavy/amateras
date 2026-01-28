# Amateras
Amateras 是一个构建用户界面的 JavaScript 库，目标是无需编译器也能直接编写和运行，让开发者只需用 JavaScript 或 TypeScript 的语法就能高效地构建用户界面。

## 优势
- **极简开发**：无需 JSX，无需编译器。
- **原生性能**：没有 Diff 开销，没有 VDOM，细粒度响应式框架。
- **类型安全**：提供 TypeScript 类型安全的编写体验。
- **两端运行**：能够在客户端和服务端运行。
- **轻量体积**：极小的包体积，所有功能模块化，按需导入项目。

## 功能
- 组件化模块（Widget）
- 支持控制流（If、Match、For）
- 页面路由器（Router）
- 响应式数据（Signal）
- 热模块更新（HMR）
- 多语言切换（I18n）
- 样式表直写（CSS-in-JS）
- 服务端渲染（SSR）

## 如何使用
Amateras 提供了两种导入库的方式
### 使用导入映射（Import Map）
这个代码将会为你的网页自动创建一个导入映射脚本，将这段代码安插在你的项目代码之前即可。
```html
<script src="https://unpkg.com/amateras"></script>
```

### 安装代码库
```
bun add amateras
```

## 基础范例
```ts
import 'amateras';

const $h1 = $('h1', {class: 'title'}, () => $`Hello World!`)

$.render($h1, () => document.body);
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
| core | 4.97 kB | 2.13 kB | 核心模块 |
| widget | 5.33 kB | 2.31 kB | 组件模块 |
| signal | 6.38 kB | 2.69 kB | 响应式数据模块 |
| css | 6.52 kB | 2.85 kB | 样式模块 |
| for | 6.00 kB | 2.47 kB | 控制流 For 模块 |
| if | 7.64 kB | 3.11 kB | 控制流 If 模块 |
| match | 6.26 kB | 2.53 kB | 控制流 Match 模块 |
| router | 10.73 kB | 4.29 kB | 页面路由器模块 |
| i18n | 6.97 kB | 2.88 kB | 多语言界面模块 |
| idb | 10.24 kB | 4.14 kB | IndexedDB 模块 |
| markdown | 12.44 kB | 5.06 kB | Markdown 转换 HTML 模块 |
| prefetch | 5.53 kB | 2.40 kB | SSR 数据预取 |
| meta | 5.05 kB | 2.17 kB | SSR 页面 `meta` 标签管理 |
| ui | 7.80 kB | 3.26 kB | UI 组件模块 |

## 文档
1. [基础入门](/docs/Basic.md)
2. [理解原型树](/docs/ProtoTree.md)
3. [组件](/docs/Widget.md)
4. [组件数据仓库](/docs/WidgetStore.md)
5. [控制流](/docs/ControlFlow.md)
6. [路由器](/docs/Router.md)