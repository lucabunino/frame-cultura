<script>
import { urlFor } from "$lib/utils/image";
let {organization} = $props()
</script>

{#if organization.link}
	<a href={organization.link} target="_blank" rel="noopener noreferrer" class="organization">
		<img class="_1-1" src={urlFor(organization.logo)} alt="">
		<h2>{organization.title}</h2>
	</a>
{:else}
	<div class="organization">
		<img class="_1-1" src={urlFor(organization.logo)} alt="">
		<h2>{organization.title}</h2>
	</div>
{/if}

<style>
.organization {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
}
.organization img {
	padding: 2rem;
	object-fit: contain;
}
</style>