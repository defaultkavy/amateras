import { HEADING } from "#lib/type";
import { htmltag, setBlockTokenizer, setProcessor } from "#lib/util";
import type { MarkdownLexer } from "#structure/MarkdownLexer";
import type { MarkdownParser } from "#structure/MarkdownParser";

export const headingProcessor = (parser: MarkdownParser) => setProcessor(parser, HEADING, token => {
    const tagname = `h${token.data!.level}`;
    return htmltag(tagname, parser.parse(token.content!))
})

export const headingTokenizer = (lexer: MarkdownLexer) => setBlockTokenizer(lexer, HEADING, {
    regex: /^(#+) (.+)/,
    handle: matches => ({ content: lexer.inlineTokenize(matches[2]!), data: { level: matches[1]!.length } })
})