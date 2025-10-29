/** @type {import('@sveltejs/kit').Handle} */
import { dev } from '$app/environment';

export async function handle({ event, resolve }) {
	if (dev && event.url.pathname === '/.well-known/appspecific/com.chrome.devtools.json') {
		return new Response(undefined, { status: 404 });
	}
	const response = await resolve(event, {
		preload: ({ type, path }) =>
			['js', 'css', 'font'].includes(type) || path.includes('/important/')
	});
	return response;
}