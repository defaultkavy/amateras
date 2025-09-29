import { IMAGE } from "#lib/type";
import { setInlineTokenizer, setProcessor } from "#lib/util";
import type { MarkdownLexer } from "#structure/MarkdownLexer";
import type { MarkdownParser } from "#structure/MarkdownParser";

export const imageProcessor = (parser: MarkdownParser) => setProcessor(parser, IMAGE, token => {
    const { url, title } = token.data!;
    return `<img alt="${parser.parse(token.content!)}" src="${url}"${title ? ` title="${title}"` : ''}>`
})

export const imageTokenizer = (lexer: MarkdownLexer) => setInlineTokenizer(lexer, IMAGE, {
    regex: /^!\[(.+?)\]\((.+?)\)/,
    handle: matches => {
        const [_, alt, detail] = matches as [string, string, string];
        const [__, url, title] = detail.match(/(\w\w+?:\/\/[^\s]+)(?: "(.+?)")?/) as [string, string, string];
        return {
            content: lexer.inlineTokenize(alt),
            data: {
                url, title
            }
        }
    }
})