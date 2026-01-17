# Amateras Widget
Widget 是组件化需要的重要模块，能够帮助开发者便利地编写组件代码。每个组件能够保存自己的数据仓库（Store），并且能将数据传达到指定的子组件中。

## 使用方式
使用组件函数 `$.widget` 定义组件原型构造器（Widget Constructor）。
```ts
import 'amateras';
import 'amateras/widget';

// 定义组件构造器
const App = $.widget((props: {name: string}) => ({
    // 组建的模板函数
    layout() {
        $('h1', () => `Hello ${props.name}!`)
    }
}))

// 创建组件
const $app = $(App, {name: 'Amateras'});

// 构建并渲染组件
$.render($app, () => document.body);

// 输出：<h1>Hello Amateras!</h1>
```

## 文档
1. [组件基础](/docs/Widget.md)
2. [组件数据仓库](/docs/Widget.md)