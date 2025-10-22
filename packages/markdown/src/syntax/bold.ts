import { BOLD } from "#lib/type";
import { htmltag, setInlineTokenizer, setProcessor } from "#lib/util";
import type { MarkdownLexer } from "#structure/MarkdownLexer";
import type { MarkdownParser } from "#structure/MarkdownParser";

export const boldProcessor = (parser: MarkdownParser) => setProcessor(parser, BOLD, token => htmltag('b', parser.parse(token.content!)))

export const boldTokenizer = (lexer: MarkdownLexer) => setInlineTokenizer(lexer, BOLD, {
        regex: /\*\*(.+?\*?)\*\*/,
        handle: matches => ({ content: lexer.inlineTokenize(matches[1]!) })
    })