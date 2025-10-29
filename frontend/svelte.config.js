import adapter from '@sveltejs/adapter-auto';
// import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
		split: false
	})
  },
  preprocess: [
	vitePreprocess({
		postcss: true,
	})
  ],
};

export default config;
