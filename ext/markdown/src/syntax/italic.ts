import { ITALIC } from "#lib/type";
import { setInlineTokenizer, setProcessor } from "#lib/util";
import type { MarkdownLexer } from "#structure/MarkdownLexer";
import type { MarkdownParser } from "#structure/MarkdownParser";

export const italicProcessor = (parser: MarkdownParser) => setProcessor(parser, ITALIC, token => `<i>${parser.parse(token.content!)}</i>`)

export const italicTokenizer = (lexer: MarkdownLexer) => setInlineTokenizer(lexer, ITALIC, {
    regex: /\*(.+?)\*/,
    handle: matches => ({ content: lexer.inlineTokenize(matches[1]!) })
})