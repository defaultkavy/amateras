import { BLOCK, TABLE, TABLE_COLUMN, TABLE_ROW } from "#lib/type";
import { htmltag, setBlockTokenizer, setProcessor } from "#lib/util";
import type { BlockToken, MarkdownLexer } from "#structure/MarkdownLexer";
import type { MarkdownParser } from "#structure/MarkdownParser";
import { _Array_from } from "amateras/lib/native";

export const tableProcessor = (parser: MarkdownParser) => setProcessor(parser, TABLE, (token) => {
        let html = '';
        for (const row of token.content!) {
            let rowHTML = '';
            for (let i = 0; i < row.content!.length; i++) {
                const col = row.content![i]!;
                const align = token.data!.columnAlign[i];
                const tagname = row === token.content![0] ? 'th' : 'td';
                rowHTML += `<${tagname} align="${align ?? 'left'}">${parser.parse(col.content!)}</${tagname}>`
            }
            html += htmltag('tr', rowHTML)
        }
        return htmltag('table', html)
    })

export const tableTokenizer = (lexer: MarkdownLexer) => setBlockTokenizer(lexer, TABLE, {
        regex: /\|(?:.+\|)+/,
        handle(matches, position, lines) {
            const tokens: BlockToken[] = [];
            const columnAlign = []
            while (position < lines.length) {
                const row: BlockToken = {
                    type: TABLE_ROW,
                    layout: BLOCK,
                    content: []
                }
                const line = lines[position]!;
                const matches = _Array_from(line.matchAll(/\| ([^|]+)/g));
                if (!matches.length) break;
                for (const match of matches) {
                    const text = match[1]!;
                    const separator = text.match(/(:)?---+(:)?/);
                    if (separator) {
                        const [_, LEFT, RIGHT] = separator;
                        columnAlign.push(RIGHT ? LEFT ? 'center' : 'right' : 'left');
                        continue;
                    }
                    row.content.push({
                        type: TABLE_COLUMN,
                        content: lexer.inlineTokenize(text.trim()),
                        layout: BLOCK
                    })
                }
                tokens.push(row);
                position++
            }
            return {
                content: tokens,
                data: { columnAlign },
                multiLine: {
                    skip: position,
                    tokens: []
                }
            }
        },
    })