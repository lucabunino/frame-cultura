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
    import { innerWidth } from 'svelte/reactivity/window';
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

<!-- <section id="hero" class="{story.cover ? 'background' : undefined}" style={story.cover ? `background-image: url(${urlFor(story.cover)});` : undefined}> -->
 <section id="hero" class="{story.cover ? 'background' : undefined}">
	{#if story.cover}
		{#if story.coverMobile && innerWidth.current < 800}
			<img class="bg" src={urlFor(story.coverMobile).width(2560)} alt="Copertina di {story.title}">
		{:else}
			<img class="bg" src={urlFor(story.cover).width(2560)} alt="Copertina di {story.title}">
		{/if}
	{/if}
	<div class="text">
		{#if story.runningHead}
			<h2 class="jost-21 uppercase bold">{story.runningHead}</h2>
		{/if}
		<h1 class="jost-120 uppercase">{story.title}</h1>
		{#if story.intro}
			<h3 class="jost-36 leading-110">{story.intro}</h3>
		{/if}
		{#if story.body || story.tableTitle}
			<div class="btns">
				{#if story.body && story.bodyButtonLabel}
					<a class="btn bg-gray" href="#body">{story.bodyButtonLabel}</a>
				{/if}
				{#if story.tableTitle && story.tableButtonLabel}
					<a class="btn bg-gray" href="#table">{story.tableButtonLabel}</a>
				{/if}
			</div>
		{/if}
	</div>
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
        <h3 class="jost-54 mobile-jost-22">{story.tableTitle}</h3>
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


<style>
/* Hero */
#hero {
	margin-top: calc((var(--margin)*2 + 4rem + 2rem)*-1);
	min-height: 100svh;
	height: auto;
}
#hero .bg {
	z-index: 30;
	width: 100%;
	min-height: 100vh;
	object-fit: cover;
}
#hero .text {
	padding: 20vh var(--margin) 10vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	position: absolute;
	top: 0;
	left: 50%;
	transform: translateX(-50%);
	width: stretch;
}
#hero h2 {

}
#hero h1 {
	max-width: 600px;
	margin-top: 4rem;
}
#hero h3 {
	margin-top: 2rem;
	max-width: 800px;
}
#hero .btns {
	margin-top: 3rem;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: .5em;
}
@media screen and (max-width: 800px) {
	#hero {
		min-height: unset;
		margin-top: -2rem;
	}
	#hero .bg {
		min-height: unset;
		height: 35vh;
	}
	#hero .text {
		padding: 0 0 4rem;
		margin: 3rem var(--margin) 4rem;
		position: relative;
		align-items: flex-start;
		text-align: left;
		border-bottom: solid 1px var(--black);
		left: unset;
		transform: unset;
	}
	#hero h1 {
		margin-top: 0;
	}
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
	column-gap: calc(var(--margin)*2);
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
	width: 70%;
	margin-left: auto;
	min-width: 200px;
}

@media screen and (max-width: 800px) {
	#table .row {
		padding: 2rem 0;
	}
	#table .row .date {
		grid-column: 1 / span 2;
	}
	#table .row .titles {
		grid-column: 3 / span 8;
	}
	#table .row .body {
		grid-column: 3 / span 8;
		margin-bottom: var(--margin);
	}
	#table .row .img {
		grid-column: 3 / span 8;
		margin-right: auto;
		margin-left: unset;
	}
}

@media screen and (max-width: 500px) {
	#table .row .date {
		grid-column: 1 / span 10;
		margin-top: 1rem;
	}
	#table .row .titles {
		grid-column: 1 / span 10;
	}
	#table .row .body {
		grid-column: 1 / span 10;
		margin-top: 2rem;
		margin-bottom: 4rem;
	}
	#table .row .img {
		grid-column: 1 / span 10;
		grid-row: 1;
		width: 100%;
		margin-right: unset;
		margin-left: unset;
	}
}
</style>