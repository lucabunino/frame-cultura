<script>
import { PortableText } from '@portabletext/svelte'
import PlainTextStyle from '$lib/components/portableTextStyles/PlainTextStyle.svelte';
import { urlFor } from "$lib/utils/image";
import { formatDate } from "$lib/utils/date";
import { formatAuthorName } from '$lib/utils/author.js';
    import Event from '$lib/components/Event.svelte';
    import Production from '$lib/components/Production.svelte';
let { data } = $props();
const author = data.author
const maxLength = 400

let openHighlights = $state(false)
let expanded = $state(false)
let visibleBlocks = $derived.by(() => {
	if (!author?.authorBody) return []

	let text = ""
	let truncatedBlocks = []
	for (const block of author.authorBody) {
		if (block._type !== "block" || !block.children) continue
		let blockText = block.children.map(c => c.text).join("")

		if (text.length + blockText.length <= maxLength || expanded) {
			truncatedBlocks.push(block)
			text += blockText
		} else {
			let remaining = maxLength - text.length
			if (remaining > 0) {
				truncatedBlocks.push({
					...block,
					children: [{ ...block.children[0], text: blockText.slice(0, remaining) + "…" }]
				})
			}
			break
		}
	}
	return truncatedBlocks
})
function blocksToPlainText(blocks) {
	if (!Array.isArray(blocks)) return ''
	return blocks
		.filter(b => b._type === 'block' && b.children)
		.map(b => b.children.map(c => c.text).join(''))
		.join('\n')
}
</script>

