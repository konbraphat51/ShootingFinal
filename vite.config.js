import {defineConfig} from "vite"
import {viteSingleFile} from "vite-plugin-singlefile"
import vue from "@vitejs/plugin-vue"

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue(), viteSingleFile()],
	base: "./",
	build: {
		outDir: "docs", // Github Pages
		emptyOutDir: true,
	},
})
