import { createClient } from '@sanity/client';
import { PUBLIC_SANITY_DATASET, PUBLIC_SANITY_PROJECT_ID } from '$env/static/public';

if (!PUBLIC_SANITY_PROJECT_ID || !PUBLIC_SANITY_DATASET) {
	throw new Error('Did you forget to run sanity init --env?');
}

export const client = createClient({
	projectId: PUBLIC_SANITY_PROJECT_ID,
	dataset: PUBLIC_SANITY_DATASET,
	useCdn: true,
	apiVersion: '2025-07-28',
});

// Lean projections for list views — only fields used by Production.svelte,
// Event.svelte and author cards. Avoid `{ ... }` here: full author docs
// (bio, teamBody, authorBody) made list payloads several MB.
const personCard = `{ _id, name, surname, alias, slug, isAuthor }`
const productionCard = `{
	_id, _type, title, subtitle, slug, cover,
	// Production.svelte shows names only when < 5 authors, else "Autori vari" — 5 is enough
	"authors": authors[0...5]->${personCard},
	authorsPreview[]->${personCard}
}`
const eventCard = `{
	_id, _type, title, subtitle, slug, cover, start, end, abstract,
	accessCtaDisplay, accessTagDisplay, accessTagLabel, accessColor,
	peoplePreview[]->${personCard},
	format->{ title, slug },
	city->{ title, slug }
}`
const authorCard = `{ _id, name, surname, alias, slug, portrait, occupation, showOccupation }`

export async function getLayoutData() {
    return await client.fetch(`{
        "info": *[_type == "info" && !(_id in path('drafts.**'))][0] { ... },
        "seo": *[_type == "seo" && !(_id in path('drafts.**'))][0] {
            SEOTitle, SEODescription, SEOKeywords, SEOImage
        },
        "policies": *[_type == "policy" && !(_id in path('drafts.**'))] { ... },
        "exploreHasContent": count(*[_type == "explore" && !(_id in path('drafts.**'))][0].exploreSelection) > 0,
        "liveHasContent": count(*[_type == "live" && !(_id in path('drafts.**'))][0].liveSelection) > 0,
        "liveWidget": *[_type == "live" && !(_id in path('drafts.**'))][0].liveWidget->{ ... },
        "stories": *[_type == "story" && visibleMenu == true && !(_id in path('drafts.**'))] { title, slug }
    }`);
}

