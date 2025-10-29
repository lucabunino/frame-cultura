import { getInfo, getSeo, getPolicies, getExploreHasContent, getLiveHasContent, getLiveWidget } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load({ url }) {
	const info = await getInfo();
	const seo = await getSeo();
	const policies = await getPolicies();
	const exploreHasContent = await getExploreHasContent();
	const liveHasContent = await getLiveHasContent();
	const liveWidget = await getLiveWidget();
	const { pathname } = url
	const searchTopics = url.searchParams.getAll('topic');
	const searchString = url.searchParams.get('search');
	if (info, seo, policies, pathname, liveWidget) {
		return {
			info,
			seo,
			policies,
			pathname,
			searchTopics,
			searchString,
			exploreHasContent,
			liveHasContent,
			liveWidget
		};
	}
	throw error(404, 'Not found');
}