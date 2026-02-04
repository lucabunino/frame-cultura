<script>
    import { register } from 'swiper/element/bundle'; register();
    import sliderInjectedStyle from '$lib/utils/sliderInjectedStyle.js';
    import { urlFor } from "$lib/utils/image";

    let { portableText } = $props();
    let { value } = $derived(portableText);

    let mouse = $state({y: 0, x: 0});
    let swiperEl = $state(undefined);
    let isInside = $state(false);
	
	const swiperParams = {
		slidesPerView: 'auto',
		spaceBetween: 5,
		slidesOffsetBefore: 15,
		slidesOffsetAfter: 15,
		mousewheel: {
            forceToAxis: true,
        },
		grabCursor: true,
		injectStyles: sliderInjectedStyle,
	};

    $effect(() => {
        if (swiperEl) {
            Object.assign(swiperEl, swiperParams);
            swiperEl.initialize();  
        }
    });
</script>

<swiper-container
init={false}
bind:this={swiperEl}
loop={false}
slides-offset-before={20}
slides-offset-after={20}
>
	{#each value.images as item, i}
		<swiper-slide class="slide">
			<div class="image-box">
				<img 
					src={urlFor(item).height(500).url()} 
					alt={item.alt || `Slide ${i + 1}`} 
					loading="lazy"
				/>
			</div>             
			<figcaption class="jost-18">
				<strong>Fig. {i + 1}</strong>
				{#if item.asset?.description} – {item.asset.description}{/if}
			</figcaption>
		</swiper-slide>
	{/each}
</swiper-container>

<style>
swiper-container {
    margin: 8rem calc(var(--margin)*-1);
    width: stretch;
}

swiper-slide {
    width: auto;
    display: flex;
    flex-direction: column;
}

.image-box {
    height: 300px;
    width: auto;
    background-color: var(--gray);
}

.image-box img {
    height: 100%;
    width: auto;
    display: block;
    pointer-events: none;
}

figcaption {
    margin-top: 1.5rem;
    white-space: nowrap;
}

.boxedTextSliderTag {
    position: fixed;
    pointer-events: none;
    z-index: 100;
}

.boxedTextSliderTag.right {
    transform: translate(-120%, -50%);
}

.boxedTextSliderTag.left {
    transform: translate(20%, -50%);
}
</style>