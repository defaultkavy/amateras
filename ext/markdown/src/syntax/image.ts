import { IMAGE } from "#lib/type";
import { htmltag, setInlineTokenizer, setProcessor } from "#lib/util";
import type { MarkdownLexer } from "#structure/MarkdownLexer";
import type { MarkdownParser } from "#structure/MarkdownParser";

export const imageProcessor = (parser: MarkdownParser) => setProcessor(parser, IMAGE, token => {
    const tagname = `h${token.data!.level}`;
    return htmltag(tagname, parser.parse(token.content!))
})

export const imageTokenizer = (lexer: MarkdownLexer) => setInlineTokenizer(lexer, IMAGE, {
    regex: /^(#+) (.+)/,
    handle: matches => ({ content: lexer.inlineTokenize(matches[2]!), data: { level: matches[1]!.length } })
})