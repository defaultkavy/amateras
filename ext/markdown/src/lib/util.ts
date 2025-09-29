import type { BlockTokenizer, InlineTokenizer, MarkdownLexer } from "#structure/MarkdownLexer";
import type { MarkdownParseProcessor, MarkdownParser } from "#structure/MarkdownParser";
import { forEach } from "amateras/lib/native";

export const setBlockTokenizer = (lexer: MarkdownLexer, type: string, tokenizer: BlockTokenizer) => lexer.blockTokenizers.set(type, tokenizer);
export const setInlineTokenizer = (lexer: MarkdownLexer, type: string, tokenizer: InlineTokenizer) => lexer.inlineTokenizers.set(type, tokenizer);

export const setProcessor = (parser: MarkdownParser, type: string, processor: MarkdownParseProcessor) => parser.processors.set(type, processor);

export const htmltag = (tagname: string, content: string) => `<${tagname}>${content}</${tagname}>`

export const htmlEscapeChar = (str: string) => {
    forEach([
        ['&', '&amp;'],
        ['<', '&lt;'],
        ['>', '&gt;'],
        ['"', '&quot;'],
        ["'", '&#39;']
    ] as [string, string][], group => str = str.replaceAll(...group))
    return str;
}