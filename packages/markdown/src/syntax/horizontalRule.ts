import { HORIZONTAL_RULE } from "#lib/type";
import { setBlockTokenizer, setProcessor } from "#lib/util";
import type { MarkdownLexer } from "#structure/MarkdownLexer";
import type { MarkdownParser } from "#structure/MarkdownParser";

export const horizontalRuleProcessor = (parser: MarkdownParser) => setProcessor(parser, HORIZONTAL_RULE, _ => `<hr>`)

export const horizontalRuleTokenizer = (lexer: MarkdownLexer) => setBlockTokenizer(lexer, HORIZONTAL_RULE, {
    regex: /^---/,
    handle: _ => ({ content: [] })
})