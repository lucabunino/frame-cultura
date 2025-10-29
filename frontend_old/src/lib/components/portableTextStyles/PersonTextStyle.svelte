<!-- PersonTextStyle -->
<script>
import { urlFor } from '$lib/utils/image';
let { portableText } = $props();
let { value } = $derived(portableText)
const isLastOfType =
		!portableText.global.ptBlocks[portableText.indexInParent + 1] ||
		portableText.global.ptBlocks[portableText.indexInParent + 1]._type !== value._type;
</script>

{#if value._type === 'person1'}
	<a class="person person1 {isLastOfType ? 'last' : ''}" href="/team/{value.person.slug.current}">
		<div class="portrait-wrapper">
			{#if value.person.portrait}
				<img class="portrait" src={urlFor(value.person.portrait)} alt="">
			{:else}
				<div class="portrait"></div>
			{/if}
			<div class="more jost-15 bold"><span>+</span></div>
		</div>
		<div class="text">
			<h2 class="jost-30">{value.person.name} {value.person.surname}</h2>
			{#if value.person.role}<h3 class="jost-18">{value.person.role}</h3>{/if}
			{#if value.person.abstract}<p class="abstract jost-18">{value.person.abstract}</p>{/if}
		</div>
	</a>
{:else if value._type === 'person3'}
	<a class="person person3" href="/team/{value.person.slug.current}">
		<div class="portrait-wrapper">
			{#if value.person.portrait}
				<img class="portrait" src={urlFor(value.person.portrait)} alt="">
			{:else}
				<div class="portrait"></div>
			{/if}
			<div class="more jost-15 bold"><span>+</span></div>
		</div>
		<div class="text">
			<h2 class="jost-30">{value.person.name} {value.person.surname}</h2>
			{#if value.person.role}<h3 class="jost-18">{value.person.role}</h3>{/if}
			<!-- {#if value.person.abstract}<p class="abstract jost-15">{value.person.abstract}</p>{/if} -->
		</div>
	</a>
{/if}

<style>
.person {
	display: flex;
	column-gap: calc(var(--margin)*3);
	row-gap: calc(var(--margin)*2);
	padding: 1rem 0 2rem;
}
.person1 {
	align-items: center;
	flex-basis: 100%;
	border-bottom: solid 1px var(--black);
	margin-bottom: 1.5rem;
}
.person1.last {
	border-bottom: 0;
}
.person3 {
	align-items: flex-start;
	flex-basis: calc((100% - var(--margin)*2)/3);
	flex-direction: column;
	margin-bottom: 3rem;
}
.text {
	width: fit-content;
	max-width: 650px;
}
h2 {
	display: inline-flex;
	align-items: center;
}
h3 {
	margin-top: .5rem;
}
.abstract {
	margin-top: 3rem;
}
.portrait-wrapper {
	display: block;
	position: relative;
	width: 100%;
	max-width: 250px;
	background-color: var(--gray);
	border-radius: 100%;
}
.portrait {
	width: 100%;
	background-color: var(--gray);
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
.person:hover .more {
	opacity: 1;
}
.more span {
	padding-bottom: .2rem;
}
@media only screen and (max-width: 800px) {
	.person {
		flex-direction: column;
		align-items: flex-start;
		row-gap: 1rem;
		padding-bottom: 4rem;
	}
	.portrait-wrapper {
		max-width: 150px;
	}
	.person3 {
		flex-basis: calc((100% - var(--margin))/2);
		margin-bottom: 0;
	}
}
</style>