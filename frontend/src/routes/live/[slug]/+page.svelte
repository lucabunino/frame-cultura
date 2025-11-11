<script>
import { PortableText } from '@portabletext/svelte'
import { urlFor } from "$lib/utils/image";
import { formatDate, isPast, isOngoing, isUpcoming } from '$lib/utils/date';
import { formatAuthorName } from '$lib/utils/author';
import { register } from 'swiper/element/bundle';register();
import { entersViewport } from '$lib/utils/entersViewport.js';
import { groupMultiAccordions } from '$lib/utils/accordion.js';
import { slide } from 'svelte/transition';
import { onDestroy, onMount } from 'svelte';
import { getHeader } from '$lib/stores/header.svelte';
import OrganizationSmall from '$lib/components/OrganizationSmall.svelte';
import Live from '$lib/components/Live.svelte';
import Event from '$lib/components/Event.svelte';
import Related from '$lib/components/Related.svelte';
import ProductionLive from '$lib/components/ProductionLive.svelte';
import DownloadTextStyle from '$lib/components/portableTextStyles/DownloadTextStyle.svelte';
import AccordionTextStyle from '$lib/components/portableTextStyles/AccordionTextStyle.svelte';
import PlainTextStyle from '$lib/components/portableTextStyles/PlainTextStyle.svelte';
let header = getHeader()
let { data } = $props();
const event = data.event
let domLoaded = $state(false)
let swiperLiveEl = $state(undefined)
let displayAnchor = $state(false)

