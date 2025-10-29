import { getLiveStreaming } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const liveStreaming = await getLiveStreaming(params.slug);
	if (liveStreaming) {
			return {
				liveStreaming
			};
	}
	throw error(404, 'Not found');
}