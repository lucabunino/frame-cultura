<script>
import Event from "./Event.svelte";
import Production from "./Production.svelte";
import { register } from 'swiper/element/bundle';register();
let {
	related,
} = $props()
let domLoaded = $state(false)
let swiperRelatedEl = $state(false)
$effect(() => {
	if (swiperRelatedEl) {
		const swiperParams = {
			breakpoints: {
				0: {
					slidesPerView: 1.6,
					slidesOffsetBefore: 15,
					slidesOffsetAfter: 15,
				},
				400: {
					slidesPerView: 2.4,
					slidesOffsetBefore: 15,
					slidesOffsetAfter: 15,
				},
				800: {
					slidesPerView: 3.2,
					slidesOffsetBefore: 15,
					slidesOffsetAfter: 15,
				},
				1200: {
					slidesPerView: 4.2,
					slidesOffsetBefore: 21,
					slidesOffsetAfter: 21,
				},
				1513: {
					slidesPerView: 5.2,
					slidesOffsetBefore: 21,
					slidesOffsetAfter: 21,
				},
				1800: {
					slidesPerView: 6.2,
					slidesOffsetBefore: 21,
					slidesOffsetAfter: 21,
				},
			},
		};
		Object.assign(swiperRelatedEl, swiperParams);
		swiperRelatedEl.initialize();
	}
	domLoaded = true
})
</script>

<section id="related">
	<h4 class="jost-12 uppercase bold">Contenuti correlati</h4>
	<swiper-container class="events"
	bind:this={swiperRelatedEl}
	init={false}
	class:invisible={!domLoaded}
	loop={false}
	space-between={15}
	grabCursor={true}
	free-mode={false}
	mousewheel-force-to-axis={true}
	>
		{#each related as item, i}
			<swiper-slide>
				{#if ["video", "playlist", "episode", "podcast"].includes(item._type)}
					<Production production={item} related={true}/>
				{:else if ["event", "eventSerie"].includes(item._type)}
					<Event event={item}/>
				{/if}
			</swiper-slide>
		{/each}
	</swiper-container>
</section>

<style>
#related h4 {
	padding: 8rem var(--margin) 2rem;
}
</style>