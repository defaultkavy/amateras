import { type Plugin } from "vite";
import esbuild from 'esbuild';
import path from 'path';

export interface AmaterasSWConfig {
    entryFile: string;
    swURL?: string;
}

export function AmaterasSW(config: AmaterasSWConfig): Plugin {
    config.entryFile = config.entryFile.replace(/^\//, '');
    config.swURL = config.swURL ?? '/sw.js';
    let isBuild = false;
    return {
        name: 'amateras/sw',
        configResolved(config) {
            if (config.command === 'build') isBuild = true;
        },
        transformIndexHtml(html) {
            return {
                html,
                tags: [
                    {
                        tag: 'script',
                        children: `if ('serviceWorker' in navigator) {window.addEventListener('load', () => navigator.serviceWorker.register('${config.swURL}'))}`,
                        injectTo: 'body'
                    }
                ]
            }
        },
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (!req.url) return;
                if (req.url === config.swURL) {
                    try {
                        const result = await esbuild.build({
                            entryPoints: [path.join(server.config.root, config.entryFile)],
                            write: false,
                            bundle: true,
                            format: 'esm'
                        });

                        if (result.outputFiles[0]) {
                            res.setHeader('Content-Type', 'application/javascript');
                            res.end(result.outputFiles[0].text);
                        }
                        return;
                    } catch (err) {
                        next(err);
                    }
                }
                next();
            });
        },
        async generateBundle(options, bundle) {
            if (!isBuild) return;
            // const assets = Object.keys(bundle).filter((fileName) => !fileName.endsWith('.map'));
            try {
                const result = await esbuild.build({
                    entryPoints: [path.join(this.environment.config.root, config.entryFile)],
                    write: false,
                    bundle: true,
                    format: 'esm',
                    minify: true,
                    // define: {
                    //     '__ASSETS_MANIFEST__': JSON.stringify(assets),
                    // },
                });

                // 将编译后的 sw.js 写入到 Vite 的打包结果中
                if (result.outputFiles[0]) {
                    this.emitFile({
                        type: 'asset',
                        fileName: 'sw.js',
                        source: result.outputFiles[0].text,
                    });
                }
            } catch (err) {
                this.error(`Service Worker Bundle Error: ${err}`);
            }
        }
    }
}