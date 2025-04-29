import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		typescript: {
			config: (config) => {
				config.compilerOptions = {
					...config.compilerOptions,
					verbatimModuleSyntax: true
				};
				return config;
			}
		}
	},
	preprocess: vitePreprocess(),
	compilerOptions: {
		runes: true,
		customElement: false
	}
};

export default config; 