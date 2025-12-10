import { LINK, QUICK_LINK } from "#lib/type";
import { setInlineTokenizer, setProcessor } from "#lib/util";
import type { MarkdownLexer, Token } from "#structure/MarkdownLexer";
import type { MarkdownParser } from "#structure/MarkdownParser";
import { isUndefined } from "@amateras/utils";

export const linkProcessor = (parser: MarkdownParser) => {
    const linkProcessor = (token: Token) => {
        const {href, email, title} = token.data!;
        return `<a href="${isUndefined(href) ? `mailto:${email}` : href}"${title ? ` title="${title}"` : ''}>${token.text ?? parser.parse(token.content!)}</a>`
    }
    setProcessor(parser, QUICK_LINK, linkProcessor)
    setProcessor(parser, LINK, linkProcessor)
}

export const linkTokenizer = (lexer: MarkdownLexer) => {

    setInlineTokenizer(lexer, LINK, {
        regex: /\[(.+?)\]\(((?:\w+?@(?:\w|\.\w)+)|(?:\w\w+?:[^\s)]+))(?: "(.+)?")?\)/,
        handle: matches => {
            const [_, alt, detail, title] = matches as [string, string, string, string];
            const match = detail.match(/(?:\w+?@(?:\w|\.\w)+)|(?:\w\w+?:\/\/[^\s]+)/);
            const [resolver] = match!;
            const email_or_href = resolver.includes('@') ? { email: resolver }: { href: resolver };
            return {
                content: lexer.inlineTokenize(alt),
                data: {
                    title, ...email_or_href
                }
            }
        }
    })
    setInlineTokenizer(lexer, QUICK_LINK, {
        regex: /<((?:\w+?@(?:\w|\.\w)+)|(?:\w\w+?:[^\s>]+))>/,
        handle: matches => {
            const [_, detail] = matches as [string, string];
            const match = detail.match(/(?:\w+?@(?:\w|\.\w)+)|(?:\w\w+?:\/\/[^\s]+)/);
            const [resolver] = match!;
            const email_or_href = resolver.includes('@') ? { email: resolver }: { href: resolver };
            return {
                content: resolver,
                data: email_or_href
            }
        }
    })
}