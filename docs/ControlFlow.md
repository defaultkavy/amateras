# 控制流（Control Flow）
Amateras 通过代理原型（Proxy Proto）实现了原型控制流，开发者可以使用控制流实现根据数据变化来显示或隐藏元素。

## 相关模块
- `amateras/signal`
- `amateras/for`
- `amateras/if`
- `amateras/match`

## For 控制流
这是个能够随着数组类型的 Signal 数据变化而改变原型内容的强大控制流原型，使用它能够非常轻松地进行高性能内容渲染。
```ts
import 'amateras';
import 'amateras/signal';
import 'amateras/for';

const $App = $('app', () => {
    const list$ = $.signal([
        { name: 'elexis' }
        { name: 'tsukimi' }, 
        { name: 'amateras' }, 
    ])

    $('ul', () => {
        $(For, list$, item => {
            $('li', () => $([ item.name ]))
        })
    })

    $('button', $$ => { $`Add`
        list$.modify(list => list.push({ name: 'amateras' }))
    })
})

$.render($App, document.body);
```

我们将 `For` 原型构造器输入到创建函数中，接着我们将 `list$` 这个数组类型的 Signal 作为第二个参数，最后再传入 For 模板函数来定义每个数据渲染出来的结果。

透过对 Signal 数据的改动，我们就能动态的改变渲染结果。For 控制流下的原型都会与输入的数据进行绑定，因此 `list$` 数组中已经渲染过的数据将不再重复渲染。

### 使用 For 控制流的注意事项
- `For` 原型构造器只接受 Signal 数据类型。
- Signal 数据必须是数组或是 `Set` 类型。
- 数组内只能包含对象类型，不能使用原始数据类型作为输入。

> [!WARNING]
> 这些类型都不被允许：`[42, 'foo', true, null, undefined]`，因为 For 控制流在进行渲染时需要确认数组内的数据是唯一的对象。

> [!TIP]
> 在改变 `list$` 数组类型的 Signal 时，我们不会使用 `list$.set([...])` 的方式来改变数据，因为这样会直接覆盖原本的数组对象。Amateras Signal 提供了 `list$.modify()` 函数让开发者能够修改数组的内容。
>
> 如果你使用 `list$.value.push()` 的方法改变数组内容，虽然数据确实被改变了，但这并不会触发 Signal 的数据变化事件，也就不会触发控制流的渲染函数。

## If 控制流
能够根据条件来判断是否构建并显示原型内容，通过 `If`、`ElseIf` 和 `Else` 能够实现按顺序进行多个条件判断。

```ts
import 'amateras';
import 'amateras/signal';
import 'amateras/if';

const $App = $('app', () => {
    const visible$ = $.signal(false);
    const zero$ = $.signal(0);
    const buttonText$ = $.compute(() => visible$() ? 'Hide' : 'Show');

    $('button', $$ => { $(buttonText$)
        $$.on('click', () => visible$.set(bool => !bool))
    })

    $(If, visible$, () => {
        $('img', { src: ''})
    })
    $(ElseIf, zero$, () => {
        $('p', () => $`This content never display.`)
    })
    $(Else, () => {
        $('p', () => $`Content Hidden`)
    })
})

$.render($App, document.body);
```

配合多个 ElseIf，我们可以实现复数个条件判断，并且只要其中一个 Signal 数据被改变，都会重新触发整个 If 控制流的判断机制。未通过条件的判断式原型不会被构建，而已经被构建一次的判断式原型不会重新构建，仅仅只是切换显示的元素。

### 使用 If 控制流的注意事项
- 条件输入必须是 Signal 数据类型。
- 判断机制和 JS 原生判断式机制相同，Falsy 值将会被判定为否，反之亦然。
- `ElseIf` 必须在 `If` 之后，而 `Else` 必须在最后一个。
- `If`、`ElseIf` 和 `Else` 之间不可参入其它原型。

> [!TIP]
> 如果你想要判断的条件是 Signal 数据对象的属性（比如 Array.length），使用 `$.compute` 函数能够迅速创建一个监控目标的 Signal 数据，并且将结果导向目标对象的属性。
> ```ts
> const arr$ = $.signal([1, 2, 3])
> 
> $(If, $.compute(() => arr$().length, () => {}))
> ```
> 需要注意的是，这并非是直接监控对象的属性，而是对象本身透过 Signal 方法发生改变后，再次触发了这个 Compute 函数，而函数的结果返回的是目标对象的属性。如果仅仅是对象的属性被改变，而不是透过 Signal 的方法，那么这个 Compute 函数并不会被触发。

## Match 控制流
Match 控制流原型也是由多个判断式原型组成，而它和 If 控制流的差异，是它的多个判断式都以一个 Signal 数据为参考。
```ts
import 'amateras';
import 'amateras/signal';
import 'amateras/match';

const $App = $('app', () => {
    const mode$ = $.signal<1 | 2 | 3>(1);

    $('select', $$ => {
        $$.on('input', e => {
            mode$.set(+e.currentTarget.value as 1 | 2 | 3)
        })
        $('option', {value: 1}, () => $`1`)
        $('option', {value: 2}, () => $`2`)
        $('option', {value: 3}, () => $`3`)
        $('option', {value: 100}, () => $`100`)
    })

    $(Match, mode$, $$ => {
        $$(Case, 1, () => {
            $('p', () => $`This is mode 1.`)
        })
        $$(Case, [2, 3], () => {
            $('p', () => $`You switch to mode 2 or 3.`)
        })
        $$(Default, () => {
            $('p', () => $`Unknown value`)
        })
    })
})

$.render($App, document.body)
```

### 使用 Match 控制流的注意事项
- 参考值必须为 Signal 数据类型。
- Case 原型构造器可以使用数组达到多个判断条件共用一个判断式原型。
- 如果你的判断对象是数组，可以用 `[ targetArray ]` 的方式传入。
- Match 原型模板函数中仅能包含 Case 和 Default 判断式原型。

> [!TIP]
> 仔细观察代码例子中，Match 原型的模板函数有个 `$$` 参数，这个函数仅能用来创建 Case 和 Default 原型。你也能够用创建函数 `$` 来做到一样的事情，但是透过 `$$` 函数能够实现条件类型保护，让 Case 原型的条件值能确保符合参考值的类型，因此这是更加推荐的写法。