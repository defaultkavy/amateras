import { alertProcessor, alertTokenizer } from "../syntax/alert";
import { blockquoteProcessor, blockquoteTokenizer } from "../syntax/blockquote";
import { boldProcessor, boldTokenizer } from "../syntax/bold";
import { codeProcessor, codeTokenizer } from "../syntax/code";
import { codeblockProcessor, codeblockTokenizer } from "../syntax/codeblock";
import { headingProcessor, headingTokenizer } from "../syntax/heading";
import { horizontalRuleProcessor, horizontalRuleTokenizer } from "../syntax/horizontalRule";
import { imageProcessor, imageTokenizer } from "../syntax/image";
import { italicProcessor, italicTokenizer } from "../syntax/italic";
import { linkProcessor, linkTokenizer } from "../syntax/link";
import { listProcessor, listTokenizer } from "../syntax/list";
import { textLineProcessor, textProcessor } from "../syntax/text";
import { MarkdownLexer } from "./MarkdownLexer";
import { MarkdownParser } from "./MarkdownParser";

export class Markdown {
    lexer = new MarkdownLexer();
    parser = new MarkdownParser();
    constructor() {
        this.lexer.use(
            headingTokenizer,
            codeblockTokenizer,
            listTokenizer,
            alertTokenizer,
            blockquoteTokenizer,
            horizontalRuleTokenizer,
            imageTokenizer, // image tokenizer must before link
            linkTokenizer, // link tokenizer must before bold and italic and code
            codeTokenizer,
            boldTokenizer,
            italicTokenizer,
        )
        
        this.parser.use(
            textProcessor,
            imageProcessor,
            linkProcessor,
            codeProcessor,
            italicProcessor,
            boldProcessor,
            textLineProcessor,
            headingProcessor,
            codeblockProcessor,
            listProcessor,
            alertProcessor,
            blockquoteProcessor,
            horizontalRuleProcessor
        )
    }

    parseHTML(str: string) {
        return this.parser.parse(this.lexer.blockTokenize(str));
    }
}