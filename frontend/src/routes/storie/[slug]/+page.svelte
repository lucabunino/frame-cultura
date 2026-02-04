<script>
import { PortableText } from '@portabletext/svelte'
import { urlFor } from "$lib/utils/image";
import { formatDateNumbers, isPast, isOngoing, isUpcoming } from '$lib/utils/date';
import { formatAuthorName } from '$lib/utils/author';
import { register } from 'swiper/element/bundle';register();
import { slide } from 'svelte/transition';
import { onDestroy, onMount } from 'svelte';
import { getHeader } from '$lib/stores/header.svelte';
import OrganizationSmall from '$lib/components/OrganizationSmall.svelte';
import Live from '$lib/components/Live.svelte';
import Event from '$lib/components/Event.svelte';
import Related from '$lib/components/Related.svelte';
import ProductionLive from '$lib/components/ProductionLive.svelte';
import PlainTextStyle from '$lib/components/portableTextStyles/PlainTextStyle.svelte';
import StoryGridTextStyle from '$lib/components/portableTextStyles/StoryGridTextStyle.svelte';
import StoryTextStyle from '$lib/components/portableTextStyles/StoryTextStyle.svelte';
import StorySingleTextStyle from '$lib/components/portableTextStyles/StorySingleTextStyle.svelte';
import StorySliderTextStyle from '$lib/components/portableTextStyles/StorySliderTextStyle.svelte';
let header = getHeader()
let { data } = $props();
const story = data.story
let domLoaded = $state(false)
let swiperLiveEl = $state(undefined)
let displayAnchor = $state(false)

// Lifecycle
onMount(() => { if (story.horizontalCover) {
	header.setInverted(true)
	header.setInitialInverted(true)
} })
onDestroy(() => {
	header.setInverted(false)
	header.setInitialInverted(false)
})
$effect(() => {
	if (swiperLiveEl) {
		const swiperParams = {
			breakpoints: {
				0: {
					slidesPerView: 1.5,
					slidesOffsetBefore: 15,
					slidesOffsetAfter: 15,
				},
				800: {
					slidesPerView: 2.5,
					slidesOffsetBefore: 15,
					slidesOffsetAfter: 15,
				},
				1200: {
					slidesPerView: 3.5,
					slidesOffsetBefore: 21,
					slidesOffsetAfter: 21,
				},
				1513: {
					slidesPerView: 4.5,
					slidesOffsetBefore: 21,
					slidesOffsetAfter: 21,
				},
				1800: {
					slidesPerView: 5.5,
					slidesOffsetBefore: 21,
					slidesOffsetAfter: 21,
				},
			},
		};
		Object.assign(swiperLiveEl, swiperParams);
		swiperLiveEl.initialize();
	}
	domLoaded = true
})
// Functions
function showAnchor() {
	displayAnchor = false;
}
function hideAnchor() {
	displayAnchor = true;
}
</script>

