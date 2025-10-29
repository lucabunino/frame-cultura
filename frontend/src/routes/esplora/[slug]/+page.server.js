import { getProduction } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const production = await getProduction(params.slug);
	if (production) {
			return {
				production
			};
	}
	throw error(404, 'Not found');
}