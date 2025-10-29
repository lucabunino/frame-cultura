<script>
import { PortableText } from '@portabletext/svelte'
import PlainTextStyle from '$lib/components/portableTextStyles/PlainTextStyle.svelte';
import { urlFor } from "$lib/utils/image";
import { formatDate } from "$lib/utils/date";
import { formatAuthorName } from '$lib/utils/author.js';
let { data } = $props();
const author = data.teamMember
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
	<div class="author-wrapper">
		<div class="description">
			<div class="card">
				<img class="portrait" src={urlFor(author.portrait ? author.portrait : data.info.placeholder)} alt="">
				<div class="names">
					<h1 class="jost-74 mobile-jost-27 name">{formatAuthorName(author)}</h1>
					{#if author.role}<h3 class="jost-27 mobile-jost-16 role">{author.role[0].toUpperCase() + author.role.slice(1)}</h3>{/if}
				</div>
			</div>
			{#if author.abstract}
				<h4 class="abstract jost-27">{author.abstract}</h4>
			{/if}
			{#if author.teamBody}
				<div class="bio jost-18">
					<PortableText
						value={author.teamBody}
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
			{/if}
		</div>
	</div>
</section>

<style>
#author {
	display: grid;
	grid-template-columns: repeat(10, 1fr);
	padding: 0 var(--margin);
}
.author-wrapper {
	grid-column: 1 / span 10;
	overflow-y: scroll;
	position: sticky;
	top: 0;
	height: fit-content;
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
}

/* Description */
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
.role {
	margin-top: 1rem;
	max-width: 600px;
}
.portrait {
	width: 200px;
}
.abstract {
	margin-top: 2rem;
	max-width: 700px;
	padding-bottom: 2rem;
	margin-bottom: 2rem;
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
	.role {
		margin-top: .5rem;
	}
}
</style>