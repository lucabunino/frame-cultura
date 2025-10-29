<script>
import { urlFor } from '$lib/utils/image';
import { page, navigating } from '$app/state';
import { formatAuthorName } from '$lib/utils/author.js';
import Event from '$lib/components/Event.svelte';
import SearchBar from '$lib/components/SearchBar.svelte';
    import Production from '$lib/components/Production.svelte';
let { data } = $props();
$inspect(data)
let innerWidth = $state(undefined)
let showAllAuthors = $state(false)
let showAllExplore = $state(false)
let showAllLive = $state(false)
let search = $derived(page.url.searchParams.get('search') ?? '')

// Lifecycle
$effect(() => {
	void data.searchString;
	showAllAuthors = false
	showAllExplore = false
	showAllLive = false
})
</script>

<svelte:window bind:innerWidth></svelte:window>

<div class="wrapper">
	<section id="intro">
		<h1 class="jost-27">
			{#if data.authors.length > 0 || data.explore.length > 0 || data.live.length > 0}
				Risultati per
			{:else}
				Nessun risultato per
			{/if}
			<SearchBar search={search} fullWidth={true} small={false} mobileAnchorBottom={false} placeholder={"Tutti i contenuti"}/>
		</h1>
	</section>
	<section id="authors">
		<h4 class="jost-12 uppercase bold">Autori ({data.authors.length})</h4>
		{#if data.authors.length > 0}
			<div class="authors noScrollbar">
				{#each showAllAuthors || innerWidth > 800 ? data.authors : data.authors.slice(0, 10) as author, i}
					<a class="author hover-gray" href={`/autori/${author.slug.current}`}>
						<img class="portrait" src={urlFor(author.portrait ? author.portrait : data.info.placeholder)} alt="">
						<div>
							<h2 class="jost-18">{formatAuthorName(author)}</h2>
							{#if author.occupation}<h3 class="jost-12">{author.occupation[0].toUpperCase() + author.occupation.slice(1)}</h3>{/if}
						</div>
					</a>
				{/each}
			</div>
			{#if innerWidth <= 800 && data.authors.length > 10}
				{#if !showAllAuthors}
					<button class="btn bg-gray mobile-w-100" onclick={(e) => {showAllAuthors = true}}>Mostra tutto</button>
				{:else}
					<button class="btn bg-gray mobile-w-100" onclick={(e) => {showAllAuthors = false}}>Mostra meno</button>
				{/if}
			{/if}
		{:else}
			<p class="authors noResults jost-18">Nessun autore</p>
		{/if}
	</section>
	<div class="explore-live-wrapper">
		<section id="explore">
			<h4 class="jost-12 uppercase bold">Produzioni ({data.explore.length})</h4>
			{#if data.explore.length > 0}
				<div class="explore">
					{#each showAllExplore ? data.explore : data.explore.slice(0, 10) as production, i}
						<Production production={production} placeholder={data.info.placeholder}/>
					{/each}
				</div>
				{#if data.explore.length > 10}
					{#if !showAllExplore}
						<button class="btn bg-gray mobile-w-100" onclick={(e) => {showAllExplore = true}}>Mostra tutto</button>
					{:else}
						<button class="btn bg-gray mobile-w-100" onclick={(e) => {showAllExplore = false}}>Mostra meno</button>
					{/if}
				{/if}
			{:else}
				<p class="explore noResults jost-18">Nessuna produzione</p>
			{/if}
		</section>
		<section id="live">
			<h4 class="jost-12 uppercase bold">Live ({data.live.length})</h4>
			{#if data.live.length > 0}
				<div class="live">
					{#each showAllLive ? data.live : data.live.slice(0, 10) as event, i}
						<Event event={event}/>
					{/each}
				</div>
				{#if data.live.length > 10}
					{#if !showAllLive}
						<button class="btn bg-gray mobile-w-100" onclick={(e) => {showAllLive = true}}>Mostra tutto</button>
					{:else}
						<button class="btn bg-gray mobile-w-100" onclick={(e) => {showAllLive = false}}>Mostra meno</button>
					{/if}
				{/if}
			{:else}
				<p class="live noResults jost-18">Nessun evento</p>
			{/if}
		</section>
	</div>
</div>

<style>
.wrapper {
	padding: var(--margin);
	display: grid;
	grid-template-columns:repeat(12, 1fr);
	column-gap: var(--gutter);
	row-gap: 4rem;
}
.explore-live-wrapper {
	grid-column: 4 / span 9;
	display: flex;
	flex-direction: column;
	gap: 12rem;
}
section h4 {
	padding-bottom: 1rem;
	border-bottom: solid 1px var(--black);
}
@media only screen and (max-width: 1280px) {
	.explore-live-wrapper {
		grid-column: 5 / span 8;
	}
}
@media only screen and (max-width: 1080px) {
	.explore-live-wrapper {
		grid-column: 6 / span 7;
	}
}
@media only screen and (max-width: 800px) {
	section {
		margin-bottom: 8rem;
	}
	.explore-live-wrapper {
		grid-column: 1 / span 12;
		gap: 4rem;
	}
}

/* Intro */
#intro {
	text-align: center;
	margin-bottom: 4rem;
	grid-column: 1 / span 12;
}
#intro h1 {
	display: flex;
	gap: var(--gutter);
	align-items: center;
	justify-content: center;
}
@media only screen and (max-width: 800px) {
	#intro h1 {
		flex-direction: column;
	}
}

/* Authors */
#authors {
	grid-column: 1 / span 3;
	position: sticky;
	top: calc((var(--margin)*2 + 5.7rem));
	height: calc(100vh - ((var(--margin)*2 + 5.7rem)));
}
.authors {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	row-gap: 1rem;
	height: 100%;
	overflow-y: auto;
	padding: 2rem 0 8rem;
	margin-top: .5px;
}
.author {
	display: flex;
	align-items: center;
	gap: var(--gutter);
	padding-right: var(--margin);
}
.author h2 {
	line-height: 1.05;
}
.author h3 {
	margin-top: .4rem;
}
.author .portrait {
	width: 6rem;
}
@media only screen and (max-width: 1280px) {
	#authors {
		grid-column: 1 / span 4;
	}
}
@media only screen and (max-width: 1080px) {
	#authors {
		grid-column: 1 / span 5;
	}
}
@media only screen and (max-width: 800px) {
	#authors {
		grid-column: 1 / span 12;
		position: relative;
		height: auto;
		top: unset;
	}
	.authors {
		height: auto;
		padding: 2rem 0 4rem;
	}
	.author {
		padding-right: 0;
	}
}

/* Explore */
.explore {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	column-gap: var(--gutter);
	row-gap: 2rem;
	padding-top: 2rem;
	margin-bottom: 4rem;
}
@media only screen and (max-width: 1536px) {
	.explore {
		grid-template-columns: repeat(4, 1fr);
	}
}
@media only screen and (max-width: 1280px) {
	.explore {
		grid-template-columns: repeat(3, 1fr);
		margin-bottom: 4rem;
	}
}
@media only screen and (max-width: 1080px) {
	.explore {
		grid-template-columns: repeat(2, 1fr);
	}
}
@media only screen and (max-width: 350px) {
	.explore {
		grid-template-columns: repeat(1, 1fr);
	}
}

/* Live */
.live {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	column-gap: var(--margin);
	row-gap: 4rem;
	padding-top: 2rem;
	margin-bottom: 8rem;
}
@media screen and (max-width: 1536px) {
	.live {
		grid-template-columns: repeat(3, 1fr);
	}
}
@media screen and (max-width: 1280px) {
	.live {
		grid-template-columns: repeat(2, 1fr);
		margin-bottom: 4rem;
	}
}
@media screen and (max-width: 800px) {
	.live {
		grid-template-columns: repeat(2, 1fr);
		margin-bottom: 4rem;
	}
}
@media screen and (max-width: 350px) {
	.live {
		grid-template-columns: repeat(1, 1fr);
	}
}

/* Overwrite */
.noResults {
	grid-template-columns: repeat(1, 1fr);
}
@media screen and (max-width: 800px) {
	.btn {
		width: stretch;
		text-align: center;
	}
}
</style>