<script>
    import { urlFor } from "$lib/utils/image";
    import { fileUrl } from '$lib/utils/sanity';
    import Event from "../Event.svelte";
    import Production from "../Production.svelte";

    let { portableText } = $props();
    let { value } = $derived(portableText);

    // Funzione per estrarre l'estensione (es. 'pdf', 'zip') dal riferimento Sanity
    function getExtension(ref) {
        if (!ref) return "";
        return ref.split("-").pop();
    }
</script>

{#if value._type === 'grid'}
<div class="grid" style="--cols: {value.items.length}">
    {#each value.items as item}
        <div class="grid-item">
            {#if item.internalReference}
                {#if ["video", "playlist", "episode", "podcast"].includes(item.internalReference._type)}
                    <Production production={item.internalReference} related={true}/>
                {:else if ["event", "eventSerie"].includes(item.internalReference._type)}
                    <Event event={item.internalReference}/>
                {/if}
            {:else if item.itemType === 'file'}
                {@const downloadLink = fileUrl(item.upload)}
                {@const extension = getExtension(item.upload?.asset?._ref)}
                
                <a class="file" href={downloadLink} target="_blank" style="--file-color: {item.color?.hex || 'var(--gray)'}">
                    <div class="cover _16-9 rounded">
                        <span class="extension jost-24 bold uppercase">{extension}</span>
						<svg width="17" height="29" viewBox="0 0 17 29" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M10.5466 0V8.832H16.3546L8.77058 18.408L1.09058 8.832H6.94658V0H10.5466Z"/>
							<path d="M0 23.1719H17V28.0742H0V23.1719Z"/>
						</svg>

                    </div>
					<h2 class="jost-24 uppercase bold">{item.title || 'Download'}</h2>
                </a>
            {/if}
        </div>
    {/each}
</div>
{/if}

<style>
.grid {
    display: grid;
    grid-template-columns: repeat(var(--cols), clamp(250px, 25vw, 600px));
    column-gap: var(--margin);
	row-gap: 4rem;
    margin: 4rem 0;
}
:global(.grid + .grid) {
	margin: 0 0 4rem;
}
.grid-item {
    width: 100%;
}
.file {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
}
.file .cover {
	position: relative;
    width: 100%;
    background-color: var(--file-color);
    margin-bottom: 1rem;
    overflow: hidden;
}
.file .extension {
	position: absolute;
	top: var(--margin);
	left: var(--margin);
}
.file svg {
	position: absolute;
	height: 1.1em;
	bottom: var(--margin);
	left: var(--margin);
	fill: var(--black);
}
.file h2 {
	line-height: 1.05;
}
.file p {
	margin-top: 1rem;
}
.file .cover {
	margin-bottom: 1rem;
}

@media screen and (max-width: 800px) {
	.grid {
		grid-template-columns: repeat(1, 1fr);
	}
}
</style>