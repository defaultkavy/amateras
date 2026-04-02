# Changelog

## [0.13.0] - 2026-04-02

### Features
- **Signal Improvement**: Create signal with object type value will create `SignalObject`, you can access properties of object by adding `$` after property name (e.g, data$.name$). Each properties are `Signal` and only created when the value is accessed.
  ```ts
  const user$ = $.signal({
    name: 'Amateras',
    age: '16'
  })
  console.log(user$.name$()) // 'Amateras'
  ```
- **Store**: Create store and binding it with proto lifecycle is really easy and so convenient!
  ```ts
  const GlobalStore = $.store(() => ({
    userList: []
  }))

  const App = $.widget(($app) => {
    // create store and bind lifecycle with this widget proto
    const store = GlobalStore.create();

    $(UserListWidget)

    $('button', $$ => {
      $$.on('click', () => {
        $app.dispose() // force dispose the App widget
        // store will be clean on memory
      })
    })
  })

  const UserListWidget = $.widget(() => {
    // get store that created by ancestor proto
    const store = GlobalStore.get();
    for (const user of store.userList) {
      $(...)
    }
  })

  $.render(App, 'body')
  ```
- **New UI Components**: Select, Icon, Button, Badge, Card, DescriptionList
- **Global State Async Task**: Use `GlobalState.asyncTask` method to create promise queue, this method will automatic delete promise from queue when promise finally done.
- **Lifecycle of Proto and Signal**: Larger codebase comes with complexier memory handler, so I am trying to design the lifecycle of proto. Now you will see `Proto.dispose` and new `Signal.dispose` is really works on server/client side, specially in SSR process. I have improved memory leak situation on these modules: core, signal, for, match.
- **Builded Proto**: New `Proto.builded` property to ensure the proto is already builded.
- **Craft**: New `$.craft` function is similar to `$` function, but it never build and append to proto, even in layout function.
- **Proto Text Content**: Now you can use `Proto.text` to get all display text inside this proto.
- **Element Proto Properties Handle Method**: Override `ElementProto.props` method make process custom properties more easier, and this make handle `Signal` type value automatic update value works pretty well.
- **Signal Value Resolver**: `$.resovle` is a helper for handle `OrSignal` type, it's useful when writing custom attribute method, make signal auto update workflow more clearer.
- **Prefetch Return Data**: `$.fetch` return `record` and `result` data in object.
- **Proto Event Listener**: This is a Proto base event listener by using `Proto.listen` and `Proto.dispatch`, this help the communicate between protos. You can add custom event name and provided parameters of listener by declare `ProtoEventMap` in namespace `$`.
- **CSS Variable Name Configuration**: When you use `$.css.variable` to define CSS variables, you can set options to modify variable name:
  ```ts
  const text = $.css.variable({
    sm: '0.8rem',
    base: '1rem'
  }, {
    unique: false, // no generate random id for these variables
    prefix: 'text-' // set prefix of these variables name
  })
  ```
- **Text Proto Content Modify Affect Text Node**: When you change `TextProto.textContent`, the changes will apply to Text Node.
- **Utils `isEqual`**: New `isEqual` function to check members is equal between two objects.
- **Utils `isSymbol`**: New `isSymbol` function to check value is `symbol` type, instead of `typeof value === 'symbol'`.
- **I18n Events**: New `i18nupdate` proto event, trigger on translation text updated.

### Changes
- New Proto Tree Structure With Memory Used Friendly: In the past, every proto create a `Set` object for record every child proto, turns out the `Set` object is very heavy data in memory. So, I found a way to link these protos: Linked List Data Structure. Each proto have a `sibling` property that point to next proto in the same parent, when getting proto's children, it will iterate each child then return a list. This method will slightly slower than `Set`, but it saved much memory used.
- Refactor Widget Module: `$.widget` is now more convenient to use, no more widget store, ancestor, layout configuration.
  ```ts
  const App = $.widget<{name: string}>(({name}, children) => {
    $('h1', $$ => $`New Version of Widget!`)
  })
  ```
- Render Method Changes: You can pass in un-builded `Proto` type in first argument, and use query selector in second argument.
  ```ts
  $.render(App, 'body')
  ```

### Fixes
- Router scroll restoration will reset scroll position to `0` when cached page opened.
- `Case` and `Default` should not be builded when not match condition.
- Fix `GlobalState` assignment on different types of Proto.
- Import core module on `amateras/index.ts` entry file with file path directly to avoid bun.lock compile error.

## [0.12.0] - 2026-03-23