// Lifecycle
onMount(() => { if (event.horizontalCover) {
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
	{#if data.seo.SEOTitle}<title>{data.seo.SEOTitle} — {event.title}</title>{/if}
	{#if event.SEODescription}<meta name="description" content={event.SEODescription}>{/if}
	{#if event.SEOHidden}
		<meta name="robots" content="index,follow">
		<meta name="robots" content="noindex, nofollow" />
	{/if}
	{#if data.seo.SEOTitle}<meta property="og:title" content={`${data.seo.SEOTitle} — ${event.title}`}>{/if}
	{#if event.SEODescription}<meta property="og:description" content={event.SEODescription}>{/if}
	{#if event.cover}<meta property="og:image" content={urlFor(event.cover).width(1200).url()}>{/if}
	{#if data.seo.SEOTitle}<meta property="og:site_name" content={`${data.seo.SEOTitle} — ${event.title}`}>{/if}
</svelte:head>

{#snippet eventContent(event)}
	<h1 class="jost-74 uppercase">{event.title}</h1>
	{#if event.subtitle}<h2 class="jost-45 mobile-jost-27 subtitle">{event.subtitle}</h2>{/if}
	{#if event.city || event.format || event.accessCtaDisplay || isUpcoming(event.start, event.end) || isOngoing(event.start, event.end)}
		<div class="tags">
			{#if isUpcoming(event.start, event.end)}
				<span class="tag upcoming">In programma</span>
			{/if}
			{#if isOngoing(event.start, event.end)}
				<span class="tag ongoing">In corso</span>
			{/if}
			{#if event.format}
				<a class="tag" href="/cerca?search={event.format.title}">{event.format.title}</a>
			{/if}
			{#if event.city}
				<a class="tag" href="/cerca?search={event.city.title}">{event.city.title}</a>
			{/if}
			{#if event.accessTagDisplay && event.accessTagLabel}
				<span class="tag bg-gray customTag"
				style={event.accessColor ? `background-color: ${event.accessColor.hex}; color: var(--white);` : ""}
				>{event.accessTagLabel}</span>
			{/if}
		</div>
	{/if}
	<time>{formatDate(event.start, event.end)}</time>
	{#if event.location || event.city}
		<p class="place">
			{#if event.location}{event.location}{/if}{#if event.city}{#if event.location}{@html ", "}{/if}{event.city.title}{/if}
		</p>
	{/if}
	{#if event.adress}
		{#if event.adressLink}
			<a class="underline hover-gray" href={event.adressLink} target="_blank" rel="noopener noreferrer">{event.adress}</a>
		{:else}
			<p>{event.adress}</p>
		{/if}
	{/if}
	{#if event.people}
		<div class="people">
			{#each event.people.clusters as cluster, i}
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
	{#if event.production}
		<div class="production">
			<h4 class="jost-12 uppercase bold">Video dell'evento</h4>
			<ProductionLive production={event.production} placeholder={data.info.placeholder}/>
		</div>
	{/if}
	{#if event.body}
		<div class="body jost-21">
			<PortableText
			value={groupMultiAccordions(event.body)}
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
		{#if event.accessCtaDisplay && event.accessCtaLink && event.accessCtaLabel}
			<a class="access relative btn bg-gray"
			class:withLive={data.liveWidget && isPast(data.liveWidget?.liveWidget?.displayStart)}
			href={event.accessCtaLink} target="_blank" rel="noopener noreferrer"
			style={event.accessColor ? "background-color: " + event.accessColor.hex + "; color: white;" : ""}
			>{event.accessCtaLabel}</a>
		{/if}
	{/if}
	{#if event.organizations}
		<div class="organizations">
			{#each event.organizations.clusters as cluster, i}
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

<section id={event._type} class={event.horizontalCover ? "marginTop" : ""}>
	{#if event._type == "event"}
		<div class="left">
			{@render eventContent(event)}
		</div>
		<div class="right">
			<img class="cover _5-7" src={urlFor(event.cover)} alt="">
		</div>
	{:else if event._type == "eventSerie"}
		{#if event.horizontalCover}
			<img class="hero _21-9" src={urlFor(event.horizontalCover)} alt="">
		{/if}
		<div class="content-wrapper">
			<div class="content">
				{@render eventContent(event)}
			</div>
		</div>
		{#if event.events}
			<div id="eventi" class="events-wrapper"
			use:entersViewport={{ onVisible: showAnchor, onHidden: hideAnchor }}
			>
				<h4 class="jost-12 uppercase bold">Tutti gli appuntamenti</h4>
				<swiper-container class="events"
				bind:this={swiperLiveEl}
				init={false}
				class:invisible={!domLoaded}
				loop={false}
				space-between={4}
				grabCursor={true}
				free-mode={false}
				mousewheel-force-to-axis={true}
				>
					{#each event.events as event, i}
						<swiper-slide>
							<Event event={event} slider={true}/>
						</swiper-slide>
					{/each}
				</swiper-container>
			</div>
			{#if displayAnchor}
				<a class="access shadow btn bg-gray"
				class:withLive={data.liveWidget && isPast(data.liveWidget?.liveWidget?.displayStart)}
				href=#eventi
				style={event.detailColor ? "background-color: " + event.detailColor.hex + "; color: white;" : ""}
				transition:slide={{ axis: "y", duration: 300 }}
				>Tutti gli appuntamenti ↓</a>
			{/if}
		{/if}
	{/if}
</section>
<a class="btn bg-gray back" href="/live">Torna a: live</a>
{#if event.live && isPast(event.live.displayStart)}
	<Live live={event.live} />
{/if}
{#if event.accessCtaDisplay && event.accessCtaLink && event.accessCtaLabel}
	<a class="access static shadow btn bg-gray"
	class:withLive={data.liveWidget && isPast(data.liveWidget?.liveWidget?.displayStart)}
	href={event.accessCtaLink} target="_blank" rel="noopener noreferrer"
	style={event.accessColor ? "background-color: " + event.accessColor.hex + "; color: white;" : ""}
	>{event.accessCtaLabel}</a>
{/if}
{#if event.related}
	<Related related={event.related}/>
{/if}

<style>
/* Event */
#event {
	display: grid;
	grid-template-columns: repeat(10, 1fr);
	padding: var(--margin);
	gap: var(--gutter);
}
#event .left {
	grid-column: 1 / span 6;
}
#event .left>*:not(h1):not(h2) {
	max-width: 700px;
}
#event .right {
	grid-column: 7 / span 4;
	margin-left: 1rem;
}
#event .right img {
	max-height: 80vh;
	height: 100%;
	width: auto;
	justify-self: right;
	object-fit: contain;
}
@media screen and (max-width: 1440px) {
	#event .right img {
		width: 100%;
		height: unset;
		max-height: unset;
	}

}
@media screen and (max-width: 800px) {
	#event {
		display: flex;
		flex-direction: column-reverse;
		padding-top: 0;
	}
	#event .right {
		margin-left: unset;
	}
	#event .right img {
		max-height: unset;
		width: 100%;
		justify-self: unset;
		margin-bottom: 1rem;
	}
}

/* EventContent */
.tags {
	margin-top: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: .2em;
}
time {
	display: block;
	margin-top: 4rem;
}
.people {
	display: flex;
	flex-wrap: wrap;
	column-gap: var(--margin);
	row-gap: 2rem;
	padding: 2rem 0 1rem;
	margin-top: 1rem;
	border-top: solid 1px var(--black);
}
.label {
	margin-bottom: .5rem;
}
.person-container {
	display: flex;
	flex-wrap: wrap;
	column-gap: var(--margin);
	row-gap: 1rem;
}
.person {
	display: flex;
	align-items: center;
	gap: .7rem;
}
a.person:hover {
	color: var(--darkGray);
}
.person img {
	width: 1.5em;
}
.production {
	margin-top: 1rem;
	padding: 2rem 0 1rem;
	border-top: solid 1px var(--black);
}
.production h4 {
	margin-bottom: 1rem;
}
.body {
	margin-top: 1rem;
	padding-top: 1rem;
	border-top: solid 1px var(--black);
}
.organizations {
	margin-top: 8rem;
	display: flex;
	flex-direction: column;
	gap: 4rem;
}
.organization-container {
	display: flex;
	flex-wrap: wrap;
	column-gap: var(--margin);
	row-gap: 1rem;
}
@media screen and (max-width: 800px) {
	.tags {
		margin-top: 1rem;
		display: flex;
		flex-wrap: wrap;
		gap: .2em;
	}
	time {
		display: block;
		margin-top: 4rem;
	}
	.people {
		flex-direction: column;
	}
	.label {
		margin-bottom: .5rem;
	}
	.person-container {
		display: flex;
		flex-wrap: wrap;
		column-gap: var(--margin);
		row-gap: 1rem;
	}
	.person {
		display: flex;
		align-items: center;
		gap: .7rem;
	}
	a.person:hover {
		color: var(--darkGray);
	}
	.person img {
		width: 1.5em;
	}
	.production {
		margin-top: 1rem;
		padding: 2rem 0 1rem;
		border-top: solid 1px var(--black);
	}
	.production h4 {
		margin-bottom: 1rem;
	}
	.body {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: solid 1px var(--black);
	}
	.organizations {
		margin-top: 8rem;
		display: flex;
		flex-direction: column;
		gap: 4rem;
	}
	.organization-container {
		display: flex;
		flex-wrap: wrap;
		column-gap: var(--margin);
		row-gap: 1rem;
	}
}

/* Serie */
#eventSerie {
	display: block;
}
#eventSerie.marginTop {
	margin-top: calc((var(--margin) * 2 + 6rem)*-1);
}
#eventSerie .hero {
	width: 100%;
	min-height: 500px;
	margin-bottom: var(--margin);
	object-fit: cover;
}
#eventSerie .content-wrapper {
	display: grid;
	grid-template-columns: repeat(10, 1fr);
	padding: var(--margin);
	gap: var(--gutter);
}
#eventSerie .content {
	grid-column: 1 / span 6;
}
.events-wrapper {
	margin-top: 4rem;
	padding: var(--margin);
}
.events {
	margin: 2rem calc(var(--margin)*-1) 4rem;
	display: flex;
}
@media screen and (max-width: 1280px) {
	#eventSerie .content {
		grid-column: 1 / span 8;
	}
}
@media screen and (max-width: 800px) {
	#eventSerie .content {
		grid-column: 1 / span 10;
	}
}
/* Back */
.back {
	margin-top: 8rem;
	margin-left: var(--margin);
}
.access {
	position: fixed;
	left: 50%;
	bottom: var(--margin);
	z-index: 2;
	min-width: 250px;
	text-align: center;
	transform: translateX(-50%);
}
.access.relative {
	position: static;
	transform: unset;
	margin-top: 2rem;
	left: unset;
	bottom: unset;
}
@media screen and (max-width: 1280px) {
	.access {
		left: var(--margin);
		transform: unset;
	}
}
@media screen and (max-width: 800px) {
	.access {
		width: calc(100% - var(--margin));
		left: 50%;
		transform: translateX(-50%);
	}
	.access.withLive {
		bottom: calc(var(--liveHeight) + var(--margin) + .5rem);
	}
}
</style>