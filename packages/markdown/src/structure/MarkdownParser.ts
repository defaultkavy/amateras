import { forEach, isString } from "@amateras/utils";
import { type Token } from "./MarkdownLexer";

export class MarkdownParser {
    processors = new Map<string, MarkdownParseProcessor>();
    
    parse(tokens: (Token)[]) {
        let html = '';
        let i = 0;
        if (!tokens) return html;
        while (i < tokens.length) {
            const token = tokens[i]!;
            const processor = this.processors.get(token.type);
            if (processor) {
                const result = processor(token, tokens.slice(i));
                if (isString(result)) {
                    html += result;
                } else {
                    html += result.html;
                    i += result.skipTokens;
                }
            }
            i++;
        }
        return html;
    }

    use(...handle: ((parser: this) => void)[]) {
        forEach(handle, fn => fn(this));
        return this;
    }
}

export type MarkdownParseProcessor = (token: Token, tokens: Token[]) => (string | { html: string, skipTokens: number })