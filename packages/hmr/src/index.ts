export const viteHMR = {
    name: 'auto-hmr-accept',
    apply: 'serve',
    handleHotUpdate({file, server}: {file: string, server: any}) {
        if (file.includes('amateras/packages/')) {
            console.log(`package file changes, force reload: ${file}`)
            server.ws.send({
                type: 'full-reload',
                path: '*'
            })
            return []
        }
    },
    transform(content: string, pathname: string) {
        if (pathname.includes('node_modules') || !/\.(js|ts)$/.test(pathname)) return;
        if (pathname.includes('amateras/packages/')) return {
            code: `${content}\nif (import.meta.hot) import.meta.hot.decline();`,
            map: null
        }
        if (!content.includes('import.meta.hot.accept')) {
            const matches = content.matchAll(/export (?:const|let|var) (.+?) ?= ?\$.widget\(/g);
            const matchDefault = content.match(/export default \$.widget\(/)
            if (matchDefault) {
                content = content.replace('export default', 'const $__WIDGET__$ =');
                content += `\nexport default $__WIDGET__$;\nwindow.__registry__($__WIDGET__$, import.meta.url);`
            }

            matches.forEach(match => {
                content += `\nwindow.__registry__(${match[1]}, import.meta.url);`
            })
            if (matches.toArray().length || matchDefault) {
                return {
                    code: `${content}
                    if (import.meta.hot) {
                        import.meta.hot.accept(() => {
                            window.__reload_module__();
                        });
                    }`,
                    map: null 
                }
            }
            else {
                return {
                    code: `${content}\nif (import.meta.hot) import.meta.hot.decline();`,
                    map: null
                }
            }
        };
    }
} as const

export default viteHMR;