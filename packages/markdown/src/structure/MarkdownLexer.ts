import { BLOCK, EMPTY_LINE, INLINE_CONTENT, INLINE_TEXT, TEXT_LINE } from "#lib/type";
import { forEach, isString } from "@amateras/utils";

export class MarkdownLexer {
    blockTokenizers = new Map<string, BlockTokenizer>();
    inlineTokenizers = new Map<string, InlineTokenizer>();
    
    blockTokenize(str: string) {
        const lines = str?.split(/\r?\n/) ?? [];
        const tokens: BlockToken[] = [];
        let lineIndex = 0;
        lineLoop: while (lineIndex < lines.length) {
            let line = lines[lineIndex];
            if (line === undefined) throw 'LINE ERROR';
            let token: BlockToken | undefined;
            for (const [type, tokenizer] of this.blockTokenizers) {
                const matched = line.match(tokenizer.regex);
                if (matched) {
                    const {content, multiLine, data} = tokenizer.handle(matched, lineIndex, lines);
                    token = { layout: BLOCK, type, content, data }
                    if (multiLine) {
                        tokens.push(token);
                        tokens.push(...multiLine.tokens)
                        lineIndex = multiLine.skip;
                        continue lineLoop;
                    }
                    break;
                }
            }
            if (!token) token = { 
                layout: BLOCK, 
                ...(
                    line.length 
                    ?   { type: TEXT_LINE, content: this.inlineTokenize(line) } 
                    :   { type: EMPTY_LINE, content: [] }
                )
            };
            tokens.push(token);
            lineIndex++;
        }
        return tokens;
    }

    inlineTokenize(str: string): InlineToken[] {
        const tokens: InlineToken[] = [];
        let remainStr = str;
        while (remainStr.length) {
            let token: InlineToken | undefined;
            for (const [type, tokenizer] of this.inlineTokenizers) {
                const matched = remainStr.match(tokenizer.regex);
                if (matched) {
                    const {index, 0: matchStr} = matched;
                    // handle before matched string
                    if (index != 0) tokens.push(...this.inlineTokenize(remainStr.substring(0, index)));
                    // handle matched string
                    const {content, data} = tokenizer.handle(matched);
                    token = { type, ...(isString(content) ? { layout: INLINE_TEXT, text: content } : { layout: INLINE_CONTENT, content })};
                    if (data) token.data = data;
                    remainStr = remainStr.substring(index! + matchStr.length);
                    break;
                }
            }
            if (!token) {
                token = { type: 'TEXT', layout: INLINE_TEXT, text: remainStr };
                remainStr = '';
            }
            tokens.push(token);
        }
        return tokens;
    }

    use(...handle: ((parser: this) => void)[]) {
        forEach(handle, fn => fn(this));
        return this;
    }
}

export type BlockTokenizer = {
    regex: RegExp;
    handle: (matches: RegExpMatchArray, position: number, lines: string[]) => { content: (InlineToken | BlockToken)[], multiLine?: BlockTokenizerMultiLine, data?: {[key: string]: any} };
}
export type BlockTokenizerMultiLine = {
    skip: number;
    tokens: BlockToken[];
}
export type InlineTokenizer = {
    regex: RegExp;
    handle: (matches: RegExpMatchArray) => { content: InlineToken[] | string, data?: {[key: string]: any} }
}

export interface TokenBase {
    type: string;
    layout: 'BLOCK' | 'INLINE_CONTENT' | 'INLINE_TEXT';
    content?: Token[];
    text?: string;
    data?: {[key: string]: any};
}
export interface BlockToken extends TokenBase {
    layout: 'BLOCK'
    content: Token[];
}
export interface InlineTextToken extends TokenBase {
    layout: 'INLINE_TEXT'
    text: string;
}
export interface InlineContentToken extends TokenBase {
    layout: 'INLINE_CONTENT'
    content: (InlineToken)[];
}
export type InlineToken = InlineTextToken | InlineContentToken;
export type Token = BlockToken | InlineToken;