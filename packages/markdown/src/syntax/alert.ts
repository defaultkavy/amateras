import { ALERT, ALERT_LINE, BLOCK } from "#lib/type";
import { setBlockTokenizer, setProcessor, htmltag } from "#lib/util";
import type { BlockToken, MarkdownLexer } from "#structure/MarkdownLexer";
import type { MarkdownParser } from "#structure/MarkdownParser";
import { Utils } from '@amateras/utils';

export const alertProcessor = (parser: MarkdownParser) => setProcessor(parser, ALERT, (token, tokens) => {
    // let html = '';
    let i = 1;
    const blockquote = (deep: number) => {
        let html = '';
        while (i < tokens.length) {
            const {type, content, data} = tokens[i]!;
            if (type !== ALERT_LINE) break;
            if (data!.deep > deep) html += blockquote(data!.deep);
            else if (data!.deep < deep) break;
            else { html += parser.parse(content!); i++ }
        }
        if (deep === 0) return html;
        return htmltag('blockquote', html)
    }
    const alertType = token.data?.alertType as string;
    return {
        html: `<blockquote class="alert alert-${alertType}"><p class="alert-title">${Utils.uppercase(alertType, 0, 1)}</p>${blockquote(0)}</blockquote>`,
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
            const match = line.match(/^(>+) ?(.+)/);
            if (match) tokens.push({ 
                layout: BLOCK, 
                type: ALERT_LINE, 
                content: lexer.blockTokenize(match[2]!),
                data: {
                    deep: (match[1]!.length - 1)
                }
            });
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