<script>
import { page } from "$app/state";
import { goto, afterNavigate } from '$app/navigation';
import { getHeader } from '$lib/stores/header.svelte';
import SearchBar from "./SearchBar.svelte";
let header = getHeader();
let { 
	data,
	section = undefined,
	marginTop = false,
	displayFilters = true,
	displayFilterTopic = false,
	displayFilterMedia = false,
	displayFilterCity = false,
	displayFilterFormat = false,
	displaySearch = true,
	placeholder = "Cerca",
	withLive = false,
	keepPage = false
} = $props();
let fullWidth = $derived(!displayFilters || !displaySearch ? true : false)
let search = $derived(page.url.searchParams.get('search') ? page.url.searchParams.get('search') : '')
let medias = $derived(page.url.searchParams.getAll('media') ? page.url.searchParams.getAll('media') : '')
let topic = $derived(page.url.searchParams.get('topic') ? page.url.searchParams.get('topic') : '')
let format = $derived(page.url.searchParams.get('format') ? page.url.searchParams.get('format') : '')
let city = $derived(page.url.searchParams.get('city') ? page.url.searchParams.get('city') : '')
let openFilters = $state(false);
let openSearch = $state(false);

function toggleMedias(mediaSlugs) {
	const url = new URL(window.location.href);
	url.searchParams.delete('media');
	if (mediaSlugs) {
		mediaSlugs.forEach(f => url.searchParams.append('media', f));
	}
	goto(`?${url.searchParams.toString()}${section ? "#" + section : ''}`, { preload: true, replaceState: false, noScroll: true })
}
function toggleTopic(topicSlug) {
	const url = new URL(window.location.href);
	url.searchParams.delete('topic');
	if (topicSlug) {
		url.searchParams.append('topic', topicSlug)
	}
	goto(`?${url.searchParams.toString()}${section ? "#" + section : ''}`, { preload: true, replaceState: false, noScroll: true })	
}
function toggleFormat(formatSlug) {
	const url = new URL(window.location.href);
	url.searchParams.delete('format');
	if (formatSlug) {
		url.searchParams.append('format', formatSlug)
	}
	goto(`?${url.searchParams.toString()}${section ? "#" + section : ''}`, { preload: true, replaceState: false, noScroll: true })	
}
function toggleCity(citySlug) {
	const url = new URL(window.location.href);
	url.searchParams.delete('city');
	if (citySlug) {
		url.searchParams.append('city', citySlug)
	}
	goto(`?${url.searchParams.toString()}${section ? "#" + section : ''}`, { preload: true, replaceState: false, noScroll: true })	
}
function toggleSearch(e, searchString) {
	e.preventDefault()
	const url = new URL(window.location.href);
	url.searchParams.delete('media');
	if (medias.length) {
		medias.forEach(f => url.searchParams.append('media', f));
	}
	url.searchParams.delete('topic');
	if (topic) url.searchParams.append('topic', topic);
	if (search) {
		url.searchParams.set('search', searchString);
	} else {
		url.searchParams.delete('search');
	}
	goto(`?${url.searchParams.toString()}${section ? section : ''}`, { preload: true, replaceState: false, noScroll: true })
}
</script>

