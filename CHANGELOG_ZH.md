# Changelog

## [0.16.0] - 2026-06-15

### Features
- **CSS Fluent 提供预设模板**: 透过导入 `amateras/css/fluents`，你可以直接使用已经设定好基本样式组合的 CSS Fluent。
  ```ts
  import { box, flex, grid, font, flexItem, media, hover, container } from 'amateras/css/fluents'

  box.block.mx(2).my(4).$
  flex.column.gap(4).item_center.$
  font.muted.sm.bold.$
  media.sm([ grid.cols('1fr', 3).$ ])
  container('page (width < 800px)', [ box.absolute.$ ])
  hover([ font.destructiveFg.$ ])
  ```
- **CSS Fluent 支持以组名或属性名分类**：在 CSS Fluent 配置中，使用 `.group` 能以自定义键名对选项进行分组，该分组的选项若已被使用，代码提示就不会再出现同一组别下的其它选项。使用 `.prop` 则是以属性名进行分组。
- **CSS Fluent 支持函数输入**: 你可以在 CSS Fluent 中使用函数来自定义 CSS 属性的值。
  ```ts
  const flex = $.css.fluent(f => f
    .init({ display: 'flex' })
    .prop('gap', {
      gap: (val: string) => val
    })
  )

  flex.gap('1rem').$;
  ```
- **预设 CSS 变量**：`amateras/css/variables` 提供了一系列预设变量，你可以直接导入它们并配合 `amateras/ui` 来获取最基本的 CSS 样式。当然，你可以不导入它们，自行使用同样的变量名来设定自定义变量。
- **CSS Color ESModule Namespace**: CSS Color 全面支持 ESModule Namespace 模式，透过导入 `amateras/css/static-colors` 就能以 `Colors.zinc.c100` 的方式使用模板颜色。透过打包器打包后，仅会将被使用的颜色代码打包进生产环境代码中。
- **Signal Compute 支持手动输入依赖**：在 `$.compute` 的第二个参数输入 Signal 数组，该 Compute 函数就会绑定数组中的所有 Signal 作为依赖。
- **自动检测触控装置**：`amateras/css` 模块会自动添加一个 `pointerdown` 和 `pointermove` 监听器，当检测到触控时会自动在 `html` 元素中添加一个 `touch` 属性。这能够让 CSS 样式能更准确地为触控装置设置特殊样式（如：hover）。
- **ContextMenu 触控装置友好设计**：检测到当下正在使用触控方式操作时，ContextMenu 会以触控友好的方式从下方弹出。
- **Router 支持全路径字符**：使用 `/*` 就能在当前路径组别下接受所有字段的路径，由于路径解析是按配置顺序进行解析的，因此在 `/*` 解析之前若有其它匹配的路径则会自动跳过。你可以使用这个全路径字符来实现 not found 页面。
- **NavLink Match Pathname Exactly**：当 NavLink 设置 `exact` 属性时，路径必须完全匹配才会激活该 NavLink 组件。
- **I18n 支持词库分割**：在配置词库时，使用 `import()` 导入子词库就能完成词库分割，只有在被调用时才会加载该词库。
  ```ts
  export default {
    title: 'Hello, World!',
    home: () => import('./home/en.ts')
  } as const
  ```
- **I18n 支持获取指定语言的文本**: 在使用 `i18n.t` 或 `i18n.text` 时，在最后一个参数输入语言名称就能略过全局设定，直接获取该语言的文本内容。
- **I18n 导入 Signal**：I18n 模块导入了 Signal 模块，现在可以使用 `I18nSession.locale$` 来监测语言的变化。
- **New RouterEvent**：新增 `scrollrestoration` DOM 事件，该事件是一个 RouterEvent，透过该事件能获取 `RouterEvent.Router`.
- **New ProtoProcess**：全新异步构建处理器 API，使用更安全的方式让 Proto 上下文不再轻易丢失。这个方案解决了诸如 `$.meta` `$.title` 这类非常依赖 Proto 上下文的函数，非常推荐将所有需要异步构建的过程套用到这个方案中。
  ```ts
  $('div', $$ => {
    $.process($$ => $$
      .await(async () => { ... })
      .exec(async () => { ... })
      .await(async () => { ... })
    )
  })
  ```
- **ContextMenu 支持弹出位置设置**：在 `ContextMenu.open` 函数配置中，透过 `position` 就能够设置弹出方向。
- **SSR 中间件处理器**：现在可以透过 `$.middleware.ssr` 控制 SSR 输出结果。
- **New ElementProto API**: 透过 `ElementProto.off` 移除 DOM 事件监听器。
- **New Utility Functions**: `merge`, `match`, `tuple`, `camelToDashedStyle`
- **New UI Components**: `Container`, `Carousel`, `Progress`, `CardFooter`

