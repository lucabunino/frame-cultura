import { getExploreSelection, getExplore, getExploreTopics } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load({ url }) {
	const exploreSelection = await getExploreSelection();
	const topics = await getExploreTopics();
	const searchMedias = url.searchParams.getAll('media');
	const searchTopic = url.searchParams.get('topic');
	const searchString = url.searchParams.get('search');
	const explore = await getExplore(searchMedias, searchTopic, searchString);
	if (exploreSelection && explore) {
		return {
			exploreSelection: exploreSelection.exploreSelection,
			explore,
			searchMedias,
			searchTopic,
			searchString,
			topics
		};
	}
	throw error(404, 'Not found');
}