/** @type {import('@sveltejs/kit').Handle} */
import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
	const { pathname } = event.url;
	const redirects = {
		'/podcast-la-ricerca-della-balena-bianca': '/esplora/la-ricerca-della-balena-bianca'
	};
	if (pathname in redirects) {
		throw redirect(308, redirects[pathname]);
	}

	if (dev && event.url.pathname === '/.well-known/appspecific/com.chrome.devtools.json') {
		return new Response(undefined, { status: 404 });
	}
	const response = await resolve(event, {
		preload: ({ type, path }) =>
			['js', 'css', 'font'].includes(type) || path.includes('/important/')
	});
	return response;
}