# 组件（Widget）
Widget 是组件化需要的重要模块，能够帮助开发者便利地编写组件代码。每个组件能够保存自己的数据仓库（Store），并且能将数据传达到指定的子组件中。

## 概念

### 组件函数 `$.widget`
组件函数本质上是一个定义原型构造器的特殊方式，它将会返回一个组件原型构造器。

### 组件原型构造器 `Widget.Constructor`
实际上，每个组件函数返回的构造器都是独一无二的匿名构造器，但是我们可以统称这些构造器为组件构造器。所有组件构造器都是拓展自原型类 `Proto`，也就是原型树最小的单位。

### 组件原型 `Widget`
组件原型和原型一样，不需要真实存在的 DOM。它只作为自己的子原型的一个入口节点，当渲染原型树时会自动跳过这个非 DOM 原型，直接渲染子原型的部分。

## 使用组件的好处
- 组件原型本身并不是一个元素原型（也就没有 DOM 实体），但可以囊括多个元素原型
- 每个组件可以持有自己独立的数据仓库
- 子组件可访问父组件的数据仓库
- 不需要手动编写自己的原型拓展类，组件函数简化了这一步骤


## 基础使用方式
这段代码是平时我们如何使用组件函数 `$.widget` 定义一个新的组件原型构造器：
```ts
import 'amateras';
import 'amateras/widget';

const App = $.widget((props: {name: string}) => [
    function ({children}) {
        $('h1', () => `Hello ${props.name}!`)
        children();
    }
])
const $app = $(App, { name: 'Amateras' }, () => {
    $('p', () => $`Write user interface in JavaScript way.`)
})
$.render(, document.body);

// 输出：<h1>Hello Amateras!</h1><p>Write user interface in JavaScript way.</p>
```

## 函数拆解

上面是一个在实际编写中的例子，但是它不能帮助到新人理解这些参数的意义是什么，因此我们将它们一一拆分成多个变量，写成更通俗易懂的样子：

```ts
const 组件构造器 = $.widget(组件初始化函数)
```

### 组件初始化函数（Widget Init Function）
这是在组件被构建时会调用的初始化函数，用于初始化组件状态以及获取组件模板函数。我们可以在这个函数的参数中定义属性类型，如 `{ name: string, status?: number }`。当我们调用组件的时候，TypeScript 将会对属性输入进行检查，若未满足条件将会得到类型错误。

```ts
const 组件初始化函数 = (组件属性参数: { name: string }) => [ 组件模板函数 ];
```

> [!WARNING]
> 注意组件初始化函数必须返回一个数组：`() => []`，数组内必须包含一个组件模板函数！

### 组件模板函数（Widget Template Function）
和一般模板函数不同，组件模板函数给予的参数是该组件的仓库和外部调用时输入的模板函数。

```ts
const 组件模板函数 = function ({children: 子模版函数}) {
    // ...自定义模板内容

    // 安插外部传递的模版内容
    children();
}
```

### 子模版函数
使用 `$` 创建该组件时能够传递子模板函数，运行该函数就能在组件模板中的任何位置安插外部定义的模板内容。

### 完成
至此，一个简单的组件函数调用方式已经介绍完毕，你可以利用这个方式定义各种自定义组件了！让我们正式创建这个组件并渲染它吧！

```ts
const 组件原型 = $(组件构造器, { name: 'Amateras' }, 子模版函数);

$.render(组件原型, document.body);
```

## 相关文档
1. [组件数据仓库](/docs/WidgetStore.md)
2. [基础入门](/docs/Basic.md)
3. [理解原型树](/docs/ProtoTree.md)