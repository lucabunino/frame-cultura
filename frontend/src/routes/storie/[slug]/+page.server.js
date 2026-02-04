import { getStory } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const story = await getStory(params.slug);
	if (story) {
			return {
				story
			};
	}
	throw error(404, 'Not found');
}