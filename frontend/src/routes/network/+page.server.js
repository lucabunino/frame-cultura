import { getNetwork } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load() {
	const network = await getNetwork();
	if (network) {
		return {
			network
		};
	}
	throw error(404, 'Not found');
}