<script>
import { formatAuthorName } from "$lib/utils/author";
import { formatDate, isUpcoming, isOngoing } from "$lib/utils/date";
import { urlFor } from "$lib/utils/image";
let {
	production,
	placeholder,
	showInfo = true,
	related = true,
} = $props()
</script>

<a class="production" href="/esplora/{production.slug.current}">
	<img class="cover rounded"
	class:_1-1={production._type == "episode" || production._type == "podcast"}
	class:_16-9={production._type == "video" || production._type == "playlist"}
	src={urlFor(production.cover ? production.cover : placeholder).width(800)}
	alt="Copertina di {production.title}"
	>
	<h2 class="{related ? 'jost-24' : 'jost-18'} uppercase bold">{production.title}</h2>
	{#if production.subtitle}<h3 class="jost-18 bold">{production.subtitle}</h3>{/if}
	{#if showInfo}
		{#if production.authorsPreview}
			<p class="jost-18">di {#each production.authorsPreview as author, j}{formatAuthorName(author)}{@html production.authorsPreview.length > j+1 ? ', ' : ''}{/each}</p>
		{:else}
			{#if production.authors?.length < 5}
				<p class="jost-18">di {#each production.authors as author, j}{formatAuthorName(author)}{@html production.authors.length > j+1 ? ', ' : ''}{/each}</p>
			{:else if production.authors?.length >= 5}
				<p class="jost-18">di Autori vari</p>
			{/if}
		{/if}
	{/if}
</a>

<style>
.production h2, .production h3 {
	line-height: 1.05;
}
.production h3 {
	margin-top: .3em;
}
.production p {
	margin-top: 1rem;
}
.production .cover {
	margin-bottom: 1rem;
}
</style>