import { BLOCK, CODE_END, CODE_LINE, CODE_START } from "#lib/type";
import { htmlEscapeChar, setBlockTokenizer, setProcessor } from "#lib/util";
import type { BlockToken, MarkdownLexer } from "#structure/MarkdownLexer";
import type { MarkdownParser } from "#structure/MarkdownParser";

export const codeblockProcessor = (parser: MarkdownParser) => setProcessor(parser, CODE_START, (token, tokens) => {
        let html = '';
        let i = 1;
        while (i < tokens.length) {
            const token = tokens[i]!;
            if (token.type === CODE_END) break;
            html += token.content![0]!.text;
            i++;
        }
        return {
            html: `<pre><code${token.data?.lang ? ` lang="${token.data.lang}"` : ''}>${htmlEscapeChar(html)}</code></pre>`,
            skipTokens: i
        }
    })

export const codeblockTokenizer = (lexer: MarkdownLexer) => setBlockTokenizer(lexer, CODE_START, {
    regex: /^```(\w+)?/,
    handle: (matches, position, lines) => {
        const tokens: BlockToken[] = [];
        position++;
        while (position < lines.length) {
            const line = lines[position]!;
            position++;
            if (line.includes('```')) {
                tokens.push({ layout: BLOCK, type: CODE_END, content: [] })
                break;
            }
            tokens.push({ layout: BLOCK, type: CODE_LINE, content: [{ layout: "INLINE_TEXT", type: 'CODE_TEXT', text: `${line}\n` }] });
        }
        return {
            content: [],
            data: { lang: matches[1] },
            multiLine: {
                skip: position,
                tokens
            }
        }
    }
})