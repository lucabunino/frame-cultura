import { getAuthor } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const author = await getAuthor(params.slug);
	if (author) {
			return {
				author
			};
	}
	throw error(404, 'Not found');
}