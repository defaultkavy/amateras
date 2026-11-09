import { defineConfig } from "vite";
import { ViteHMR } from "@amateras/hmr";

export default defineConfig({
    plugins: [
        ViteHMR()
    ]
})