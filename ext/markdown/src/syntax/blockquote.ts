import { BLOCKQUOTE } from "#lib/type";
import { htmltag, setBlockTokenizer, setProcessor } from "#lib/util";
import type { MarkdownLexer } from "#structure/MarkdownLexer";
import type { MarkdownParser } from "#structure/MarkdownParser";

export const blockquoteProcessor = (parser: MarkdownParser) => setProcessor(parser, BLOCKQUOTE, (token, tokens) => {
        let i = 0;
        const blockquote = (deep: number) => {
            let html = '';
            while (i < tokens.length) {
                const {type, content, data} = tokens[i]!;
                if (type !== BLOCKQUOTE) break;
                if (data!.deep > deep) html += blockquote(data!.deep);
                else if (data!.deep < deep) break;
                else { html += parser.parse(content!); i++ }
            }
            return htmltag('blockquote', html)
        }
        return {
            html: blockquote(token.data!.deep),
            skipTokens: i
        }
    })

export const blockquoteTokenizer = (lexer: MarkdownLexer) => setBlockTokenizer(lexer, BLOCKQUOTE, {
        regex: /^(>+) ?(.+)?/,
        handle(matches) {
            return {
                content: lexer.blockTokenize(matches[2] ?? ''),
                data: {
                    deep: (matches[1]!.length - 1)
                }
            }
        }
    })