import { getTeamMember } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const teamMember = await getTeamMember(params.slug);
	if (teamMember) {
			return {
				teamMember
			};
	}
	throw error(404, 'Not found');
}