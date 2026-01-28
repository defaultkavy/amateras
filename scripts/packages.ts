type Package = {
    name: string;
    description: string;
    codeInsert?: string;
    
}

export const packages: Package[] = [
    {
        name: "core",
        description: "核心模块",
    }, {
        name: "widget",
        description: "组件模块",
    }, {
        name: "signal",
        description: "响应式数据模块",
    }, {
        name: "css",
        description: "样式模块",
    }, {
        name: "for",
        description: "控制流 For 模块",
    }, {
        name: "if",
        description: "控制流 If 模块",
    }, {
        name: "match",
        description: "控制流 Match 模块",
    }, {
        name: "router",
        description: "页面路由器模块",
    }, {
        name: "i18n",
        description: "多语言界面模块",
    }, {
        name: "idb",
        description: "IndexedDB 模块",
    }, {
        name: "markdown",
        description: "Markdown 转换 HTML 模块",
        codeInsert: 'import { Markdown } from "amateras/markdown"; new Markdown();'
    }, {
        name: "prefetch",
        description: "SSR 数据预取"
    }, {
        name: "meta",
        description: "SSR 页面 `meta` 标签管理"
    }, {
        name: "ui",
        description: "UI 组件模块"
    }, {
        name: "utils",
        description: "通用工具库",
        codeInsert: 'import * as utils from "amateras/utils";'
    }
]