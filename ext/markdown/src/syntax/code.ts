import { CODE } from "#lib/type";
import { htmlEscapeChar, htmltag, setInlineTokenizer, setProcessor } from "#lib/util";
import type { MarkdownLexer } from "#structure/MarkdownLexer";
import type { MarkdownParser } from "#structure/MarkdownParser";

export const codeProcessor = (parser: MarkdownParser) => setProcessor(parser, CODE, token => htmltag('code', htmlEscapeChar(token.text!)))

export const codeTokenizer = (lexer: MarkdownLexer) => setInlineTokenizer(lexer, CODE, {
    regex: /`(.+?)`/,
    handle: matches => ({ content: matches[1]! })
})