### Changes
- Remove padding of ComboboxChipRemoveButton.
- 打开 ContentMenu 时，如果超过显示范围，context menu 会自动调整位置。
- 使用 `size` 属性调整 `Icon` 的大小，不再需要使用 css 调整 `height` 和 `width`。
- 通过 `ElementProto.css` 或者在 `Props.css` 属性中输入的复数个 `CSSMap`，将会被整合成一个 `CSSRule`，这能更好的让多个 `CSSMap` 之间实现覆盖规则。
- HMR 对非 Widget 组件的文件改动会直接刷新网页。
- 移除 `select-value` DOM 事件。
- ContextMenu 弹出时，禁用所有 ContextMenu 区域以外的操作，包括页面滚动。
- 在尚未创建 Node 之前，`ElementProto.style` 将会解析输入内容并转换成元素属性文本，这让元素自定义样式也能在 SSR 阶段实现。
- `$.context` 不再需要输入 `Proto`，并且此函数会返回 callback 函数所返回的值。
- 原本的中间件处理器 `$.process` 重命名为 `$.middleware`。
- Badge 只有在被设定 `hover` 属性时，hover 样式才会生效。
- 所有经过 `Element.attr` 处理的值都会被转换成 string。
- `Router.url` 和 `Router.prev` 变更为 static member。
- 针对 input 类型的组件样式进行了优化。
- FieldLabel 改为 `display: flex`。
- `GlobalState.router.href` 重命名为 `GlobalState.router.url`。
- Waterfall 组件会自动检测图片大小变化并更新布局。

### Fixes
- 修复 If 组件无法解析 `undefined` 类型的问题。
- 修复部分 UI 组件使用了部分浏览器尚未支持的 `attr()` 功能。
- 修复 Textarea 将预设样式应用到全局 `textarea` 元素的问题。
- 修复 TabContent 组件即使尚未选择显示也会被构建的问题。
- 修复 I18nSession 内存泄漏的问题。
- 修复点击 ContextMenuItem 后，因为关闭 ContextMenu 让组件被释放而导致所有事件被取消的问题。
- 修复 `$.fetch` 设定数据缓存使用的 URL origin 可能和原始请求的 origin 不相同的问题。

## [0.15.1] - 2026-05-26

### Fixes
- Fix `float` compute on `Searchbar`, `Combobox` and `Select` components.

## [0.15.0] - 2026-05-26

### Features
- **HMR Supported**: Now you can make changes to widget code without refresh whole page, import `viteHMR` vite plugin from `amateras/hmr` and set in `vite.config.ts` (make sure you run vite dev server with `bun --bun vite`).
- **CSS Fluent**: Write CSS property in one line.
  ```ts
  import 'amateras/css/fluent';
  // setup flex css fluent
  const flex = $.css.fluent({ display: 'flex' })
      .group('flexDirection', {
          row: 'row',
          column: 'column'
      })
      .group('gap', {
          gap_sm: '0.8rem',
          gap: '1rem',
          gap_lg: '1.2rem'
      })
      .proxy()
  // use this in css property
  $('div', { css: flex.row.gap_lg.$ }, $$ => {
      ...
  })
  ```
- **Virtual Scoll**: Render over thousand elements without DOM freeze, this feature only work properly in layout compute component (like `Waterfall`).
- **New Element API**: Use `Element.hasAttr` to check attribute name is exist.
- **New Proto API**: 
  - `Proto.visibleChildren` return the children with `visible = true`.
  - `Proto.replace` method replace child proto with target.
  - `Proto.dispose` method now support cascadding option argument.
- **Support Map in Control-flow component `For`**: Now you can set `SignalTypes<Map>` as iterator of `For` component.
- **Combobox UI Component Updates**: 
  - You can drag and drop `ComboboxChip` to rearrange order of values.
  - Set `ComboboxChip` component manually in layout.
- **Waterfall UI Component Updates**:
  - New proto event `waterfall_resize`, you can manually dispatch this event to make `Waterfall` resize compute.
- **New `Searchbar` UI Component**: Create searchbar with styled and autocomplete features.
- **New `TextArea` UI Component**: Styled `textarea` element.
- **New `Toast` UI Component**: Create styled toast component.
- **Float at Opposite When No Spaces**: The options list will flip to opposite when there is no spaces to show content, this feature is applied to `Select`, `Searchbar` and `Combobox` components.
- **New UI CSS Layer**: All UI component style rule is under `@layer ui`, so developers can easily override this with custom style rule.
- **New `FieldError` UI Componenet**: A styled component to show error message in `Field`.
- **New `TextBlock` UI Component**: This component show text like `pre` element but using inherit font family and font size.
- **New Utils Module Namespace**: Use `Utils` instead of import every single utility functions without worry about the bundle size.

### Changes
- Remove `NodeProto.ondom`, use `NodeProto.listen('dom')` instead.
- Remove `NodeProto.ondispose`, use `NodeProto.listen('dispose')` instead.
- Improve `debounce`, `isEqual`, `map` utility function.
- Remove `label` props from `ComboboxItem` and `ComboboxChip`.
- Remove proto event `combobox_input` arguments.
- Component `Waterfall` set style in different way in SSR, since there is no style compute on server side, this make the result of SSR looks better.
- `Waterfall` compute item size with `offsetHeight`, this is still under experiment and may changes in future.
- Improve `$.fetch` cache data with different HTTP method.
- `ElementProto.attrProcess` is now static method.
- Remove `$.call` from `$` namespace and move it to `Utils.call`.
- Remove margin in `DescriptionList` and `Switch` components.

