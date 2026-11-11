import { getLayoutData } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

// Don't read `url` here: it makes SvelteKit re-run this load (and re-send
// ~25KB of layout data) on every navigation. Use `page.url` in components.
export async function load({ setHeaders }) {
    // Cache SSR HTML + __data.json at Vercel's edge: cache hits don't hit the
    // function, so they don't count as Fast Origin Transfer. Content may be up
    // to 15min stale; stale copies are served while revalidating in background.
    // Don't call setHeaders('cache-control') in child loads — SvelteKit throws on duplicates.
    setHeaders({
        'cache-control': 'public, max-age=0, s-maxage=900, stale-while-revalidate=86400'
    });

    const data = await getLayoutData();

    if (!data.info || !data.seo) {
        throw error(404, 'Configuration not found');
    }

    return data;
}

// import { getMenuStories, getInfo, getSeo, getPolicies, getExploreHasContent, getLiveHasContent, getLiveWidget } from '$lib/utils/sanity';
// import { error } from '@sveltejs/kit';

// export async function load({ url }) {
// 	const info = await getInfo();
// 	const seo = await getSeo();
// 	const policies = await getPolicies();
// 	const exploreHasContent = await getExploreHasContent();
// 	const liveHasContent = await getLiveHasContent();
// 	const liveWidget = await getLiveWidget();
// 	const stories = await getMenuStories();
// 	const { pathname } = url
// 	const searchTopics = url.searchParams.getAll('topic');
// 	const searchString = url.searchParams.get('search');
// 	if (info, seo, policies, pathname, liveWidget, stories) {
// 		return {
// 			info,
// 			seo,
// 			policies,
// 			pathname,
// 			searchTopics,
// 			searchString,
// 			exploreHasContent,
// 			liveHasContent,
// 			liveWidget,
// 			stories
// 		};
// 	}
// 	throw error(404, 'Not found');
// }