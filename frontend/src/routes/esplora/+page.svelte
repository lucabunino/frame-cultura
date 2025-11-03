<script>
import { urlFor } from "$lib/utils/image";
import { page } from "$app/state";
import { getHeader } from '$lib/stores/header.svelte';
import { register } from 'swiper/element/bundle';register();
import sliderInjectedStyle from '$lib/utils/sliderInjectedStyle.js';
import { formatAuthorName } from "$lib/utils/author.js";
import FiltersAndSearch from "$lib/components/FiltersAndSearch.svelte";
import { isPast } from "$lib/utils/date.js";
import { onDestroy, onMount } from "svelte";
import Production from "$lib/components/Production.svelte";
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
onMount(() => { if (data.exploreHasContent) {
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
		if (e.clientX > innerWidth.current/2) {
			swiperEl.swiper.slideNext()
		} else {
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
		if (e.clientX > innerWidth.current/2) {
			highlightTag = 'Next'
		} else {
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

{#if data.exploreSelection}
	<section id="exploreSelection" class="cover _21-9" class:scrollable={swiperEl?.swiper?.slides.length > 1}>
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
			{#each data.exploreSelection as production, i}
				<swiper-slide class="production"
				onmousemove={(e) => {onSwiperHover(e)}}
				onmouseleave={(e) => {onSwiperMouseLeave(e)}}
				onclick={(e) => {onSwiperClick(e)}}
				role="button"
  				tabindex="0"
				onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSwiperKeydown(e); }}
				>
					<img class="cover"
					src={urlFor(
						production.highlightCoverMobile && innerWidth.current <= 800 ? production.highlightCoverMobile :
						production.highlightCover ? production.highlightCover :
						data.info.placeholder
						).width(2560)}
					alt="Copertina di {production.title}"
					>
					<div class="info">
						{#if production.topics}
							<div class="topics jost-15 bold uppercase">
								{#each production.topics as topic, j}
									<a href="/cerca?search={topic.title}">{topic.title}</a>
								{/each}
							</div>
						{/if}
						<h2 class="jost-45 mobile-jost-27 uppercase bold">{production.title}</h2>
						{#if production.subtitle}<h3 class="jost-36 subtitle mobile-jost-27 bold">{production.subtitle}</h3>{/if}
						{#if production.authors?.length < 4}
							<p class="jost-18">di {#each production.authors as author, j}{formatAuthorName(author)}{@html production.authors.length > j+1 ? ', ' : ''}{/each}</p>
						{:else if production.authors?.length >= 4}
							<p class="jost-18">di Autori vari</p>
						{/if}
						{#if production.highlightAbstract}
							<p class="abstract jost-18">{production.highlightAbstract}</p>
						{/if}
					</div>
					<div class="btns jost-15 uppercase bold">
						{#if production._type == "episode" || production._type == "podcast"}
							{#if production.link}
								<a class=" btn" href={production.link} target="_blank" rel="noopener noreferrer">
									<svg width="19" height="15" viewbox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M18.53 7.5 0 15V0l18.53 7.5Z"/>
									</svg>
									Ascolta
								</a>
							{/if}
						{/if}
						<a class="btn"  href="/esplora/{production.slug.current}">Leggi di più</a>
					</div>
				</swiper-slide>
			{/each}
		</swiper-container>
		{#if highlightTag}
			<span class="highlightTag btn outline" class:left={highlightTag == 'Prev'} class:right={highlightTag == 'Next'} style="top: {mouse.y}px; left: {mouse.x}px;">{highlightTag}</span>
		{/if}
	</section>
{/if}

<FiltersAndSearch
withLive={data.liveWidget && isPast(data.liveWidget?.liveWidget?.displayStart)}
data={data} marginTop={!data.exploreSelection} displayFilterMedia={true} displayFilterTopic={true} section={"explore"} placeholder={'Cerca produzione'} keepPage={true}/>


{#if data.explore.length > 0}
	<section id="explore" class:marginTop={!data.exploreSelection}>
		{#each data.explore as production, i}
			<Production production={production} placeholder={data.info.placeholder}/>
		{/each}
	</section>
{:else}
	<section id="noResults">
		<p class="jost-27" style="height: 3rem;">Nessun risultato per questi parametri di ricerca</p>
	</section>
{/if}

<style>
/* Highlights */
#exploreSelection {
	min-height: 500px;
	height: calc(100vw/21*9);
}
#exploreSelection swiper-container {
	height: 100%;
}
#exploreSelection .cover {
	width: 100%;
	height: 100%;
	object-fit: cover;
	position: absolute;
	top: 0;
	left: 0;
	z-index: -1;
}
#exploreSelection swiper-slide {
	position: relative;
}
#exploreSelection.scrollable swiper-slide {
	cursor: pointer;
}
#exploreSelection swiper-container::part(pagination) {
	left: unset;
	right: 0;
	bottom: 4rem;
    width: fit-content;
    padding: 0 var(--margin);
	height: calc(2.5rem + 1.25rem*1.3);
	align-content: center;
}
#exploreSelection swiper-container::part(bullet) {
	background: transparent;
	border: solid 1px var(--white);
	opacity: 1;
	margin: 0 2px;
}
#exploreSelection swiper-container::part(bullet-active) {
	background: var(--white);
	border: solid 1px var(--white);
	opacity: 1;
	margin: 0 2px;
}
#exploreSelection .production {
	color: var(--white);
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: var(--margin);
}
#exploreSelection .production h2, .production h3 {
	line-height: 1.05;
}
#exploreSelection .production p {
	margin-top: 1rem;
}
#exploreSelection .production .cover {
	margin-bottom: 1rem;
}
#exploreSelection .info {
	max-width: 700px;
}
#exploreSelection .topics {
	display: inline-flex;
	column-gap: var(--margin);
	row-gap: 1rem;
	margin-bottom: 1rem;
}
#exploreSelection .abstract {
	margin-top: 4rem;
	max-width: 600px;
}
#exploreSelection .btns {
	position: absolute;
	bottom: 0;
	left: 0;
	padding: 2rem var(--margin) 4rem;
	z-index: 3;
	display: flex;
	align-items: center;
	gap: .3rem;
}
#exploreSelection .btns .btn {
	display: inline-flex;
	gap: .6em;
	align-items: center;
}
#exploreSelection .btns .btn svg {
	height: 1.25rem;
	fill: var(--black);
}
#exploreSelection .btns .btn:hover svg {
	fill: var(--white);
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
@media screen and (max-width: 800px) {
	#exploreSelection .production {
		justify-content: flex-end;
		padding-bottom: 12rem;
	}
	.highlightTag {
		display: none;
	}

}

/* Explore */
#explore {
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	column-gap: var(--gutter);
	row-gap: 4rem;
	padding: 0 var(--margin);
}
#explore.marginTop {
	margin-top: calc(var(--margin)*2 + 4rem);
}
#noResults {
	padding: 4rem var(--margin);
	text-align:center;
}
@media only screen and (max-width: 1280px) {
	#explore {
		grid-template-columns: repeat(5, 1fr);
	}
}
@media only screen and (max-width: 1080px) {
	#explore {
		grid-template-columns: repeat(4, 1fr);
	}
}
@media only screen and (max-width: 800px) {
	#explore {
		grid-template-columns: repeat(3, 1fr);
		padding-top: 3rem;
	}
}
@media only screen and (max-width: 500px) {
	#explore {
		grid-template-columns: repeat(2, 1fr);
	}
}
</style>