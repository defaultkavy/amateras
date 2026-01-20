import { EMPTY_LINE, ORDERED_LIST_ITEM, TEXT_LINE, UNORDERED_LIST_ITEM } from "#lib/type";
import { htmltag, setBlockTokenizer, setProcessor } from "#lib/util";
import type { MarkdownLexer, Token } from "#structure/MarkdownLexer";
import type { MarkdownParser } from "#structure/MarkdownParser";
import { isEqual, isString } from "@amateras/utils";

export const listProcessor = (parser: MarkdownParser) => {
    const listType = (type: string) => type === ORDERED_LIST_ITEM ? 'ol' : 'ul'
    const listProcessor = (token: Token, tokens: Token[]) => {
        let i = 0;
        // cache the list by deep number
        const deepListMap = new Map<number, List>();

        const listGenerator = (type: string, deep: number) => {
            const getList = deepListMap.get(deep)
            const list = getList && listType(type) === getList.tagname ? getList : List(listType(type), []);
            deepListMap.set(deep, list);

            while (i < tokens.length) {
                const token = tokens[i]!;
                const tokenType = token.type;
                // if token type not equal list item / empty line / text line, then finish loop
                if (!isEqual(tokenType, [ORDERED_LIST_ITEM, UNORDERED_LIST_ITEM, EMPTY_LINE, TEXT_LINE])) { i--; break};
                // if token type equal text line
                if (tokenType === TEXT_LINE) {
                    const text = token.content![0]?.text;
                    // if text start with double space
                    if (text?.match(/^\s\s/)) {
                        const match = text.match(/^(\s+)(.+)?/)!;
                        // if no content, then next token
                        if (!match[2]) { i++; continue }
                        token.data = { deep: Math.trunc(match[1]!.length / 2) - 1 }
                    }
                    // if text start with tab
                    else if (text?.match(/^\t/)) {
                        const match = text.match(/^(\t+)(.+)?/)!;
                        // if no content, then next token
                        if (!match[2]) { i++; continue }
                        token.data = { deep: match[1]!.length - 1 }
                    }
                    // else break 
                    else {i--; break};
                }
                // if token type equal empty line, jump to next token
                if (tokenType === EMPTY_LINE) i++;
                // if token deep number not equal latest deep of list
                else if (token.data!.deep !== deep) {
                    // if bigger, push deeper list into current list item
                    if (token.data!.deep > deep) deepListMap.get(deep)?.items.at(-1)?.content.push(listGenerator(tokenType, token.data!.deep))
                    // else delete current deep cache and return to upper list
                    else { deepListMap.delete(deep); break; }
                }
                // if token type equal text line, convert this list to paragraph mode
                else if (tokenType === TEXT_LINE) {
                    list.paragraph = true;
                    list.items.at(-1)?.content.push(parser.parse(token.content!))
                    i++
                }
                // if list type not equal, then finish loop
                else if (tokenType !== type) {
                    deepListMap.delete(deep);
                    break;
                }
                // push list item
                else {
                    list.items.push(ListItem([parser.parse(token.content!)]));
                    i++
                }
            }
            return list;
        }

        return {
            html: `${listGenerator(token.type, token.data!.deep)}`,
            skipTokens: i
        }
    }

    interface ListItem { content: (string | List)[], toString(): string }
    const ListItem = (content: (string | List)[]): ListItem => ({
        content: content,
        toString() { return htmltag('li', this.content.join('')) }
    })

    interface List { tagname: string, items: ListItem[], paragraph: boolean, toString(): string }
    const List = (tagname: 'ul' | 'ol', items: ListItem[]): List => ({
        tagname: tagname,
        items: items,
        paragraph: false,
        toString() {
            if (this.paragraph) this.items.forEach(item => item.content.forEach((text, i) => isString(text) && (item.content[i] = htmltag('p', text))))
            return htmltag(this.tagname, this.items.join(''))
        }
    })

    setProcessor(parser, UNORDERED_LIST_ITEM, listProcessor);
    setProcessor(parser, ORDERED_LIST_ITEM, listProcessor);
}

export const listTokenizer = (lexer: MarkdownLexer) => {
    const listHandle = (matches: RegExpMatchArray) => {
        const prefix = matches[0].split(/[-*]/)[0]!;
        const spaces = prefix.match(/\s/)?.length ?? 0;
        const tabs = prefix.match(/\t/)?.length ?? 0;
        return ({
        content: lexer.inlineTokenize(matches[1]!),
        data: {
            deep: Math.trunc(tabs + spaces / 2)
        }
    })
    }
    setBlockTokenizer(lexer, UNORDERED_LIST_ITEM, {
        regex: /^(?:[\s\t]+)?[-*] (.+)/,
        handle: listHandle
    })

    setBlockTokenizer(lexer, ORDERED_LIST_ITEM, {
        regex: /^(?:[\s\t]+)?\d+\. (.+)/,
        handle: listHandle
    })
}