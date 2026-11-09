import { Tsukimi } from 'tsukimi';
import './src/index';
import { App } from './src/widget/App';

const tsukimi = new Tsukimi({
    root: import.meta.dir,
    app: App,
    selector: 'body'
})

const server = Bun.serve({
    port: 3000,
    routes: {
        '/*': async (req) => {
            const html = await tsukimi.render(req.url);
            return new Response(html, {
                headers: [
                    ['Content-Type', 'text/html'],
                    ['Content-Length', `${html.length}`]
                ]
            })
        }
    }
})

console.log(`Server start listen on ${server.port}`)