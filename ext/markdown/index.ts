import { _Array_from, forEach } from "amateras/lib/native";

const blockProcesses = new Set<MarkdownBlockProcessOptions>();
const inlineProcesses = new Set<MarkdownProcessFunction>();

export class Markdown {
    blockProcessSet = new Set(blockProcesses);
    inlineProcessSet = new Set(inlineProcesses);
    constructor() {}

    blockProcess(options: MarkdownBlockProcessOptions) {
        this.blockProcessSet.add(options);
        return this;
    }

    inlineProcess(handle: MarkdownProcessFunction) {
        this.inlineProcessSet.add(handle);
        return this;
    }

    toHTML(text: string) {
        const blocks = _Array_from(text.matchAll(/(?:.+?\n?)+/gm));
        return blocks.map(block => {
            let matched, blockText = block[0]
            for (const blockProcess of blockProcesses) {
                matched = blockText.match(blockProcess.regexp);
                if (!matched) continue;
                blockText = blockProcess.handle(blockText);
                const removeHTML = blockText.replaceAll(/<.+>[^<]+?<\/.+>/gm, '');
                if (!removeHTML) break;
            }
            if (!matched) blockText = paragraph(blockText);
            inlineProcesses.forEach(fn => blockText = fn(blockText))
            return blockText;
        }).join('')
    }

    toDOM(text: string) {
        return $('article').innerHTML(this.toHTML(text))
    }
}

export type MarkdownProcessFunction = (text: string) => string;
export interface MarkdownBlockProcessOptions {
    regexp: RegExp,
    handle: (text: string) => string;
}

const blockProcess = (options: MarkdownBlockProcessOptions) => blockProcesses.add(options);
const inlineProcess = (handle: MarkdownProcessFunction) => inlineProcesses.add(handle);
const replaceAll = (str: string, searchValue: string | RegExp, replacer: ((substring: string, ...args: any[]) => string) | string): string => str.replaceAll(searchValue, replacer as any);
const trim = (str: string) => str.trim();
const paragraph = (str: string) => replaceAll(str, /(?:.+?\n?)+/gm, $0 => `<p>${trim($0)}</p>`);
// Headings
blockProcess({
    regexp: /^(#+) (.+)/gm,
    handle: text => replaceAll(text, /^(#+) (.+)/gm, (_, $1: string, $2) => `<h${$1.length}>${$2}</h${$1.length}>`)
});
blockProcess({
    regexp: /^(.+)\n==+$/gm,
    handle: text => replaceAll(text, /^(.+)\n==+$/gm, (_, $1) => `<h1>${$1}</h1>`)
});
blockProcess({
    regexp: /^(.+)\n--+$/gm,
    handle: text => replaceAll(text, /^(.+)\n--+$/gm, (_, $1) => `<h2>${$1}</h2>`)
});
// Blockquote
blockProcess({
    regexp: /(?:^> ?.*(?:\n|$))+/gm,
    handle: text => {
        const fn = (str: string) => {
            const blocks = _Array_from(str.matchAll(/(?:^> ?.*(?:\n|$))+/gm));
            forEach(blocks, block => {
                const blocked = fn(replaceAll(block[0], /^> ?/gm, ''));
                str = str.replace(block[0], `<blockquote>\n${paragraph(blocked)}\n</blockquote>`);
            })
            return str;
        }
        return fn(text);
    }
});
// List
blockProcess({
    regexp: /(?:^(?:\t|(?:  )+)?(?:-|[0-9]+\.) (?:.+\n?))+/gm,
    handle: text => {
        const fn = (str: string) => {
            const blocks = _Array_from(str.matchAll(/(?:^(?:\t|(?:  )+)?(?:-|[0-9]+\.) (?:.+\n?))+/gm));
            forEach(blocks, block => {
                let haveList = false // check this loop have list
                const type = block[0].match(/^(-|[0-9]+\.) /)?.[1] === '-' ? 'ul' : 'ol';
                const listed = replaceAll(block[0], /^(?:-|[0-9]+\.) (.+)/gm, (_, $1: string) => (haveList = true, `<li>\n${trim($1)}\n</li>`));
                const clearTabbed = replaceAll(listed, /^(?:\t|(?:  ))/gm, '');
                const convertedList = fn(clearTabbed);
                str = str.replace(block[0], haveList ? `<${type}>\n${trim(convertedList)}\n</${type}>` : convertedList);
            })
            return str;
        }
        return fn(text);
    }
})
// Codeblock
blockProcess({
    regexp: /^```([^`\n]+)\n([^`]+)?```/gm,
    handle: text => replaceAll(text, /^```([^`\n]+)\n([^`]+)?```/gm, (_, $1, $2: string) => `<pre><code>\n${trim($2)}\n</code></pre>`)
})
// Horizontal Rule
blockProcess({
    regexp: /^(?:---|\*\*\*|___)(\s+)?$/gm,
    handle: text => replaceAll(text, /^(?:---|\*\*\*|___)(\s+)?$/gm, _ => `<hr>`)
})
// Bold
inlineProcess(text => replaceAll(text, /\*\*([^*]+?)\*\*/g, (_, $1) => `<b>${$1}</b>`));
// Italic
inlineProcess(text => replaceAll(text, /\*([^*]+?)\*/g, (_, $1) => `<i>${$1}</i>`));
// Image
inlineProcess(text => replaceAll(text, /!\[(.+?)\]\((.+?)(?: "(.+?)?")?\)/g, (_, alt, src, title) => `<img src="${src}" alt="${alt}"${title ? ` title="${title}"` : ''}>`));
// Link
inlineProcess(text => replaceAll(text, /\[(.+?)\]\((?:(\w\w+?:[^\s]+?)(?: "(.+?)?")?)\)/g, (_, content, href, title) => `<a href="${href}"${title ? ` title="${title}"` : ''}>${content}</a>`));
inlineProcess(text => replaceAll(text, /\[(.+?)\]\((?:(\w+?@(?:\w|\.\w)+?)(?: "(.+)?")?)\)/g, (_, content, mail, title) => `<a href="mailto:${mail}"${title ? ` title="${title}"` : ''}>${content}</a>`));
inlineProcess(text => replaceAll(text, /<(\w\w+?:[^\s]+?)>/g, (_, href) => `<a href="${href}">${href}</a>`));
inlineProcess(text => replaceAll(text, /<(\w+?@(?:\w|\.\w)+?)>/g, (_, mail) => `<a href="mailto:${mail}">${mail}</a>`));