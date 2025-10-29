import { getLiveSelection, getLive, getLiveTopics, getLiveFormats, getLiveCities } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load({ url }) {
	const liveSelection = await getLiveSelection();
	const topics = await getLiveTopics();
	const formats = await getLiveFormats();
	const cities = await getLiveCities();
	const searchFormat = url.searchParams.get('format');
	const searchCity = url.searchParams.get('city');
	const searchTopic = url.searchParams.get('topic');
	const searchString = url.searchParams.get('search');
	const live = await getLive(searchFormat, searchCity, searchTopic, searchString);
	if (liveSelection && live && topics && formats) {
		return {
			liveSelection: liveSelection.liveSelection,
			liveIntro: liveSelection.liveIntro,
			live,
			topics,
			formats,
			cities
		};
	}
	throw error(404, 'Not found');
}