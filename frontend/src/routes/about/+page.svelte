<script>
import { PortableText } from '@portabletext/svelte'
import AboutTextStyle from "$lib/components/portableTextStyles/AboutTextStyle.svelte";
import BoxedTextStyle from "$lib/components/portableTextStyles/BoxedTextStyle.svelte";
import BoxedTextSliderStyle from "$lib/components/portableTextStyles/BoxedTextSliderStyle.svelte";
import PersonTextStyle from "$lib/components/portableTextStyles/PersonTextStyle.svelte";
import StatTextStyle from "$lib/components/portableTextStyles/StatTextStyle.svelte";
import { urlFor } from "$lib/utils/image";
import { slide } from "svelte/transition";
import { innerWidth } from 'svelte/reactivity/window';

let { data } = $props();
let activeSection = $state(0)
let activeSectionMobile = $state(undefined)
let rawBlocks = data.about.body;
let processedBlocks = [];

for (let i = 0; i < rawBlocks.length; ) {
	if (rawBlocks[i]._type === 'boxedText') {
		let group = [];
		while (rawBlocks[i]?._type === 'boxedText') {
			group.push(rawBlocks[i]);
			i++;
		}
		processedBlocks.push({
			_key: crypto.randomUUID?.() ?? Math.random().toString(36),
			_type: 'boxedTextGroup',
			items: group
		});
	} else {
		processedBlocks.push(rawBlocks[i]);
		i++;
	}
}

let sections = $state([]);
let current = $state(null);

for (let block of processedBlocks) {
	if (block._type === "anchor") {
		current = { anchor: block, content: [] };
		sections.push(current);
	} else if (current) {
		current.content.push(block);
	}
}
</script>

{#if data.about.introduction}
	<section id="intro">
		<h1 class="jost-74">{data.about.introduction}</h1>
	</section>
{/if}

<section id="about">
	{#if innerWidth.current > 800}
		<nav class="navigator">
			{#each data.about.body as block, i}
				{#if block._type === 'anchor'}
					<a class="navigator-item jost-18 uppercase bold" href="#{block.slug.current}"
					class:active={activeSection == i}
					onclick={() => activeSection = i}
					style={`--color: ${block.activeColor?.hex}`}
					>{block.title}</a>
				{/if}
			{/each}
		</nav>
		<div class="body">
			<PortableText
			value={processedBlocks}
			components={{
			block: {
				normal: AboutTextStyle,
				h1: AboutTextStyle,
			},
			listItem: AboutTextStyle,
			marks: {
				link: AboutTextStyle,
			},
			types: {
				anchor: AboutTextStyle,
				boxedText: BoxedTextStyle,
				boxedTextGroup: BoxedTextSliderStyle,
				person1: PersonTextStyle,
				person3: PersonTextStyle,
				stat: StatTextStyle,
			}
			}}/>
		</div>
	{:else}
		{#each sections as section, i}
			<button
				class="navigator-item jost-18 uppercase bold"
				class:active={activeSectionMobile === i}
				onclick={() => activeSectionMobile = activeSectionMobile === i ? null : i}
				style={`--color: ${section.anchor.activeColor?.hex}`}
			>
				{section.anchor.title}
				<svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path fill="#fff" d="M0 12h27v3H0z"/>
					<path class="minus" fill="#fff" d="M12 27V0h3v27z"/>
				</svg>
			</button>
			{#if activeSectionMobile === i}
				<div class="body" transition:slide>
					<PortableText
						value={section.content}
						components={{
							block: {
								normal: AboutTextStyle,
								h1: AboutTextStyle,
							},
							listItem: AboutTextStyle,
							marks: {
								link: AboutTextStyle,
							},
							types: {
								anchor: AboutTextStyle,
								boxedText: BoxedTextStyle,
								boxedTextGroup: BoxedTextSliderStyle,
								person1: PersonTextStyle,
								person3: PersonTextStyle,
								stat: StatTextStyle,
							}
						}}
					/>
				</div>
			{/if}
		{/each}
	{/if}
</section>

<style>
/* Intro */
#intro {
	padding: var(--margin);
}

/* Explore */
#about {
	padding: var(--margin);
	display: grid;
	grid-template-columns: repeat(10, 1fr);
	gap: var(--gutter);
}
.navigator {
	grid-column: 1 / span 2;
	display: flex;
	flex-direction: column;
	position: sticky;
	top: calc(var(--margin)*2 + 4rem);
	height: fit-content;
}
.navigator-item {
	padding: 1rem var(--margin);
}
.navigator-item + .navigator-item {
	border-top: solid 1px;
}
.navigator-item.active {
	border-top: 0;
	background-color: var(--color);
	color: var(--white) !important;
	border-radius: .6rem;
}
.body {
	grid-column: 4 / span 7;
	display: flex;
	column-gap: var(--margin);
	flex-wrap: wrap;
}
@media only screen and (max-width: 1080px) {
	.navigator {
		grid-column: 1 / span 3;
		padding-right: var(--gutter);
	}
}
@media only screen and (min-width: 801px) {
	.navigator-item:not(.active):hover {
		border-right: solid 5px var(--black);
		padding-right: calc(var(--margin) - 5px);
		border-radius: 0;
	}
	.navigator-item:not(:first-of-type).active {
		margin-top: 1px;
	}
	.navigator-item.active + .navigator-item {
		border-top: 0;
		margin-top: 1px;
	}
}
@media only screen and (max-width: 800px) {
	#about {
		grid-template-columns: repeat(1, 1fr);
		gap: 4px;
	}
	.navigator-item {
		padding: 2rem var(--margin);
		border-top: 0;
		background-color: var(--color);
		border-radius: .6rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: var(--white) !important;
	}
	.navigator-item.active .minus {
		display: none;
	}
	.navigator-item svg {
		height: 1.5em;
		width: auto;
	}
	.navigator-item + .navigator-item {
		border-top: unset;
	}
	.body {
		margin: 2rem 0 6rem;
		grid-column: 1 / span 1;
		width: calc(100vw - var(--margin)*2)

	}
}
</style>