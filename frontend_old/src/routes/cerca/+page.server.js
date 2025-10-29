import { getExploreTopics, getLiveTopics, getAuthors, getExplore, getLive  } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';
export async function load({ url }) {
	const exploreTopics = await getExploreTopics();
	const liveTopics = await getLiveTopics();
	const searchMedias = url.searchParams.getAll('media');
	const searchFormats = url.searchParams.get('format');
	const searchCity = url.searchParams.get('city');
	const searchTopic = url.searchParams.get('topic');
	const searchString = url.searchParams.get('search');
	const authors = await getAuthors(searchString);
	const explore = await getExplore(searchMedias, searchTopic, searchString);
	const live = await getLive(searchFormats, searchCity, searchTopic, searchString);
	if (exploreTopics && liveTopics && authors && explore && live) {
		return {
			searchMedias,
			searchTopic,
			searchString,
			exploreTopics,
			liveTopics,
			authors,
			explore,
			live
		};
	}
	throw error(404, 'Not found');
}