<svelte:head>
	{#if data.seo.SEOTitle}<title>{data.seo.SEOTitle} — {formatAuthorName(author)}</title>{/if}
	{#if author.SEODescription}<meta name="description" content={author.SEODescription}>{/if}
	{#if author.SEOHidden}
		<meta name="robots" content="index,follow">
		<meta name="robots" content="noindex, nofollow" />
	{/if}
	{#if data.seo.SEOTitle}<meta property="og:title" content={`${data.seo.SEOTitle} — ${author.title}`}>{/if}
	{#if author.SEODescription}<meta property="og:description" content={author.SEODescription}>{/if}
	{#if author.portrait}<meta property="og:image" content={urlFor(author.portrait).width(1200).url()}>{/if}
	{#if data.seo.SEOTitle}<meta property="og:site_name" content={`${data.seo.SEOTitle} — ${formatAuthorName(author)}`}>{/if}
</svelte:head>

<section id="author">
	<div class="author-wrapper noScrollbar" class:noHighlights={!author.highlightedContents}>
		<div class="description">
			<div class="card">
				<img class="portrait" src={urlFor(author.portrait ? author.portrait : data.info.placeholder)} alt="">
				<div class="names">
					<h1 class="jost-74 mobile-jost-27 name">{formatAuthorName(author)}</h1>
					{#if author.occupation}<h3 class="jost-27 mobile-jost-16 occupation">{author.occupation[0].toUpperCase() + author.occupation.slice(1)}</h3>{/if}
				</div>
			</div>
			{#if author.authorBody}
				<div class="bio jost-18">
					<PortableText
						value={visibleBlocks}
						components={{
							block: {
								normal: PlainTextStyle,
								h2: PlainTextStyle,
								h3: PlainTextStyle,
								h4: PlainTextStyle,
							},
							listItem: PlainTextStyle,
							marks: { link: PlainTextStyle }
						}}
					/>
				</div>

				{#if author?.authorBody && blocksToPlainText(author.authorBody).length > maxLength}
					<button class="btn bg-gray" onclick={() => expanded = !expanded}>
						{expanded ? 'Leggi meno' : 'Leggi di più'}
					</button>
				{/if}
			{:else if author.bio}
				{#if author.bio.length > maxLength}
					{#if expanded}
						<p class="jost-18 bio">{author.bio}</p>
						<button class="btn bg-gray" onclick={() => expanded = false}>Leggi meno</button>
					{:else}
						<p class="jost-18 bio">{author.bio.slice(0, maxLength)}…</p>
						<button class="btn bg-gray" onclick={() => expanded = true}>Leggi di più</button>
					{/if}
				{:else}
					<p class="jost-18 bio">{author.bio}</p>
				{/if}
			{/if}
		</div>
		{#if author.audios.length > 0}
			<div class="author-appears">
				<h4 class="jost-12 uppercase bold">Podcast</h4>
				<div class="author-contents podcasts">
					{#each author.audios as audio, i}
						<Production production={audio} placeholder={data.info.placeholder} showInfo={false}/>
					{/each}
				</div>
			</div>
		{/if}
		{#if author.videos.length > 0}
			<div class="author-appears">
				<h4 class="jost-12 uppercase bold">Video</h4>
				<div class="author-contents videos">
					{#each author.videos as video, i}
						<Production production={video} placeholder={data.info.placeholder} showInfo={false}/>
					{/each}
				</div>
			</div>
		{/if}
		{#if author.events.length > 0}
			<div class="author-appears">
				<h4 class="jost-12 uppercase bold">Live</h4>
				<div class="author-contents events">
					{#each author.events as event, i}
						<Event event={event}/>
					{/each}
				</div>
			</div>
		{/if}
	</div>
	{#if author.highlightedContents}	
		<div class="author-highlighted-contents" onclick={() => {openHighlights = !openHighlights}} class:open={openHighlights}>
			<h4 class="jost-12 uppercase bold">In evidenza</h4>
			{#each author.highlightedContents as production, i}
				<a class="author-highlighted-content jost-15" href={`/esplora/${production.slug.current}`}>
					<img class="cover rounded" src={urlFor(production.cover ? production.cover : data.info.placeholder)} alt=""
					class:_1-1={production._type == "episode" || production._type == "podcast"}
					class:_16-9={production._type == "video" || production._type == "playlist"}
					>
					<h2 class="jost-18 uppercase bold tight">{production.title}</h2>
					{#if production.subtitle}<h3 class="jost-18 bold tight">{production.subtitle}</h3>{/if}
					<div class="info">
						{#if production.date}<time class="jost-15" datetime={production.date}>{formatDate(production.date)}</time>{/if}
						{#if production.authors?.length < 4}
							<div class="authors jost-15">
								<p class="episode-authors-label">
									<span>Con</span>
									{#each production.authors as author, j}
										<a class="author" href="/autori/{author.slug.current}">{formatAuthorName(author)}</a>{@html j < production.authors.length - 1  ? ', ' : ''}
									{/each}
								</p>
							</div>
						{:else if production.authors?.length >= 4}
							<p>di Autori vari</p>
						{/if}
					</div>
					{#if production.abstract}
						<div class="body jost-15">
							<PortableText
							value={production.abstract}
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
							}}/>
						</div>
					{/if}
				</a>
			{/each}
		</div>
	{/if}
</section>

<style>
#author {
	display: grid;
	grid-template-columns: repeat(10, 1fr);
	padding: 0 var(--margin);
}
.author-wrapper {
	grid-column: 1 / span 7;
	overflow-y: scroll;
	position: sticky;
	top: 0;
	height: fit-content;
	max-height: 100vh;
}
.author-wrapper.noHighlights {
	grid-column: 1 / span 10;
	max-height: unset;
}
@media only screen and (max-width: 1728px) {
	.author-wrapper {
		grid-column: 1 / span 8;
	}
}
@media only screen and (max-width: 800px) {
	#author {
		display: flex;
		flex-direction: column;
	}
	.author-wrapper {
		overflow-y: unset;
		position: relative;
		top: unset;
		height: unset;
		max-height: unset;
	}
	.author-wrapper.noHighlights {
		width: 100%;
	}
}

/* Description */
.description {
	padding-right: var(--margin);
}
.card {
	display: flex;
	align-items: center;
	gap: var(--margin);
	padding-top: 2rem;
}
.names {
	width: calc(100% - 200px - var(--margin));
}
.name {
	max-width: 800px;
}
.occupation {
	margin-top: 1rem;
	max-width: 600px;
}
.portrait {
	width: 200px;
}
.bio {
	margin-top: 2rem;
	max-width: 700px;
	margin-bottom: 2rem;
}
@media only screen and (max-width: 1080px) {
	.portrait {
		width: 150px;
	}
	.names {
		width: auto;
	}
}
@media only screen and (max-width: 800px) {
	.portrait {
		width: 30vw;
	}
	.occupation {
		margin-top: .5rem;
	}
}

/* Productions */
.author-appears {
	margin-top: 8rem;
	padding-right: var(--margin);
}
.noHighlights .author-appears {
	padding-right: 0;
}
h4 {
	margin-bottom: 1rem;
}
.author-contents {
	display: grid;
	column-gap: var(--gutter);
	row-gap: 4rem;
	padding-bottom: 4rem;
}
.author-contents.podcasts {
	grid-template-columns: repeat(5, calc((100% - var(--gutter)*4)/5));
}
.author-contents.videos {
	grid-template-columns: repeat(4, calc((100% - var(--gutter)*3)/4));
}
.author-contents.events {
	grid-template-columns: repeat(4, calc((100% - var(--gutter)*2)/3));
	column-gap: var(--margin);
}
.noHighlights .author-contents.podcasts {
	grid-template-columns: repeat(6, calc((100% - var(--gutter)*5)/6));
}
.noHighlights .author-contents.videos {
	grid-template-columns: repeat(5, calc((100% - var(--gutter)*4)/5));
}
.noHighlights .author-contents.events {
	grid-template-columns: repeat(5, calc((100% - var(--gutter)*4)/5));
}
.author-content img {
	margin-bottom: 1rem;
}
@media only screen and (max-width: 1280px) {
	.author-contents.podcasts {
		grid-template-columns: repeat(4, calc((100% - var(--gutter)*3)/4));
	}
	.author-contents.videos {
		grid-template-columns: repeat(3, calc((100% - var(--gutter)*2)/3));
	}
	.author-contents.events {
		grid-template-columns: repeat(3, calc((100% - var(--gutter)*2)/3));
	}
	.noHighlights .author-contents.podcasts {
		grid-template-columns: repeat(5, calc((100% - var(--gutter)*4)/5));
	}
	.noHighlights .author-contents.videos {
		grid-template-columns: repeat(4, calc((100% - var(--gutter)*3)/4));
	}
	.noHighlights .author-contents.events {
		grid-template-columns: repeat(4, calc((100% - var(--gutter)*3)/4));
	}
}
@media only screen and (max-width: 1080px) {
	.author-contents.podcasts {
		grid-template-columns: repeat(3, calc((100% - var(--gutter)*2)/3));
	}
	.author-contents.videos {
		grid-template-columns: repeat(2, calc((100% - var(--gutter)*1)/2));
	}
	.noHighlights .author-contents.podcasts {
		grid-template-columns: repeat(4, calc((100% - var(--gutter)*3)/4));
	}
	.noHighlights .author-contents.videos {
		grid-template-columns: repeat(3, calc((100% - var(--gutter)*2)/3));
	}
	.noHighlights .author-contents.events {
		grid-template-columns: repeat(3, calc((100% - var(--gutter)*2)/3));
	}
}
@media only screen and (max-width: 800px) {
	.author-appears, .description {
		padding-right: 0;
	}
	.author-contents.podcasts, .noHighlights .author-contents.podcasts {
		grid-template-columns: repeat(2, calc((100% - var(--gutter)*1)/2));
	}
	.author-contents.videos, .noHighlights .author-contents.videos {
		grid-template-columns: repeat(2, calc((100% - var(--gutter)*1)/2));
	}
	.author-contents.events, .noHighlights .author-contents.events {
		grid-template-columns: repeat(2, calc((100% - var(--gutter)*1)/2));
	}
}
@media only screen and (max-width: 350px) {
	.author-contents.podcasts, .noHighlights .author-contents.podcasts {
		grid-template-columns: repeat(1, calc((100% - var(--gutter)*0)/1));
	}
	.author-contents.videos, .noHighlights .author-contents.videos {
		grid-template-columns: repeat(1, calc((100% - var(--gutter)*0)/1));
	}
	.author-contents.events, .noHighlights .author-contents.events {
		grid-template-columns: repeat(1, calc((100% - var(--gutter)*0)/1));
	}
}

/* Highlights */
.author-highlighted-contents {
	grid-column: 8 / span 3;
	padding-top: 2rem;
	border-left: solid 1px;
	padding-left: var(--margin);
}
.author-highlighted-contents .cover {
	max-height: 250px;
	margin-bottom: 1rem;
	width: auto;
}
.author-highlighted-content {
	display: block;
	border-top: solid 1px var(--black);
	padding-top: 2rem;
	margin-bottom: 4rem;
}
.author-highlighted-content .info {
	margin-top: 1rem;
}
.author-highlighted-content .author {
	display: inline-block;
	text-decoration: underline;
}
.author-highlighted-content .body {
	margin-top: 2rem;
}
@media only screen and (max-width: 1728px) {
	.author-highlighted-contents {
		grid-column: 9 / span 2;
		padding-top: 2rem;
		border-left: solid 1px;
		padding-left: var(--margin);
	}
}
@media only screen and (max-width: 800px) {
	.author-highlighted-contents {
		display: none;
	}
}
</style>