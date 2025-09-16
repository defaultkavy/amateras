import { BLOCK, TABLE, TABLE_COLUMN, TABLE_ROW } from "#lib/type";
import { htmltag, setBlockTokenizer, setProcessor } from "#lib/util";
import type { BlockToken, MarkdownLexer } from "#structure/MarkdownLexer";
import type { MarkdownParser } from "#structure/MarkdownParser";
import { _Array_from } from "amateras/lib/native";

export const tableProcessor = (parser: MarkdownParser) => setProcessor(parser, TABLE, (token) => {
        let thead = '';
        let tbody = '';
        let rowIndex = 0;
        for (const row of token.content!) {
            let rowHTML = '';
            for (let i = 0; i < row.content!.length; i++) {
                const col = row.content![i]!;
                const align = token.data!.align[i];
                const tagname = rowIndex === 0 ? 'th' : 'td';
                rowHTML += `<${tagname} align="${align ?? 'left'}">${parser.parse(col.content!)}</${tagname}>`
            }
            if (rowIndex === 0) thead += htmltag('thead', htmltag('tr', rowHTML));
            else tbody += htmltag('tr', rowHTML);
            rowIndex++
        }
        tbody = htmltag('tbody', tbody);
        return htmltag('table', thead + tbody)
    })

export const tableTokenizer = (lexer: MarkdownLexer) => setBlockTokenizer(lexer, TABLE, {
        regex: /\|(?:.+\|)+/,
        handle(_, position, lines) {
            const tokens: BlockToken[] = [];
            const align = []
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
                        align.push(RIGHT ? LEFT ? 'center' : 'right' : 'left');
                        continue;
                    }
                    row.content.push({
                        type: TABLE_COLUMN,
                        content: lexer.inlineTokenize(text.trim()),
                        layout: BLOCK
                    })
                }
                if (row.content.length) tokens.push(row);
                position++
            }
            return {
                content: tokens,
                data: { align },
                multiLine: {
                    skip: position,
                    tokens: []
                }
            }
        },
    })