### Fixes
- Fix `Utils.trycatch` always be async process.
- Fix event map registration error that cause memory leak (`dispose` event didn't registered).
- Fix obiviously flickering when render DOM and replace the SSR content.

## [0.14.1] - 2026-05-13

### Features
- New proto event `mutate`, emit on control-flow content changes.
- New `Proto.__protos__` type member to declare `Proto.protos` getter return type.
- New `Proto.virtual` member used to improve `Proto.toDOM` performance, only process children DOM changes when `Proto.virtual` is true.

### Changes
- The `Proto.protos` getter return an `Array<Proto>` instead of `Set<Proto>` now for improve DX and get better performance.
- Private method `DOMProcess` move to `NodeProto` now.
- Improve `$.Overload` type check with constructor using `Symbol` type.

### Fixes
- Fix `Select` component not focus the selected item when opened.
- Fix DOM render process didn't remove node when `Proto.visible` is false.
- Fix `Combobox` component active the `ComboboxCreateItem` option when input is only space character.
- 

## [0.14.0] - 2026-05-07

### Features
- **New UI Component**: `Combobox`, `Toggle`, `Switch`, `Input`, `ContextMenu`, `Field`
- **New Utility Function**: `isEqual`, `$.tuple`
- **Handle Async Task in SSR Process**: Use `$.async` method to handle multiple async task, every SSR request will waiting to response until all task queue is cleared.
- **Nested Object Signal**: Now nested signal is supported.
- **Customize Page Switch Behaviour**: New `pageswitch` proto event, block default behaviour and handle it is possible now.
- **Auto Reload Updated Sources**: Now page will be automatic reloaded if source file is re-bundled.
- **Mutiple Conditions of `If`**: Use array to pass mutiple conditions signal, the statement will be rendered when all conditions is passed.
- **Assign Event Listener in Attribute Map**: You can assign `onclick` in element's attribute instead of using `Proto.on` method.
- **Visible Proto Rendering**: New `Proto.visible` property, set to `false` and run `toDOM()` method from parent will automatic remove this proto's node from DOM tree, but it still is child of the parent proto.
- **Auto Set Cookie on Every `$.fetch` in SSR**: The first request from client that render page content will be store to every `GlobalState` of session, every request to the same origin in this session by `$.fetch`, will share the same cookie from the first client request.
- **Send Request to `Bun.Server` in SSR**: The request to server from the same process is possible now, set `$.fetch.server = Bun.serve({ ... })` to enable this feature.

### Changes
- New `$.Overload` interface provide more accurate function `$` overload recognition based on parameters.
- Improve component CSS: `Card`, `CardHeader`, `SelectContent`, `Badge`, `Button`
- New proto event `selectvalue` on `Select` component.
- New proto event `builded` and `dispose` on `Proto`.
- Deprecate `Proto.ondispose`, use instead `Proto.listen` on `dispose` event.
- Deprecate `Proto.ondom`, use instead `Proto.listen` on `dom` event.
- Method `$CSSVariable.declare` accept `$.CSSValue` type argument.
- New `$CSSProperty.declare` method.
- New `Proto.remove` method to remove proto from parent.
- Improve type `$.CSSPropertyMap`.
- New property of `$CSSDeclarationMap`: `container`
- Improve `Proto.dispatch` method overload.
- Remove function `$.dispose`.
- Rename `RouterProto` to `Router`.
- Now `I18nTranslation` class not extends from `ProxyProto`, but it still render as a `ProxyProto`.
- New `clear` arguments of `Proto.build`.
- Remove signal auto set value from input element content feature.
- Now `Signal` object will be render as `ProxyProto` to handle more complex value.
- Remove `TextBlock` component from `amateras/ui`.
- Now `Select` component focus first option when opened even value is unset.

### Fixes
- Fix `Select` component didn't display selected value correctly.
- Fix `GlobalState` assign properties in prototype not working correctly.
- Fix `Route.alias` method not return `Route` instance.
- Fix `Proto.processProtos` method not process proto sibling correctly.
- Fix `For` render item order not correctly.
- Fix the I18n directory fetch process didn't awaited in SSR process.
- Fix children of ConditionStatement cannot get store from parent.
- Fix scroll restoration not found element id error.
- Fix vite bundler will bundle all `amateras/ui` components code to production code.

## [0.13.3] - 2026-04-04
- Fix member signal didn't emited subscribers when parent signal updated.

## [0.13.2] - 2026-04-03

### Fixes
- Fix text display no correctly when using signal in `$` function.

## [0.13.1] - 2026-04-03

### Features
- **New Utility Types**: New `OptionalStrings` type.
- **New CSS Property Value Types**: `placeContent` `placeItems` `placeSelf`
- **New CSS Property Types**: `textBox` `textBoxTrim` `textBoxEdge`

### Fixes
- Fix reading linked signal value cause maximum call stacks.
- Remove border from last child of `DescriptionList`
- The parameter type of layout function should be self on `NavLink` and `Link`.
- The default style of `svg` fit the `icon` size.

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