<script>
import Organization from "$lib/components/Organization.svelte";
let { data } = $props();
let activeOrganization = $state(0)
let activeOrganizationMobile = $state(undefined)
</script>

{#if data.network.introduction}
	<section id="intro">
		<h1 class="jost-27">{data.network.introduction}</h1>
	</section>
{/if}

<section id="network">
	
	<nav class="navigator">
		{#each data.network.network as cluster, i}
			<a class="navigator-item jost-18 uppercase bold" href="#{cluster.slug.current}"
			class:active={activeOrganization == i}
			onclick={() => activeOrganization = i}
			style={`--color: ${cluster.activeColor?.hex}`}
			>{cluster.title}</a>
		{/each}
	</nav>
	<div class="network">
		{#each data.network.network as cluster, i}
			<h4 class="jost-12 uppercase bold" id={cluster.slug.current}>{cluster.title}</h4>
			<div class="organizations">
				{#each cluster.organizations as organization, j}
					<Organization organization={organization}/>
				{/each}
			</div>
		{/each}
	</div>
</section>

<style>
#network {
	padding: var(--margin);
	display: grid;
	grid-template-columns: repeat(10, 1fr);
	gap: var(--gutter);
}
/* Intro */
#intro {
	padding: var(--margin) var(--margin) 4rem;
	max-width: 1000px;
}
/* Navigator */
.navigator {
	grid-column: 1 / span 2;
	display: flex;
	flex-direction: column;
	position: sticky;
	top: calc(var(--margin)*2 + 4rem);
	height: fit-content;
}
.navigator-item {
	padding: var(--gutter);
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
/* Network */
.network {
	grid-column: 4 / span 7;
	display: flex;
	flex-wrap: wrap;
}
.organizations {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	column-gap: var(--gutter);
	row-gap: 6rem;
	align-items: start;
}
h4 {
	flex-basis: 100%;
	border-bottom: solid 1px var(--black);
	margin-top: 2rem;
	padding-top: 8rem;
	padding-bottom: 1rem;
}
h4:first-of-type {
	margin-top: 0;
	padding-top: 0;
}
@media only screen and (min-width: 1600px) {
	.organizations {
		grid-template-columns: repeat(5, 1fr);
	}
}
@media only screen and (max-width: 1080px) {
	.navigator {
		grid-column: 1 / span 3;
		padding-right: var(--gutter);
	}
	.organizations {
		grid-template-columns: repeat(3, 1fr);
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
	#network {
		grid-template-columns: repeat(1, 1fr);
		gap: 4px;
	}
	.network {
		grid-column: 1 / span 1;
	}
	.navigator {
		display: none;
	}
	.organizations {
		row-gap: 2rem;
	}
}
@media only screen and (max-width: 400px) {
	.organizations {
		grid-template-columns: repeat(2, 1fr);
	}
}
</style>