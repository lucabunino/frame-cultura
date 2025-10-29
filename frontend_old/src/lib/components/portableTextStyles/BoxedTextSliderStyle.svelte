<!-- BoxedTextSliderStyle.svelte -->
<script>
import { register } from 'swiper/element/bundle';register();
import sliderInjectedStyle from '$lib/utils/sliderInjectedStyle.js';

let { portableText } = $props();
let { value } = $derived(portableText)

let mouse = $state({y: undefined, x: undefined});
let swiperEl = $state(undefined);
let boxedTextSliderTag = $state(undefined);
const swiperParams = {
	slidesPerView: 1.2,
	breakpoints: {
		500: {
			slidesPerView: 1.3,
		},
	},
	injectStyles: sliderInjectedStyle,
};

// Lifecycle
$effect(() => {
	if (swiperEl) {
		Object.assign(swiperEl, swiperParams);
		swiperEl.initialize();	
	}
})

// Functions
function onSwiperMouseEnter(e) {
	if (!swiperEl?.swiper) return;
	const target = e.currentTarget; // safer, since you bound it on <swiper-slide>
	if (target.classList.contains('swiper-slide-next')) {
		boxedTextSliderTag = 'Next';
	} else if (target.classList.contains('swiper-slide-prev')) {
		boxedTextSliderTag = 'Prev';
	}
}
function onSwiperMouseLeave(e) {
	boxedTextSliderTag = undefined
}
function handleMouseMove(e) {
	mouse.y = e.y
	mouse.x = e.x
}
</script>

<svelte:window onmousemove={(e) => {handleMouseMove(e)}}></svelte:window>
<swiper-container
init={false}
bind:this={swiperEl}
loop={false}
space-between={12}
slides-offset-after={18}
slide-to-clicked-slide={true}
>
	{#each value.items as item, i}
		<swiper-slide class="slide rounded"
		style={`--color: ${item.activeColor?.hex}`}
		onmouseenter={(e) => {onSwiperMouseEnter(e)}}
		onmouseleave={(e) => {onSwiperMouseLeave(e)}}
		role="button"
  		tabindex="0"
		>
			<div class="slide-content">
				<p class="jost-45 mobile-jost-27">{item.title}</p>
				{#if item.abstract}
					<p class="abstract jost-18">{item.abstract}</p>
				{/if}
			</div>
			{#if item.ctaLabel && item.ctaLink}
				<a class="btn" href={item.ctaLink}>{item.ctaLabel}</a>
			{/if}
		</swiper-slide>
	{/each}
</swiper-container>
{#if boxedTextSliderTag}
	<span class="boxedTextSliderTag btn outline" class:left={boxedTextSliderTag == 'Prev'} class:right={boxedTextSliderTag == 'Next'} style="top: {mouse.y}px; left: {mouse.x}px;">{boxedTextSliderTag}</span>
{/if}

<style>
swiper-container {
	width: stretch;
	margin-top: 4rem;
	margin-right: calc(var(--margin)*-1);
}
.slide {
	background-color: var(--gray);
	padding: 2rem var(--margin) 4rem;
	gap: 6rem;
	min-height: 35vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	cursor: pointer;
}
.slide:hover {
	background-color: var(--color);
}
.slide-content {
	max-width: 650px;
}
.abstract {
	margin-top: 3rem;
}
.btn {
	width: fit-content;
}
.boxedTextSliderTag {
	position: fixed;
	z-index: 8;
	transition: var(--transition);
	transition-property: transform;
	transition-duration: 800ms;
}
.boxedTextSliderTag.right {
	transform: translateX(-100%);
}
</style>