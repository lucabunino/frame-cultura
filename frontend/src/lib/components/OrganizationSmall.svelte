<script>
import { urlFor } from "$lib/utils/image";
let {organization} = $props()
</script>

{#if organization.link}
	<a href={organization.link} target="_blank" rel="noopener noreferrer" class="organization">
		<img class="_1-1" src={urlFor(organization.logo)} alt="">
		{#if organization.displayTitle}<h2 class="jost-15 mobile-jost-12">{organization.title}</h2>{/if}
	</a>
{:else}
	<div class="organization">
		<img class="_1-1" src={urlFor(organization.logo)} alt="">
		{#if organization.displayTitle}<h2 class="jost-15 mobile-jost-12">{organization.title}</h2>{/if}
	</div>
{/if}

<style>
.organization {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	max-width: 120px;
}
.organization img {
	object-fit: contain;+
	width: 100%;
}
@media screen and (max-width: 800px) {
	.organization {
		max-width: 80px;
	}
}
</style>