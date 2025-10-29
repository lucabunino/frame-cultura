<script>
import { urlFor } from "$lib/utils/image";
import { getHeader } from '$lib/stores/header.svelte';
import { register } from 'swiper/element/bundle';register();
import sliderInjectedStyle from '$lib/utils/sliderInjectedStyle.js';
import FiltersAndSearch from "$lib/components/FiltersAndSearch.svelte";
import { formatAuthorName } from "$lib/utils/author.js";
import { formatDate, isPast, isOngoing, isUpcoming } from '$lib/utils/date';
import Event from "$lib/components/Event.svelte";
import { onDestroy, onMount } from "svelte";
import { innerWidth } from 'svelte/reactivity/window';

let header = getHeader()
let { data } = $props();
let mouse = $state({y: undefined, x: undefined});
let swiperEl = $state(undefined);
let highlightTag = $state(undefined);
const swiperParams = {
	injectStyles: sliderInjectedStyle
};

// Lifecycle
onMount(() => { if (data.liveHasContent) {
	header.setInverted(true)
	header.setInitialInverted(true)
} })
onDestroy(() => {
	header.setInverted(false)
	header.setInitialInverted(false)
})
$effect(() => {
	if (swiperEl) {
		Object.assign(swiperEl, swiperParams);
		swiperEl.initialize();	
	}
})

// Functions
function onSwiperClick(e) {
	if (e.target.tagName !== 'A') {
		if (e.clientX > innerWidth.current/3*2) {
			swiperEl.swiper.slideNext()
		} else if (e.clientX < innerWidth.current/3) {
			swiperEl.swiper.slidePrev()
		}
	}
}
function onSwiperKeydown(e) {
	if (e.target.tagName !== 'A') {
		swiperEl.swiper.slideNext()
	}
}
function onSwiperHover(e) {
	if (e.target.tagName !== 'A' && swiperEl?.swiper?.slides.length > 1) {
		if (e.clientX > innerWidth.current/3*2) {
			highlightTag = 'Next'
		} else if (e.clientX < innerWidth.current/3) {
			highlightTag = 'Prev'
		}
	}
}
function onSwiperMouseLeave(e) {
	highlightTag = undefined
}
function handleMouseMove(e) {
	mouse.y = e.y
	mouse.x = e.x
}
</script>

<svelte:window onmousemove={(e) => {handleMouseMove(e)}}></svelte:window>

