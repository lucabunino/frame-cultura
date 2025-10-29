<script>
import { urlFor } from "$lib/utils/image";
import gsap from "gsap";

let { productions } = $props();

let container;
let items = $state([]);
let innerWidth = $state(undefined);
let innerHeight = $state(undefined);
let domLoaded = $state(false)
const modifierX = .7
let baseHeight = $derived.by(() => {
	if (!innerWidth) return 100;

	const ratios = productions.map(p =>
		(p._type === "podcast" || p._type === "episode") ? 1 : 16 / 9
	);
	const totalRatio = ratios.reduce((a, b) => a + b, 0);
	return Math.min(innerWidth / totalRatio * modifierX, 150);
});

$effect(() => {
	domLoaded = true
})

function handleMouseMove(e) {
	const mouseX = e.clientX;

	let closest = null;
	let minDist = Infinity;

	items.forEach((el) => {
		const rect = el.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const dist = Math.abs(mouseX - centerX);

		if (dist < minDist) {
			minDist = dist;
			closest = el;
		}
	});

	items.forEach((el) => {
		const img = el.querySelector(".cover");
		if (!img) return;

		const rect = el.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const dist = mouseX - centerX; // signed distance!
		const proximity = Math.max(0, 1 - Math.abs(dist) / 350);
		const height = baseHeight * (1 + (el === closest ? proximity * 1 : proximity * .5));
		const offsetX = dist * .2 * (el === closest ? proximity * 1 : proximity * 0);

		gsap.to(img, {
			height,
			duration: 0.4,
			ease: "power3.out",
			overwrite: "auto"
		});

		gsap.to(el, {
			x: offsetX,
			zIndex: el === closest ? 10 : 1,
			duration: 0.4,
			ease: "power3.out",
			overwrite: "auto"
		});
	});

	// optional scroll logic (can remove if you want it static)
	const maxScroll = container.scrollWidth - container.clientWidth;
	const ratio = e.clientX / innerWidth;
	container.scrollLeft = maxScroll * ratio;
}

function handleMouseLeave() {
	items.forEach(el => {
		const img = el.querySelector(".cover");
		gsap.killTweensOf([img, el]);
		gsap.to(img, {
			height: baseHeight,
			duration: 0.2,
			ease: "power2.out"
		});
		gsap.to(el, {
			x: 0,
			zIndex: 1,
			duration: 0.2,
			ease: "power2.out"
		});
	});
}

</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="productions-wrapper-x" bind:this={container} class:invisible={!domLoaded}>
	<div class="productions-wrapper-y" style="height: 18vw;">
		<div class="productions"
		onmousemove={handleMouseMove}
		onmouseleave={handleMouseLeave}
		role="region"
		>
		{#each productions as production, i}
			<a
				bind:this={items[i]}
				class="production jost-18"
				href={`/esplora/${production.slug.current}`}
			>
				<img
					style="height: {baseHeight}px"
					class="cover rounded"
					class:_1-1={production._type == "episode" || production._type == "podcast"}
					class:_16-9={production._type == "video" || production._type == "playlist"}
					src={urlFor(production.cover)}
					alt=""
				/>
				<div class="production-text jost-18">
					<h2 class="uppercase bold">{production.title}</h2>
					{#if production.subtitle}
						<h3 class="bold">{production.subtitle}</h3>
					{/if}
					<p>
						{#if production._type == "video"}Guarda il video{/if}
						{#if production._type == "playlist"}Guarda la playlist{/if}
						{#if production._type == "episode"}Ascolta l'episodio{/if}
						{#if production._type == "podcast"}Ascolta il podcast{/if}
					</p>
				</div>
			</a>
		{/each}
		</div>
	</div>
</div>


<style>
.productions-wrapper-x {
	overflow-x: auto;
	-webkit-overflow-scrolling: touch;
	width: 100vw;
	padding-bottom: 5rem;
}
.productions-wrapper-y {
	overflow-y: visible;
	align-content: center;
	justify-items: center;
}
.productions {
	display: flex;
	align-items: center;
	justify-content: center;
	overflow-y: visible;
	gap: 4px;
	width: max-content;
	/* justify-self: center; */
}
.production {
	position: relative;
	text-align: center;
	scroll-snap-align: center;
	flex-shrink: 0;
	transform-origin: center center;
	will-change: transform;
	width: auto;
}
.cover {
	width: auto;
}
.production-text {
	margin-top: 1rem;
	position: absolute;
	top: 100%;
	left: 50%;
	transform: translateX(-50%);
	width: 0;
	opacity: 0;
	justify-items: center;
	pointer-events: none;
}
.production-text * {
	white-space: nowrap;
}
.production:hover .production-text {
	opacity: 1;
}
</style>