### Features
- New UI Component: Accordion, TextBlock, Waterfall, Tabs
- I18n Refactor: Support different language in multiple session, this is useful on server-side rendering.
- Object Signal: Pass object into `$.signal` can directly access the object properties' signals, this make signal more convenient in UI/UX by complex data structure!
- Slideshow
  - Autopause: When set slideshow autopause `true`, the slideshow will be pause playback timer on route changes.
  - Event: New `showslide` event dispatched on slide show up.
- Page Title Control: You can set page title with `$.title` even after page switched, and input can be `Promise<string>` now.
- GlobalState Assign: You can use `GlobalState.assign` method to assign properties to `GlobalState.prototype` now.
- Scroll Restoration For Document Element: Now the scroll restoration is auto enabled for document element.
- Style Modification: You can modify element style by using `ElementProto.style` method.
- Event Listener Assign: You can assign event listener by using `ElementProto.on` method, even after `ElementProto.node` is created.
- Control Flow Mutation: You can override `Proto.mutate` method to make changes after control flow proto's content updated.

### Changes
- Remove `global.prefetch.fetches`, use `global.promises`.

### Fixes
- Element Attributes: `ElementProto.attr` should return `null` when attribute is not defined.
- UID: `UID.persistInProto` should return ID string now.
- ES Modules Import Map: Fix package name not found error.
- I18n Translation Options: The translation variables typecheck is stable now.

## [0.11.0] - 2026-01-28

### Features
- ES Modules Import Map: Now you can import Amateras in client side JavaScript directly.

## [0.10.1] - 2026-01-24

### Features
- I18n Translation Promises: Get translation promises array from `Proto.global.i18n`.
- UID: New class `UID` used for generate random unique ID.

### Changes
- Rename `ElementProto.name` to `ElementProto.tagname`.
- Remove getter `Proto.root`.

### Fixes
- Element Attributes: Fixed HTML output when attribute set null.
- Widget Store: Fixed cannot found ancestors store in children widget.

## [0.10.0] - 2026-01-20

### Breaking Changes
> [!WARNING]
> 这个项目已完全重新编写，与之前版本中的架构和概念已完全不同。如果你是 0.7.x 版本之前的使用者，我不推荐你在旧项目中将这个库的版本进行升级，这将会让你的项目需要重新开始编写。并且旧代码将不会再进行维护，请在未来的项目中使用最新版本的 Amateras。
> 
> This project has been completely rewritten, and the architecture and concepts are entirely different from previous versions. If you are using a version prior to 0.7.x, I do not recommend upgrading this library in your old projects, as it will require you to rewrite your project from scratch. Furthermore, the old code will no longer be maintained. Please use the latest version of Amateras for future projects.

### Features
ZH:
- **Proto**：有别于 VDOM 的架构，界面的变化无需重新构建整个 VDOM 树并进行进行 Diffs。所有 Proto 和 Widget 只会构建一次。
- **Signal 细粒度响应式数据**：数据的变化只会对有影响的节点进行变化操作。
- **Widget 组件模块**：不止组件化，让组件之间共享数据变得更轻松。
- **Control Flow 模块**：支持 For/If/Match 控制流，让界面内容显示的操作代码变得更加直观。
- **Router 模块**：让你轻松规划应用路径，自动恢复页面滚动历史，路径别名，路径分组，路径参数，页面代码分割，并且支持类型安全。
- **Server-side Render**：一份代码，同时解决界面设计和 SEO 问题。
- **CSS-in-JS**：高性能 CSS 方案，让模板代码和样式代码更靠近。

EN：
- **Proto**: Unlike the VDOM architecture, UI changes do not require rebuilding the entire VDOM tree and performing Diffs. All Protos and Widgets are built only once.
- **Signal Fine-grained Reactivity**: Data changes only trigger update operations on the specifically affected nodes.
- **Widget Component Module**: More than just componentization, it makes sharing data between components easier.
- **Control Flow Module**: Supports For/If/Match control flows, making the code for displaying interface content more intuitive.
- **Router Module**: Easily plan application paths with support for automatic scroll history restoration, path aliases, path grouping, path parameters, page code splitting, and type safety.
- **Server-side Rendering**: A single codebase to solve both UI design and SEO issues simultaneously.
- **CSS-in-JS**: A high-performance CSS solution that keeps template code and styling code closer together.

[unreleased]: https://github.com/defaultkavy/amateras/compare/v0.10.1...HEAD
[0.10.1]: https://github.com/defaultkavy/amateras/releases/tag/v0.10.1
[0.10.0]: https://github.com/defaultkavy/amateras/releases/tag/v0.10.0