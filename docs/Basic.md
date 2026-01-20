# 基础入门
本文章将会解释最基础的 Amateras 使用方法，只涉及 `amateras/core` 核心库的范畴。

## 创建函数（Craft Function）`$`
`$` 函数是 Amateras 项目调用次数最繁琐的功能，它的作用非常简单：**创建原型并将其添加到上一级原型中**。根据不同的参数输入类型，它能创建不同种类的原型并将其返回。

想要使用 `$`，首先我们需要在入口文件导入核心库：

```ts
// index.ts

import 'amateras';
// 相当于 import 'amateras/core';
```

只需在入口文件导入一次，`$` 就会被注册在全局环境中，透过入口文件引用的其它文件里都不需要再次导入了。

接下来我们来看看 Amateras 的两个最基本创建原型的方式。

### 创建文本原型
在 `$` 函数后面直接输入**模板字符串**（Template String），就能够为字符串创建文本原型。
```ts
$`Hello`
$`My age is ${age}.`
$`${num}`
```

如果你只是想要将一个变量转换成文本，使用模板字符串略显繁琐，这时候你也可以用**数组**的方式传入。下面的代码产生的结果和上面是一样的：
```ts
$(['Hello'])
$(['My age is', age])
$([num])
```

### 创建元素原型
在 `$` 函数的第一个参数输入**字符串**，就可以创建元素原型了。你也能够为其添加属性和模板函数。
```ts
$('div')
$('span', {style: 'color: red'}, () => $`A red color text.`)
$('h1', () => $`This is a title`)
$('input', {type: 'checkbox', checked: ''})
```

## 模板函数（Template Function）
在 Amateras 的定义中，模板函数是运行后能够定义原型内容的函数。当构建原型时，如果该原型拥有模板函数，便会在构建的过程中执行它。在模板函数中运行的创建函数 `$`，将会把该原型视作父原型，将创建好的原型添加到父原型的子原型列表中。

```ts
const 模板函数 = () => {
    $`This is a title`
}

$('h1', {}, 模板函数)
```

## 相关文档
1. [理解原型树](/docs/ProtoTree.md)
2. [组件](/docs/Widget.md)
3. [控制流](/docs/ControlFlow.md)
4. [路由器](/docs/Router.md)