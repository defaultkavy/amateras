import { EMPTY_LINE, TEXT, TEXT_LINE } from "#lib/type";
import { htmltag, setProcessor } from "#lib/util";
import type { MarkdownParser } from "#structure/MarkdownParser";

export const textProcessor = (parser: MarkdownParser) => setProcessor(parser, TEXT, token => token.text!);

export const textLineProcessor = (parser: MarkdownParser) => setProcessor(parser, TEXT_LINE, (_, tokens) => {
    let html = '';
    let i = 0;
    for (const token of tokens) {
        if (token.type === EMPTY_LINE) break;
        html += parser.parse(token.content!);
        i++;
    }
    return {
        html: htmltag('p', html),
        skipTokens: i
    };
})