{#if data.liveSelection}
	<section id="liveSelection" class="cover _16-9" class:scrollable={swiperEl?.swiper?.slides.length > 1}>
		<swiper-container
		init={false}
		bind:this={swiperEl}
		pagination={{
			clickable: true
		}}
		slides-per-view={1}
		loop={true}
		autoplay={{delay: 6000, disableOnInteraction: true}}
		>
			{#each data.liveSelection as event, i}
				<swiper-slide class="event"
				onclick={(e) => {onSwiperClick(e)}}
				onmousemove={(e) => {onSwiperHover(e)}}
				onmouseleave={(e) => {onSwiperMouseLeave(e)}}
				role="button"
  				tabindex="0"
				onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSwiperKeydown(e); }}
				>
					<img class="cover"
					src={urlFor(
						event.highlightCoverMobile && innerWidth.current <= 800 ? event.highlightCoverMobile :
						event.highlightCover ? event.highlightCover :
						data.info.placeholder
						).width(2560)}
					alt="Copertina di {event.title}"
					>
					<div class="info">
						<time>{formatDate(event.start, event.end)}</time>
						<h2 class="jost-45 mobile-jost-27  uppercase bold">{event.title}</h2>
						{#if event.subtitle}<h3 class="jost-36 subtitle mobile-jost-27 bold">{event.subtitle}</h3>{/if}
						{#if event.city || event.format || event.accessTagDisplay || isUpcoming(event.start, event.end) || isOngoing(event.start, event.end)}
							<div class="tags jost-15 bold uppercase">
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
									<span class="tag customTag"
									style={event.accessColor ? `background-color: ${event.accessColor.hex}; color: var(--white);` : ""}
									>{event.accessTagLabel}</span>
								{/if}
							</div>
						{/if}
						{#if event.peoplePreview}
							<p class="people jost-18" style={!event.abstract ? "margin-top: 1em;" : ''}>Con
								{#if event.peoplePreview?.length < 4}
									{#each event.peoplePreview as person, i}
										{#if person}
											{#if person.isAuthor}
												<a class="person" href="/autori/{person.slug.current}">{formatAuthorName(person)}</a>
											{:else}
												<span class="person">{formatAuthorName(person)}</span>
											{/if}{@html event.peoplePreview.length > i+1 ? ', ' : ''}
										{/if}
									{/each}
								{:else if event.peoplePreview?.length >= 4}
									Autori vari
								{/if}
							</p>
						{/if}
						{#if event.highlightAbstract}
							<p class="abstract jost-18">{event.highlightAbstract}</p>
						{/if}
					</div>
					<div class="btns jost-15 uppercase bold">
						<a class="btn"  href="/live/{event.slug.current}">Leggi di più</a>
					</div>
					<a href="#live-intro" id="see-all" class="jost-15 mobile-jost-12 uppercase bold">Vedi tutto ↓</a>
				</swiper-slide>
			{/each}
		</swiper-container>
		{#if highlightTag}
			<span class="highlightTag btn outline" class:left={highlightTag == 'Prev'} class:right={highlightTag == 'Next'} style="top: {mouse.y}px; left: {mouse.x}px;">{highlightTag}</span>
		{/if}
	</section>
{/if} 

{#if data.liveIntro}<h3 id="live-intro" class:marginTop={data.liveSelection}>{data.liveIntro}</h3>{/if}
<FiltersAndSearch data={data}
withLive={data.liveWidget && isPast(data.liveWidget?.liveWidget?.displayStart)}
displayFilterCity={true} displayFilterTopic={true} displayFilterFormat={true} section="live" placeholder="Cerca evento"/>
{#if data.live.length > 0}
	<section id="live" class:marginTop={!data.liveSelection}>
		{#each data.live as event, i}
			<Event event={event} placeholder={data.info.placeholder}/>
		{/each}
	</section>
{:else}
	<section id="noResults">
		<p class="jost-27" style="height: 3rem;">Nessun risultato per questi parametri di ricerca</p>
	</section>
{/if}

<style>
/* Highlights */
#liveSelection {
	height: calc(100vh - var(--liveHeight) - var(--margin)*2);
	display: block;
	overflow: hidden;
}
#liveSelection swiper-container {
	height: 100%;
}
#liveSelection .cover {
	width: 100%;
	height: 100%;
	object-fit: cover;
	position: absolute;
	top: 0;
	left: 0;
	z-index: -1;
}
#liveSelection swiper-slide {
	position: relative;
}
#liveSelection.scrollable swiper-slide {
	cursor: pointer;
}
#liveSelection swiper-container::part(pagination) {
	left: unset;
	right: 0;
	bottom: 4rem;
    width: fit-content;
    padding: 0 var(--margin);
	height: calc(2.5rem + 1.25rem*1.3);
	align-content: center;
}
#liveSelection swiper-container::part(bullet) {
	background: transparent;
	border: solid 1px var(--white);
	opacity: 1;
	margin: 0 2px;
}
#liveSelection swiper-container::part(bullet-active) {
	background: var(--white);
	border: solid 1px var(--white);
	opacity: 1;
	margin: 0 2px;
}
#liveSelection .event {
	color: var(--white);
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: var(--margin);
}
#liveSelection .info {
	max-width: 700px;
}
#liveSelection time {
	display: block;
	margin-bottom: 1rem;
}
#liveSelection .tags {
	display: inline-flex;
	flex-wrap: wrap;
	column-gap: .2em;
	row-gap: .2em;
	margin: 1rem 0;
	color: var(--black);
}
#liveSelection .people {
	margin-top: 1rem;
	max-width: 600px;
}
#liveSelection .abstract {
	margin-top: 3rem;
	max-width: 600px;
}
#liveSelection .btns {
	position: absolute;
	bottom: 0;
	left: 0;
	padding: 2rem var(--margin) 4rem;
	z-index: 3;
	display: flex;
	align-items: center;
	gap: .3rem;
}
#liveSelection .btns .btn {
	display: inline-flex;
	gap: .6em;
	align-items: center;
}
.highlightTag {
	position: fixed;
	z-index: 8;
	transition: var(--transition);
	transition-property: transform;
	transition-duration: 800ms;
}
.highlightTag.right {
	transform: translateX(-100%);
}
#see-all {
	position: absolute;
	color: var(--white);
	left: 50%;
	transform: translateX(-50%);
	bottom: 4rem;
	z-index: 99;
	line-height: calc(2.5rem + 1.25rem*1.3);
}
@media screen and (max-width: 800px) {
	.highlightTag {
		display: none;
	}

}

/* Live */
#live-intro {
	text-align: center;
	margin-bottom: 6rem;
	padding: 0 var(--margin);
}
#live-intro.marginTop {
	padding-top: 6rem;
}
#live {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	column-gap: var(--margin);
	row-gap: 6rem;
	padding: var(--margin);
}
#live.marginTop {
	margin-top: calc(var(--margin)*2 + 4rem);
}
#noResults {
	padding: 4rem var(--margin);
	text-align:center;
}
.event {
	position: relative;
}
@media screen and (max-width: 1536px) {
	#live {
		grid-template-columns: repeat(4, 1fr);
	}
}
@media screen and (max-width: 1280px) {
	#live {
		grid-template-columns: repeat(3, 1fr);
	}
}
@media screen and (max-width: 800px) {
	#live {
		grid-template-columns: repeat(2, 1fr);
	}
	#liveSelection {
		height: calc(100vh - calc(5rem + var(--liveHeight) + var(--margin)));
		height: calc(100svh - calc(5rem + var(--liveHeight) + var(--margin)));
	}
	#live-intro {
		white-space: normal;
	}
	#see-all {
		display: none;
	}
}
@media only screen and (max-width: 350px) {
	#live {
		grid-template-columns: repeat(1, 1fr);
	}
}
</style>