<section id="filters-and-search"
class:withLive={withLive}
style={fullWidth ? "width:100%; left:0" : ""} class="jost-15 uppercase bold" class:up={header.up} class:marginTop={marginTop} class:open={openFilters || openSearch}>
	{#if displayFilters}
		<div id="filters" class:open={openFilters}>
			{#if displayFilterMedia}
				<div class="medias">
					<span class="mobile-jost-12">Media:</span>
					<button class="btn"
						class:active={medias.length == 0}
						onclick={() => toggleMedias(null)}
					>Tutto</button>
					<button class="btn"
						class:active={medias.includes('video','playlist')}
						onclick={() => toggleMedias(['video', 'playlist'])}
					>Video</button>
					<button class="btn"
						class:active={medias.includes('episode','podcast')}
						onclick={() => toggleMedias(['episode', 'podcast'])}
					>Podcast</button>
				</div>
			{/if}
			{#if displayFilterFormat}
				<div class="formats">
					<span class="mobile-jost-12">Format:</span>
					{#if data.formats}
						<select name="format" id="format" class="btn" bind:value={format} onchange={(e) => {toggleFormat(format)}}>
							<option value="">Tutti</option>
							{#each data.formats as f, i}
								<option value={f.slug.current}>{f.title}</option>
							{/each}
						</select>
					{/if}
				</div>
			{/if}
			{#if displayFilterCity}
				<div class="city">
					<span class="mobile-jost-12">Luogo:</span>
					{#if data.cities}
						<select name="city" id="city" class="btn" bind:value={city} onchange={(e) => {toggleCity(city)}}>
							<option value="">Tutti</option>
							{#each data.cities as c, i}
								<option value={c.slug.current}>{c.title}</option>
							{/each}
						</select>
					{/if}
				</div>
			{/if}
			{#if displayFilterTopic}
				<div class="topics">
					<span class="mobile-jost-12">Argomento:</span>
					{#if data.topics}
						<select name="topic" id="topic" class="btn" bind:value={topic} onchange={(e) => {toggleTopic(topic)}}>
							<option value="">Tutti</option>
							{#each data.topics as t, i}
								<option value={t.slug.current}>{t.title}</option>
							{/each}
						</select>
					{/if}
				</div>
			{/if}
		</div>
		<button id="filters-switch" style={fullWidth ? "width:100%; left:0" : ""} class="jost-12 bold uppercase" onclick={() => {openFilters = !openFilters; openSearch ? openSearch = !openSearch : ''}} class:open={openFilters} class:active={page.url.searchParams.getAll('media').length > 0 || page.url.searchParams.get('topic')}>
			Filtra
			<svg fill='black' height='10' viewBox='0 0 24 24' width='10' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>
		</button>
	{/if}
	{#if displaySearch}
		<SearchBar search={search} fullWidth={true} openSearch={openSearch} placeholder={placeholder} keepPage={keepPage}/>
		<button id="search-switch" style={fullWidth ? "width:100%; left:0" : ""} class="jost-12 bold uppercase mobile-only" onclick={() => {openSearch = !openSearch; openFilters ? openFilters = !openFilters : ''}} class:open={openSearch} class:active={page.url.searchParams.get('search')}>
			Cerca
			<svg width="13" height="13" viewBox="0 0 13 13" fill="black" xmlns="http://www.w3.org/2000/svg">
				<g clip-path="url(#a)">
					<path d="M7.96 0c-2.8-.017-5.083 2.25-5.1 5.063a5.103 5.103 0 0 0 .835 2.813L0 11.57 1.417 13l3.687-3.688c.807.547 1.78.869 2.826.874 2.788 0 5.053-2.262 5.07-5.063C13.017 2.31 10.76.017 7.96 0Zm.001 8.113a3.073 3.073 0 0 1-3.094-3.05h-.004A3.089 3.089 0 0 1 7.93 1.955a3.072 3.072 0 0 1 3.068 3.05A3.073 3.073 0 0 1 7.96 8.113Z"/>
				</g>
				<defs>
					<clipPath id="a">
						<path fill="#fff" d="M0 0h13v13H0z"/>
					</clipPath>
				</defs>
			</svg>
		</button>
	{/if}
</section>

<style>
/* Filters */
#filters-and-search {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	gap: calc(var(--margin)*2);
	padding: 1rem var(--margin);
	margin: 3rem 0;
	position: sticky;
	top: calc((var(--margin)*2 + 4rem));
	background-color: var(--white);
	transition: var(--transition);
	z-index: 1;
}
#filters-and-search.marginTop {
	margin-top: calc(var(--margin)*2 + 4rem + var(--margin) + 1rem);
}
#filters-and-search.up {
	top: 0;
}
#filters {
	display: flex;
	flex-wrap: wrap;
	row-gap: 1rem;
	column-gap: calc(var(--margin)*2);
}
#filters .btn {
	border: solid 1px var(--black);
}
#filters div {
	display: flex;
	align-items: center;
	gap: .3rem;
}
#filters span {
	margin-right: .7rem;
	white-space: nowrap;
}
select {
	width: fit-content;
	appearance: none;
	background-color: var(--white);
	border: solid 1px var(--black);
	cursor: pointer;
	padding-right: 4em;
	background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='10' viewBox='0 0 24 24' width='10' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
	background-repeat: no-repeat;
	background-position: right 1.5em top .6em;
	background-size: 2em auto;
}
select:focus {
	outline: none;
}
select:hover {
	background-image: url("data:image/svg+xml;utf8,<svg fill='white' height='10' viewBox='0 0 24 24' width='10' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
}
#filters-switch {
	display: none;
}
@media screen and (max-width: 800px) {
	#filters-and-search {
		position: fixed;
		top: unset !important;
		bottom: 5rem;
		max-width: stretch;
		width: 100%;
		display: block;
		margin: 0;
		padding: 0;
		z-index: 8;
		transition: none;
	}
	#filters-and-search.open {
		padding: 2rem var(--margin);
		border-top: solid 1px var(--black);
	}
	#filters {
		display: none;
		gap: 2rem;
	}
	#filters.open {
		display: flex;
	}
	#filters div {
		flex-wrap: wrap;
		width: 100%;
	}
	#filters span {
		flex-basis: 100%;
		margin-bottom: .5rem;
	}
	#filters-switch {
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 50%;
		border-top: solid 1px var(--black);
		border-right: solid 1px var(--black);
		background-color: var(--white);
		text-align: center;
		height: 5rem;
	}
	#filters-switch svg {
		height: 2.4em;
		width: auto;
		margin-top: -.3em;
	}
	#filters-switch.active {
		padding-top: 5px;
		border-bottom: solid 5px var(--black);
	}
	#filters-switch.open {
		color: var(--white);
		background-color: var(--black);
	}
	#filters-switch.open svg {
		fill: var(--white);
	}
	select {
		width: 100%;
	}
}

/* Search */
@media screen and (max-width: 800px) {
	#search-switch {
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 0;
		left: 50%;
		width: 50%;
		border-top: solid 1px var(--black);
		background-color: var(--white);
		text-align: center;
		height: 5rem;
		gap: .9em;
	}
	#search-switch svg {
		height: 1em;
		width: auto;
		margin-top: -.1em;
	}
	#search-switch.active {
		padding-top: 5px;
		border-bottom: solid 5px var(--black);
	}
	#search-switch.open {
		color: var(--white);
		background-color: var(--black);
	}
	#search-switch.open svg {
		fill: var(--white);
	}
}


@media screen and (max-width: 800px) {
	.withLive#filters-and-search {
		bottom: calc(5rem + var(--liveHeight) + var(--margin));
	}
	.withLive #filters-switch,
	.withLive #search-switch {
		height: calc(5rem + var(--liveHeight) + var(--margin));
		padding-bottom: calc(var(--liveHeight) + var(--margin));
	}
}
</style>