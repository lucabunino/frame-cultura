import { getEvent } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const event = await getEvent(params.slug);
	if (event) {
			return {
				event
			};
	}
	throw error(404, 'Not found');
}