export async function getSeo() {
	return await client.fetch(`
		*[_type == "seo" && !(_id in path('drafts.**'))][0] {
			SEOTitle,
			SEODescription,
			SEOKeywords,
			SEOImage,
		}`
	);
}
export async function getInfo() {
	return await client.fetch(`
		*[_type == "info" && !(_id in path('drafts.**'))][0] { ... }`
	);
}
export async function getPolicies() {
	return await client.fetch(`
		*[_type == "policy" && !(_id in path('drafts.**'))] { ... }`
	);
}
export async function getPolicy(slug) {
	return await client.fetch(`
		*[_type == "policy" && kind == $slug && !(_id in path('drafts.**'))][0] { ... }`, { slug });
}
export async function getHomepage() {
	return await client.fetch(`
		*[_type == "homepage" && !(_id in path('drafts.**'))][0] { ...,
			highlights[] { ...,
				ctaReference-> { ... }
			},
			liveSelection[]-> { ...,
				peoplePreview[]-> { ... },
				format-> { ... },
				topics[]-> { ... },
				city-> { ... }
			},
			productionsSelection[]-> { ... },
			authorsSelection[]-> { ...,
				highlightedContents[]-> { ... }
			},
			preFooter { ...,
				ctaReference-> { ... }
			},
		}`
	);
}
export async function getExploreSelection() {
	return await client.fetch(`
		*[_type == "explore" && !(_id in path('drafts.**'))][0] {
			exploreSelection[]-> {
				...,
				authors[]->{
					...,
				},
				topics[]->{
					...,
				}
			},
		}`
	);
}
export async function getExploreHasContent() {
	const result = await client.fetch(`
		*[_type == "explore" && !(_id in path('drafts.**'))][0]{
			"hasContent": count(exploreSelection) > 0
		}
	`);
	return result?.hasContent ?? false;
}
export async function getExplore(medias = [], topic = null, search) {
  const hasSearch = Boolean(search && search.trim());
  const searchWildcard = hasSearch ? `*${search}*` : null;
  const baseQuery = `
    *[
      _type in ["episode", "podcast", "video", "playlist"]
      && !(_id in path('drafts.**'))
      && visible == true
      ${medias?.length ? `&& _type in $medias` : ``}
      ${topic ? `&& count(topics[@->slug.current == $topic]) > 0` : ``}
      ${hasSearch ? `
        && (
          title match $search ||
          subtitle match $search ||
          body[].children[].text match $search ||
          authors[]->name match $search ||
          authors[]->surname match $search ||
          authors[]->alias match $search ||
          topics[]->title match $search ||
          videos[]->title match $search ||
          videos[]->subtitle match $search ||
          videos[]->body[].children[].text match $search ||
          episodes[]->title match $search ||
          episodes[]->subtitle match $search ||
          episodes[]->body[].children[].text match $search
        )
      ` : ``}
    ] | order(hierarchy desc, date desc, title asc) ${productionCard}
  `;
  return client.fetch(baseQuery, { medias, topic, search: searchWildcard });
}
export async function getExploreTopics() {
	return await client.fetch(`
		*[
			_type == "topic"
			&& !(_id in path('drafts.**'))
			&& _id in *[
				_type in ["episode", "podcast", "video", "playlist"]
				&& !(_id in path('drafts.**'))
				&& visible == true
			].topics[]._ref
		] | order(title asc)
	`);
}
export async function getProduction(slug) {
	return await client.fetch(`
		*[_type in ["episode", "podcast", "video", "playlist"] && slug.current == $slug][0] { ...,
			topics[]-> { ... },
			authors[]-> { ... },
			episodes[]-> { ...,
				authors[]-> { ... },
			},
			videos[]-> { ...,
				authors[]-> { ... },
			},
			related[]-> { ...,
				authors[]->{ ... },
				authorsPreview[]-> { ... },
				peoplePreview[]-> { ... },
				topics[]-> { ... },
				format-> { ... },
				city-> { ... },
			},
			"podcasts": *[_type == "podcast" && references(^._id)]{ ... },
			"playlists": *[_type == "playlist" && references(^._id)]{ ... },
		}`, { slug });
}
export async function getLiveSelection() {
	return await client.fetch(`
		*[_type == "live" && !(_id in path('drafts.**'))][0] {
			liveIntro,
			liveSelection[]-> { ...,
				peoplePreview[]-> { ... },
				topics[]-> { ... },
				format-> { ... },
				city-> { ... },
			},
		}`
	);
}
export async function getLiveHasContent() {
	const result = await client.fetch(`
		*[_type == "live" && !(_id in path('drafts.**'))][0]{
			"hasContent": count(liveSelection) > 0
		}
	`);
	return result?.hasContent ?? false;
}
export async function getLiveWidget() {
	return await client.fetch(`
		*[_type == "live" && !(_id in path('drafts.**'))][0]{
			liveWidget->{...}
		}
	`);
}
export async function getLiveStreaming(slug) {
	return await client.fetch(`
		*[_type == "eventLive" && slug.current == $slug][0]{
			...
		}`, { slug });
}
export async function getLiveTopics() {
	return await client.fetch(`
		*[
			_type == "topic"
			&& !(_id in path('drafts.**'))
			&& _id in *[
				_type in ["event", "eventSerie"]
				&& !(_id in path('drafts.**'))
				&& visible == true
			].topics[]._ref
		] | order(title asc)
	`);
}
export async function getLiveFormats() {
	return await client.fetch(`
		*[
		_type == "format"
		&& !(_id in path('drafts.**'))
		&& _id in *[
			_type in ["event", "eventSerie"]
			&& !(_id in path('drafts.**'))
			&& visible == true
		].format._ref
		] | order(title asc)
	`);
}
export async function getLiveCities() {
	return await client.fetch(`
		*[
		_type == "city"
		&& !(_id in path('drafts.**'))
		&& _id in *[
			_type in ["event", "eventSerie"]
			&& !(_id in path('drafts.**'))
			&& visible == true
		].city._ref
		] | order(title asc)
	`);
}
export async function getLive(format = null, city = null, topic = null, search) {
	const hasSearch = Boolean(search && search.trim());
  	const searchWildcard = hasSearch ? `*${search}*` : null;
	const baseQuery = `
		*[_type in ["event", "eventSerie"]
		&& visible == true
		&& !(_id in path('drafts.**'))
		${format ? `&& format->slug.current == $format` : ``}
  		${city ? `&& city->slug.current == $city` : ``}
		${topic ? `&& count(topics[@->slug.current == $topic]) > 0` : ``}
		${hasSearch ? `
			&& (
				title match $search ||
				subtitle match $search ||
				body[].children[].text match $search ||
				people.clusters[].people[].person->name match $search ||
				people.clusters[].people[].person->surname match $search ||
				people.clusters[].people[].person->alias match $search ||
				topics[]->title match $search ||
				format->title match $search ||
				city->title match $search
			)
		` : ``}
		] | order(hierarchy desc, start desc, title asc) ${eventCard}
	`;
	return client.fetch(baseQuery, { format, city, topic, search: searchWildcard });
}
export async function getEvent(slug) {
	return await client.fetch(`
		*[_type in ["event", "eventSerie"] && slug.current == $slug][0] { ...,
			people {
				clusters[] { ...,
					people[]->{...}
				}
			},
			organizations {
				clusters[] { ...,
					organizations[]->{...}
				}
			},
			events[]-> {...,
				peoplePreview[]-> { ... },
				topics[]-> { ... },
				format-> { ... },
				city-> { ... },
				authors[]-> { ... },
			},
			topics[]-> { ... },
			format-> { ... },
			city-> { ... },
			authors[]-> { ... },
			live-> { ... },
			production-> { ... },
			related[]-> { ...,
				authors[]->{ ... },
				authorsPreview[]-> { ... },
				peoplePreview[]-> { ... },
				topics[]-> { ... },
				format-> { ... },
				city-> { ... },
			},
		}`, { slug });
}
export async function getAuthors(search) {
  const hasSearch = Boolean(search && search.trim());
  const searchTerms = hasSearch ? search.trim() : null;

  if (!hasSearch) {
    return client.fetch(`*[_type == "person" && isAuthor == true && !(_id in path('drafts.**'))] | order(lower(surname) asc) ${authorCard}`);
  }

  const baseQuery = `
    *[
      _type == "person" &&
      isAuthor == true &&
      !(_id in path('drafts.**')) &&
      (
        // Usiamo l'asterisco nel filtro per trovare "Sing" in "Singer"
        name match $search + "*" || 
        surname match $search + "*" || 
        (name + " " + surname) match $search + "*" ||
        alias match $search + "*" ||
        bio match $search + "*"
      )
    ] | order(
      select(
        // 1. Priorità massima: Match esatto
        (name + " " + surname) == $search => 0,

        // 2. Priorità alta: Inizia esattamente con quello che hai scritto
        name match $search + "*" || surname match $search + "*" => 1,

        // 3. Tutto il resto
        2
      ) asc,
      lower(surname) asc
    ) ${authorCard}
  `;

  return client.fetch(baseQuery, { search: searchTerms });
}

