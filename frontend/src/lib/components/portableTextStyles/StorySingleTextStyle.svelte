<script>
    import { urlFor } from "$lib/utils/image";
    import { fileUrl } from '$lib/utils/sanity';

    let { portableText } = $props();
    let { value } = $derived(portableText);

    const typeMap = {
        video: 'esplora',
        playlist: 'esplora',
        podcast: 'esplora',
        event: 'live',
        eventSerie: 'live',
        episode: 'esplora'
    };

    let linkData = $derived.by(() => {
        const urlFromFile = fileUrl(value.fileUpload);
        if (urlFromFile) {
            return { 
                href: urlFromFile, 
                target: '_blank', 
                download: true,
                label: 'Scarica file' 
            };
        }
        if (value.reference) {
            const segment = typeMap[value.reference._type] || 'content';
            const slug = value.reference.slug?.current || value.reference.slug;
            const labels = {
                video: 'Guarda video',
                podcast: 'Ascolta il podcast',
                episode: 'Ascolta l’episodio',
                event: 'Scopri evento'
            };
            return { 
                href: `/${segment}/${slug}`, 
                label: labels[value.reference._type] || 'Scopri di più'
            };
        }
        if (value.externalLink) {
            return { 
                href: value.externalLink, 
                target: '_blank',
                label: 'Vai al sito'
            };
        }
        return null;
    });
</script>

{#if value._type === 'single'}
    <div class="single">
        {#if value.cover}
            <div class="image-container">
                {#if linkData}
                    <a href={linkData.href} target={linkData.target} class="img-link">
                        <img class="rounded shadow" src={urlFor(value.cover).width(1080)} alt={value.title || ""}>
                    </a>
                {:else}
                    <img class="rounded shadow" src={urlFor(value.cover).width(1080)} alt={value.title || ""}>
                {/if}
            </div>
        {/if}
        
        <div class="text">
            {#if value.title}
                <h4 class="jost-45 uppercase">{value.title}</h4>
            {/if}
            
            {#if value.description}
                <p class="description jost-18 {value.title ? 'marginTop' : ''}">
                    {value.description}
                </p>
            {/if}            
            
            {#if linkData}
                <a 
                    href={linkData.href} 
                    target={linkData.target} 
                    class="btn bg-gray"
                    rel={linkData.target === '_blank' ? 'noopener noreferrer' : undefined}
                    download={linkData.download ? "" : undefined}
                >
                    {value.ctaLabel ? value.ctaLabel : linkData.label} 
                </a>
            {/if}
        </div>
    </div>
{/if}

<style>
    .single {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        max-width: 800px;
        gap: calc(var(--margin) * 4);
        margin: 8rem 0;
    }

    .image-container img {
        width: 100%;
        display: block;
        height: auto;
    }

    .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .description.marginTop {
        margin-top: 3rem;
    }

	.btn {
		width: fit-content;
		margin-top: 5rem;
	}
</style>