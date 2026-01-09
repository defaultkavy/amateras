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
        if (!content.includes('import.meta.hot.accept')) return {
            code: `${content}\nif (import.meta.hot) import.meta.hot.accept();`,
            map: null 
        };
    }
} as const

export default viteHMR;