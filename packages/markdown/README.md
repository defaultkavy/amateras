# amateras/markdown

## Usage
```ts
import { Markdown } from 'amateras/markdown';

const markdown = new Markdown();

markdown.parseHTML('# Title'); // => <h1>Title</h1>
```

## Add Custom Markdown Rules
```ts
markdown.lexer.blockTokenizers.set('CUSTOM_TYPE', {
	regex: /#! (.+)/,
	handle: matches => {
		content: lexer.inlineTokenize(matches[1]!)
	}
})

markdown.parser.processors.set('CUSTOM_TYPE', token => {
	return `<custom>${markdown.parser.parse(token.content!)}</custom>`
})
```

## Import Syntax
```ts
import { MarkdownParser, MarkdownLexer } from 'amateras/markdown';
import { blockquoteProcessor, blockquoteTokenizer } from 'amateras/markdown/syntax/blockquote';
import { headingProcessor, headingTokenizer } from 'amateras/markdown/syntax/heading';

const lexer = new MarkdownLexer();
const parser = new MarkdownParser();

lexer.use(
    blockquoteTokenizer,
    headingTokenizer
)

parser.use(
    blockquoteProcessor,
    headingProcessor
)

function parseHTML(str: string) {
    const tokens = lexer.blockTokenize(str);
    return parser.parse(tokens);
}

parseHTML('# Title') // => <h1>Title</h1>
parseHTML('> This is Blockquote') // => <blockquote>This is Blockquote</blockquote>
parseHTML('- List') // => - List
```