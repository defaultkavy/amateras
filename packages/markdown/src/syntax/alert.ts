import { ALERT, ALERT_LINE, BLOCK } from "#lib/type";
import { setBlockTokenizer, setProcessor } from "#lib/util";
import type { BlockToken, MarkdownLexer } from "#structure/MarkdownLexer";
import type { MarkdownParser } from "#structure/MarkdownParser";
import { uppercase } from "@amateras/utils";

export const alertProcessor = (parser: MarkdownParser) => setProcessor(parser, ALERT, (token, tokens) => {
    let html = '';
    let i = 1;
    while (i < tokens.length) {
        const token = tokens[i]!;
        if (token.type !== ALERT_LINE) break;
        html += parser.parse(token.content![0]!.content!);
        i++;
    }
    const alertType = token.data?.alertType as string;
    return {
        html: `<blockquote class="alert alert-${alertType}"><p class="alert-title">${uppercase(alertType, 0, 1)}</p>${html}</blockquote>`,
        skipTokens: i
    }
})

export const alertTokenizer = (lexer: MarkdownLexer) => setBlockTokenizer(lexer, ALERT, {
    regex: /^> ?\[!(?:(?:NOTE)|(?:TIP)|(?:IMPORTANT)|(?:WARNING)|(?:CAUTION))\]/,
    handle(_, position, lines) {
        const tokens: BlockToken[] = [];
        const match = lines[position]!.match(/> ?\[!(.+?)\]/);
        const alertType = match?.[1]?.toLowerCase();
        position++
        while (position < lines.length) {
            const line = lines[position]!;
            const match = line.match(/^> ?(.+)/);
            if (match) tokens.push({ layout: BLOCK, type: ALERT_LINE, content: lexer.blockTokenize(match[1]!) });
            else break;
            position++;
        }
        return {
            content: [],
            data: { alertType },
            multiLine: {
                skip: position,
                tokens
            }
        }
    },
})