type Package = {
    name: string;
    description: string;
    codeInsert?: string;
}

export const packages: Package[] = [
    {
        name: "amateras/core",
        description: "核心模块",
    }, {
        name: "amateras/widget",
        description: "组件模块",
    }, {
        name: "amateras/signal",
        description: "响应式数据模块",
    }, {
        name: "amateras/css",
        description: "样式模块",
    }, {
        name: "amateras/for",
        description: "控制流 For 模块",
    }, {
        name: "amateras/if",
        description: "控制流 If 模块",
    }, {
        name: "amateras/match",
        description: "控制流 Match 模块",
    }, {
        name: "amateras/router",
        description: "页面路由器模块",
    }, {
        name: "amateras/i18n",
        description: "多语言界面模块",
    }, {
        name: "amateras/idb",
        description: "IndexedDB 模块",
    }, {
        name: "amateras/markdown",
        description: "Markdown 转换 HTML 模块",
        codeInsert: 'import { Markdown } from "amateras/markdown"; new Markdown();'
    }, {
        name: "amateras/prefetch",
        description: "SSR 数据预取"
    }, {
        name: "amateras/meta",
        description: "SSR 页面 `meta` 标签管理"
    }
]