import type { BlockTokenizer, InlineTokenizer, MarkdownLexer } from "#structure/MarkdownLexer";
import type { MarkdownParseProcessor, MarkdownParser } from "#structure/MarkdownParser";

export const setBlockTokenizer = (lexer: MarkdownLexer, type: string, tokenizer: BlockTokenizer) => lexer.blockTokenizers.set(type, tokenizer);
export const setInlineTokenizer = (lexer: MarkdownLexer, type: string, tokenizer: InlineTokenizer) => lexer.inlineTokenizers.set(type, tokenizer);

export const setProcessor = (parser: MarkdownParser, type: string, processor: MarkdownParseProcessor) => parser.processors.set(type, processor);

export const htmltag = (tagname: string, content: string) => `<${tagname}>${content}</${tagname}>`