export async function getAuthor(slug) {
	return await client.fetch(`
		*[_type == "person" && isAuthor == true && slug.current == $slug][0] { ...,
			highlightedContents[]-> { ...,
				authors[]-> { ... },
			},
			"audios": *[(_type in ["episode", "podcast"]) && references(^._id) && visibleAuthor == true] { ...,
				authors[]-> { ... },
			} | order(hierarchy desc, date desc, title asc),
			"videos": *[(_type in ["video", "playlist"]) && references(^._id) && visibleAuthor == true] { ...,
				authors[]-> { ... },
			} | order(hierarchy desc, date desc, title asc),
			"events": *[_type in ["event", "eventSerie"] && visible == true && references(^._id, [], "people.clusters[].people[].person")] | order(start desc) { ...,
				peoplePreview[]-> { ... },
				topics[]-> { ... },
				format-> { ... },
				city-> { ... },
				authors[]-> { ... },
			},
		}`, { slug });
}
export async function getTeamMember(slug) {
	return await client.fetch(`
		*[_type == "person" && isTeam == true && slug.current == $slug][0] { ..., }`, { slug });
}
export async function getAbout() {
	return await client.fetch(`
		*[_type == "about" && !(_id in path('drafts.**'))][0] { ...,
			body[]{ ...,
				_type match "person*" => {
					_type,
					"person": @->{ ... }
				}
			}
		}`
	);
}
export async function getNetwork() {
	return await client.fetch(`
		*[_type == "network" && !(_id in path('drafts.**'))][0] { ...,
			institutions[]{ ... },
			network[]{ ...,
				organizations[]-> { ... }
			},
		}`
	);
}
export async function getContact() {
	return await client.fetch(`
		*[_type == "contact" && !(_id in path('drafts.**'))][0] { ... }`
	);
}
export function fileUrl(file) {
  if (!file?.asset?._ref) return ''
  const [_, id, ext] = file.asset._ref.split('-')
  return `https://cdn.sanity.io/files/${client.config().projectId}/${client.config().dataset}/${id}.${ext}`
}
export async function getMenuStories() {
	return await client.fetch(`
		*[_type == "story" && visibleMenu == true && !(_id in path('drafts.**'))] {
			title,
			slug
		}`
	);
}
export async function getStory(slug) {
	return await client.fetch(`
		*[_type in ["story"] && slug.current == $slug][0] { ...,
			body[] {
				...,
				_type == "slider" => {
					images[] {
						...,
						asset-> {
							_id,
							url,
							altText,
							description, 
							metadata {
								lqip,
								dimensions
							}
						}
					}
				},
				_type == "grid" => {
					items[] {
						...,
						internalReference-> { ...,
							authors[]-> { ... },
						},
					}
				},
				_type == "single" => {
					...,
					reference-> {
						_type,
						title,
						slug
					}
				}
			},
			tableRows[] {
                ...,
                internalReference-> {
                    _type,
                    title,
                    slug
                },
            },
		}`, { slug });
}