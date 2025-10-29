<script>
import { formatAuthorName } from "$lib/utils/author";
import { formatDate, isUpcoming, isOngoing } from "$lib/utils/date";
import { urlFor } from "$lib/utils/image";
let {
	event,
	slider = false,
	placeholder
} = $props()
</script>

<div class="event jost-15" class:slider={slider}>
	<a href={`/live/${event.slug.current}`}>
		<img class="cover _5-7" src={urlFor(event.cover ? event.cover : placeholder)} alt="">
		<time>{formatDate(event.start, event.end)}</time>
		<h2 class="jost-21 bold uppercase leading-105">{event.title}</h2>
		{#if event.subtitle}<h3 class="jost-21 bold leading-105">{event.subtitle}</h3>{/if}
	</a>
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
				<span class="tag customTag"
				style={event.accessColor ? `background-color: ${event.accessColor.hex}; color: var(--white);` : ""}
				>{event.accessTagLabel}</span>
			{/if}
		</div>
	{/if}
	{#if event.abstract}
		<p class="abstract" style="margin-top: 1em;">{event.abstract}</p>
	{/if}
	{#if event.peoplePreview}
		<p class="people" style={!event.abstract ? "margin-top: 1em;" : ''}>Con
			{#if event.peoplePreview?.length < 4}
				{#each event.peoplePreview as person, i}
					{#if person}
						{#if person.isAuthor}
							<a class="person hover-gray" href="/autori/{person.slug.current}">{formatAuthorName(person)}</a>
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
</div>

<style>
.event {
	position: relative;
}
.event .cover {
	margin-bottom: 1rem;
}
.event time {
	margin-bottom: 1rem;
	line-height: 1.1;
	display: block;
}
.tags {
	display: flex;
	flex-wrap: wrap;
	max-width: stretch;
	width: 100%;
	position: absolute;
	top: 0;
	left: 0;
	padding: .4em;
	gap: .2em;
}
.event.slider>a>*:not(img) {
	padding-right: 2rem;
}
.hover-gray {
	text-decoration: underline;
}
@media screen and (max-width: 800px) {
	.event time {
		margin-bottom: 0;
	}
}
</style>