import { getHomepage } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load() {
	const homepage = await getHomepage();
	if (homepage) {
		return {
			homepage,
		};
	}
	throw error(404, 'Not found');
}