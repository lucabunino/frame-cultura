<script>
import { urlFor } from "$lib/utils/image";
import { page } from "$app/state";
import { getHeader } from '$lib/stores/header.svelte';
import { formatAuthorName } from "$lib/utils/author.js";
import SearchBar from "$lib/components/SearchBar.svelte";
import FiltersAndSearch from "$lib/components/FiltersAndSearch.svelte";
let header = getHeader()
let { data } = $props();
function getInitial(surname) {
	if (!surname) return '';
	return surname.trim()[0].toUpperCase();
}
let previousInitialAnchor = '';
let seenHashAnchor = false;
let previousInitial = '';
let seenHash = false;
let activeLetters = $state(['A'])
let scrollY = $state(0)
let anchors = $state([])
let search = $derived(page.url.searchParams.get('search') ? page.url.searchParams.get('search') : '')

function handleScroll() {
	// get all anchors that are <= scroll position
	const visibleAnchors = anchors.filter(
		el => el && el.getBoundingClientRect().top - 100 <= 0
	);

	if (visibleAnchors.length) {
		// find the bottom-most visible anchor's top position
		const maxTop = Math.max(...visibleAnchors.map(el => el.getBoundingClientRect().top));

		// keep all anchors that share that same top position (±1px tolerance)
		const currentLetters = visibleAnchors
			.filter(el => Math.abs(el.getBoundingClientRect().top - maxTop) <= 1)
			.map(el => el.id);

		// update state only if it changed
		if (JSON.stringify(currentLetters) !== JSON.stringify(activeLetters)) {
			activeLetters = currentLetters;
		}
	} else {
		activeLetters = [];
	}
}
</script>

<svelte:window bind:scrollY onscroll={(e) => handleScroll(e)}></svelte:window>

<section id="anchors" class="noScrollbar" class:up={header.up}>
	<div class="anchors">
		{#if data.groupedAuthors.length > 0}
			{#each data.groupedAuthors as group, i}
				<a href="#{group.letter}" class="anchor jost-18 bold uppercase"
				class:active={activeLetters.includes(group.letter)}
				>{group.letter}</a>
			{/each}
		{:else}
			<p class="jost-27" style="height: 3rem;">Nessun risultato per <span class="bold">{page.url.searchParams.get('search')}</span></p>
		{/if}
	</div>
</section>

<section id="search-author">
	 <FiltersAndSearch data={data} marginTop={false} displayFilters={false} displayFilterTopic={true} section={"explore"} placeholder={'Cerca autore'}/>
</section>

<section id="authors">
	{#each data.groupedAuthors as group, i}
		<div class="letter-wrapper">
			<span id={group.letter} class="anchorTarget" bind:this={anchors[i]}></span>
			<h1 class="letter jost-210 uppercase">{group.letter}</h1>
		</div>
		{#each group.authors as author, j}
			<a class="author" href={`/autori/${author.slug.current}`}>
				<div class="portrait-wrapper">
					<img class="portrait" src={urlFor(author.portrait ? author.portrait : data.info.placeholder)} alt="">
					<div class="more jost-15 bold"><span>+</span></div>
				</div>
				<h2 class="jost-27 mobile-jost-16">{formatAuthorName(author)}</h2>
				{#if author.occupation}<h3 class="jost-18 mobile-jost-12">{author.occupation[0].toUpperCase() + author.occupation.slice(1)}</h3>{/if}
			</a>
		{/each}
	{/each}
</section>

<style>
/* Anchors */
#anchors {
	padding: var(--margin);
	position: sticky;
	top: calc((var(--margin)*2 + 4rem));
	width: 100%;
	transition: var(--transition);
	overflow: scroll;
	z-index: 2;
}
.anchors {
	display: flex;
	gap: 1rem;
	justify-content: center;
	width: fit-content;
	margin: auto;
}
#anchors.up {
	transform: translateY(calc((var(--margin)*2 + 4rem)*-1));
}
.anchor {
	width: 3rem;
	height: 3rem;
	background-color: var(--gray);
	border-radius: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}
.anchor.active {
	color: var(--white) !important;
	background-color: var(--blue);
}
@media only screen and (min-width: 801px) {
	.anchor:hover, .anchor.active:hover {
		color: var(--white) !important;
		background-color: var(--black);
	}
}

/* Search */
#search-author {
	display: flex;
	justify-self: center;
	margin-bottom: var(--margin);
}
input::placeholder {
	color: var(--black);
}
#search {
	width: 250px;
	border: none;
}
#search-submit svg {
	fill: var(--black);
}
@media only screen and (max-width: 500px) {
	#search-author {
		width: calc(100vw - var(--margin)*2);
		justify-content: space-between;
	}
	#search {
		width: calc(100vw - var(--margin)*2 - 3rem);
	}
}

/* Authors */
#authors {
	display: grid;
	grid-template-columns: repeat(6, calc((100% - var(--gutter)*5)/6));
	column-gap: var(--gutter);
	row-gap: 4rem;
	padding: var(--margin);
	position: relative;
}
.anchorTarget {
	height: 0;
	width: 0;
	opacity: 0;
	position: absolute;
	top: calc((var(--margin)*4 + 9rem)*-1)
}
.letter {
	text-align: center;
	align-content: center;
	justify-self: center;
	aspect-ratio: 1;
	max-width: 200px;
}
.letter-wrapper {
	position: relative;
}
.author {
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.author h2 {
	margin-top: 1rem;
	line-height: 1.05;
}
.author h3 {
	margin-top: .5rem;
}
.author .portrait-wrapper {
	max-width: 200px;
	position: relative;
}
.more {
	display: flex;
	padding: 1rem;
	background-color: var(--gray);
	border-radius: 100%;
	aspect-ratio: 1;
	width: 3rem;
	height: 3rem;
	justify-content: center;
	align-items: center;
	text-align: center;
	position: absolute;
	right: 7%;
	top: 7%;
	opacity: 0;
}
.author:hover .more {
	opacity: 1;
}
.more span {
	padding-bottom: .2rem;
}

@media only screen and (max-width: 1280px) {
	#authors {
		grid-template-columns: repeat(5, calc((100% - var(--gutter)*4)/5));
	}
}
@media only screen and (max-width: 1080px) {
	#authors {
		grid-template-columns: repeat(4, calc((100% - var(--gutter)*3)/4));
	}
}
@media only screen and (max-width: 800px) {
	#authors {
		grid-template-columns: repeat(3, calc((100% - var(--gutter)*2)/3));
	}
	.letter {
		margin-top: 6vw;
	}
}
@media only screen and (max-width: 300px) {
	#authors {
		grid-template-columns: repeat(2, calc((100% - var(--gutter)*1)/2));
	}
	.letter {
		font-size: 44vw;
	}
}
</style>