<svelte:head>
	{#if data.seo.SEOTitle}<title>{data.seo.SEOTitle} — {story.title}</title>{/if}
	{#if story.SEODescription}<meta name="description" content={story.SEODescription}>{/if}
	{#if story.SEOHidden}
		<meta name="robots" content="index,follow">
		<meta name="robots" content="noindex, nofollow" />
	{/if}
	{#if data.seo.SEOTitle}<meta property="og:title" content={`${data.seo.SEOTitle} — ${story.title}`}>{/if}
	{#if story.SEODescription}<meta property="og:description" content={story.SEODescription}>{/if}
	{#if story.cover}<meta property="og:image" content={urlFor(story.cover).width(1200).url()}>{/if}
	{#if data.seo.SEOTitle}<meta property="og:site_name" content={`${data.seo.SEOTitle} — ${story.title}`}>{/if}
</svelte:head>

<section id="hero" class="{story.cover ? 'background' : undefined}" style={story.cover ? `background-image: url(${urlFor(story.cover)});` : undefined}>
	{#if story.runningHead}
		<h2 class="jost-21 uppercase bold">{story.runningHead}</h2>
	{/if}
	<h1 class="jost-120 uppercase">{story.title}</h1>
	{#if story.intro}
		<h3 class="jost-36">{story.intro}</h3>
	{/if}
	{#if story.body || story.tableTitle}
		<div class="btns">
			{#if story.body}
				<a class="btn bg-gray" href="#body">Leggi</a>
			{/if}
			{#if story.tableTitle}
				<a class="btn bg-gray" href="#table">{story.tableTitle}</a>
			{/if}
		</div>
	{/if}
</section>

{#if story.body}
	<section id="body" class="body jost-24">
		<PortableText
		value={story.body}
		components={{
		block: {
			normal: StoryTextStyle,
			h3: StoryTextStyle,
		},
		listItem: StoryTextStyle,
		marks: {
			link: StoryTextStyle,
		},
		types: {
			slider: StorySliderTextStyle,
			grid: StoryGridTextStyle,
			single: StorySingleTextStyle,
		}
		}}/>
	</section>
{/if}

{#snippet rowContent(row)}
	<time class="date" datetime="">{formatDateNumbers(row.date)}</time>
	<div class="titles jost-24 bold">
		<h4 class="uppercase">{row.title}</h4>
		{#if row.subtitle}<h5>{row.subtitle}</h5>{/if}
	</div>
	{#if row.body}
		<div class="body">
			<PortableText
			value={row.body}
			components={{
			block: {
				normal: PlainTextStyle,
			},
			listItem: PlainTextStyle,
			marks: {
				link: PlainTextStyle,
			}
			}}/>
		</div>
	{/if}
	{#if row.image}
		<img class="img" src={urlFor(row.image)} alt="Copertina per {row.title}">
	{/if}
{/snippet}
{#if story.tableTitle && story.tableRows}
    <section id="table" class="jost-18">
        <h3 class="jost-54">{story.tableTitle}</h3>
        {#each story.tableRows as row}
            {@const ref = row.internalReference}
            {#if ref || row.externalLink}
                {@const internalHref = ref ? `/${{
                    video: 'esplora',
                    playlist: 'esplora',
                    podcast: 'esplora',
                    event: 'live',
                    eventSerie: 'live',
                    episode: 'esplora'
                }[ref._type] || 'content'}/${ref.slug?.current || ref.slug}` : null}
                <a class="row" href={internalHref || row.externalLink}
                target={row.externalLink ? "_blank" : undefined}
                rel={row.externalLink ? "noopener noreferrer" : undefined}
                >
                    {@render rowContent(row)}
                </a>
            {:else}
                <div class="row">
                    {@render rowContent(row)}
                </div>
            {/if}
        {/each}
    </section>
{/if}






{#snippet eventContent(event)}
	<h1 class="jost-74 uppercase">{story.title}</h1>
	{#if story.subtitle}<h2 class="jost-45 mobile-jost-27 subtitle">{story.subtitle}</h2>{/if}
	{#if story.city || story.format || story.accessCtaDisplay || isUpcoming(story.start, story.end) || isOngoing(story.start, story.end)}
		<div class="tags">
			{#if isUpcoming(story.start, story.end)}
				<span class="tag upcoming">In programma</span>
			{/if}
			{#if isOngoing(story.start, story.end)}
				<span class="tag ongoing">In corso</span>
			{/if}
			{#if story.format}
				<a class="tag" href="/cerca?search={story.format.title}">{story.format.title}</a>
			{/if}
			{#if story.city}
				<a class="tag" href="/cerca?search={story.city.title}">{story.city.title}</a>
			{/if}
			{#if story.accessTagDisplay && story.accessTagLabel}
				<span class="tag bg-gray customTag"
				style={story.accessColor ? `background-color: ${story.accessColor.hex}; color: var(--white);` : ""}
				>{story.accessTagLabel}</span>
			{/if}
		</div>
	{/if}
	<time>{formatDate(story.start, story.end)}</time>
	{#if story.location || story.city}
		<p class="place">
			{#if story.location}{story.location}{/if}{#if story.city}{#if story.location}{@html ", "}{/if}{story.city.title}{/if}
		</p>
	{/if}
	{#if story.adress}
		{#if story.adressLink}
			<a class="underline hover-gray" href={story.adressLink} target="_blank" rel="noopener noreferrer">{story.adress}</a>
		{:else}
			<p>{story.adress}</p>
		{/if}
	{/if}
	{#if story.people}
		<div class="people">
			{#each story.people.clusters as cluster, i}
				<div class="cluster">
					<p class="label jost-12 uppercase bold">{cluster.label}</p>
					<div class="person-container">
						{#each cluster.people as person, j}
							{#if person.isAuthor}
								<a class="person" href="/autori/{person.slug.current}">
									<img class="portrait" src={urlFor(person.portrait ? person.portrait : data.info.placeholder)} alt="">
									<h2 class="jost-18">{formatAuthorName(person)}</h2>
								</a>
							{:else}
								<div class="person">
									<img class="portrait" src={urlFor(person.portrait ? person.portrait : data.info.placeholder)} alt="">
									<h2 class="jost-18">{formatAuthorName(person)}</h2>
								</div>
							{/if}
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
	{#if story.production}
		<div class="production">
			<h4 class="jost-12 uppercase bold">Video dell'evento</h4>
			<ProductionLive production={story.production} placeholder={data.info.placeholder}/>
		</div>
	{/if}
	{#if story.body}
		<div class="body jost-21">
			<PortableText
			value={groupMultiAccordions(story.body)}
			components={{
			block: {
				normal: PlainTextStyle,
				h2: PlainTextStyle,
				h3: PlainTextStyle,
				h4: PlainTextStyle,
			},
			listItem: PlainTextStyle,
			marks: {
				link: PlainTextStyle,
			},
			types: {
				download: DownloadTextStyle,
				accordion: AccordionTextStyle,
			}
			}}/>
		</div>
		{#if story.accessCtaDisplay && story.accessCtaLink && story.accessCtaLabel}
			<a class="access relative btn bg-gray"
			class:withLive={data.liveWidget && isPast(data.liveWidget?.liveWidget?.displayStart)}
			href={story.accessCtaLink} target="_blank" rel="noopener noreferrer"
			style={story.accessColor ? "background-color: " + story.accessColor.hex + "; color: white;" : ""}
			>{story.accessCtaLabel}</a>
		{/if}
	{/if}
	{#if story.organizations}
		<div class="organizations">
			{#each story.organizations.clusters as cluster, i}
				<div class="cluster">
					<p class="label jost-12 uppercase bold">{cluster.label}</p>
					<div class="organization-container">
						{#each cluster.organizations as organization, j}
							<div class="organization">
								<OrganizationSmall organization={organization}/>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
{/snippet}

<style>
/* Hero */
#hero {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 20vh;
	margin-top: calc((var(--margin)*2 + 4rem + 2rem)*-1);
	min-height: 100svh;
	background-position: bottom;
	background-size: cover;
	text-align: center;
}
#hero.background {
	height: 150vh;
}
#hero h2 {
	margin-bottom: 4rem;
}
#hero h1 {
	max-width: 600px;
}
#hero h3 {
	margin-top: 2rem;
	max-width: 700px;
}
#hero .btns {
	margin-top: 3rem;
}

/* Body */
#body {
	padding: 3rem var(--margin);
	margin-bottom: 16rem;
	display: flex;
	flex-direction: column;
	align-items: center;
}

/* Table */
#table {
	padding: 3rem var(--margin);
}
#table .row {
	display: grid;
	grid-template-columns: repeat(10, 1fr);
	gap: calc(var(--margin)*2);
	border-bottom: solid 1px var(--black);
	padding: var(--margin) 0;
}
#table .row:first-of-type {
	margin-top: 3rem;
	border-top: solid 1px var(--black);
}
#table .row .date {
	grid-column: 1 / span 1;
}
#table .row .titles {
	grid-column: 2 / span 3;
}
#table .row .body {
	grid-column: 5 / span 3;
}
#table .row .img {
	grid-column: 8 / span 3;
}
</style>