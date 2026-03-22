# Changelog

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