import { getContact } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load() {
	const contact = await getContact();
	if (contact) {
		return {
			contact
		};
	}
	throw error(404, 'Not found');
}