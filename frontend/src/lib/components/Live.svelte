<script>
import { browser } from "$app/environment";
import { isPast } from "$lib/utils/date";
import { urlFor } from "$lib/utils/image";
import { onMount } from "svelte";
import { fade, fly, slide } from "svelte/transition";
import LiveFrame from "./LiveFrame.svelte";
let {
	live,
} = $props()
let now = $state(new Date());
let clientReady = $state(false);
let liveOpen = $state(false);
$effect(() => {
	if (browser && clientReady) {
		localStorage.setItem("liveOpen", liveOpen);
	}
});
onMount(() => {
	if (browser) {
		const stored = localStorage.getItem("liveOpen");
		liveOpen = stored !== null ? stored === "true" : true;
		clientReady = true;
	}
	const interval = setInterval(() => (now = Date.now()), 1000);
	return () => clearInterval(interval);
});
let countdown = $derived.by(() => {
	if (!live?.start) return 0;
	const liveStart = new Date(live.start);
	return Math.max(0, liveStart - now);
});
function formatCountdown(ms) {
	const totalSeconds = Math.floor(ms / 1000);
	const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
	const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
	const seconds = String(totalSeconds % 60).padStart(2, '0');
	return `${hours}:${minutes}:${seconds}`;
}
</script>

<svelte:window></svelte:window>

{#if clientReady}
<div id="live" class="rounded shadow jost-15 mobile-jost-12 bold" style="--bgColor:{live.bgColor.hex}"
transition:slide={{ axis: "y", duration: 500 }}
>
	<a href="/live/streaming/{live.slug.current}" class="title-container">
		{#if isPast(live.start)}
			<div class="dot"></div>
		{/if}
		<h1 class="uppercase">{live.title}</h1>
		{#if live.subtitle}<h2>{live.subtitle}</h2>{/if}
		<button aria-label="Live switch" id="liveSwitch" onclick={(e) => {e.preventDefault(); liveOpen = !liveOpen}} class:crossed={liveOpen}>
			<div class="line"></div>
			<div class="line"></div>
		</button>
	</a>
	{#if liveOpen}
		<div class="live-container"
		transition:slide={{ axis: "y", duration: 500 }}
		>
			<LiveFrame live={live}/>
		</div>
	{/if}
</div>
{/if}

<style>
/* Box */
#live {
	width: stretch;
	height: auto;
	position: fixed;
	margin-left: calc(var(--margin)/2);
	right: calc(var(--margin)/2);
	bottom: var(--margin);
	color: var(--white);
	overflow: hidden;
	transition: var(--transition);
	z-index: 9;
	max-width: 400px;
	background-color: var(--bgColor);
}
.title-container {
	display: flex;
	gap: .5em;
	padding: 1em 2em;
	align-items: center;
	position: relative;
}
.title-container .dot {
	background-color: var(--white);
	width: .9em;
	height: .9em;
	aspect-ratio: 1;
	border-radius: 999em;
	margin-bottom: .05em;
	animation: blink 1s step-start 0s infinite;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}
.title-container h1 {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	flex-shrink: 1;
	min-width: 0;
	font-weight: bold;
}
.title-container h2 {
	margin-left: 1em;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	flex-shrink: 100;
	min-width: 0;
	padding-right: 3rem;
}
#liveSwitch {
	z-index: 9;
	height: 100%;
	cursor: pointer;
	display: block;
	position: absolute;
	right: 0;
	aspect-ratio: 1;
	align-self: center;
	background-color: var(--bgColor);
	justify-items: center;
}
#liveSwitch .line {
	width: 50%;
	height: 2px;
	background-color: var(--white);
	position: absolute;
	transition: var(--transition);
	transition-property: top, transform, transform-origin, width;
	transform-origin: center;
}

#liveSwitch .line:nth-child(1) {transform: translateY(-50%)}
#liveSwitch .line:nth-child(2) {transform: translateY(-50%) rotate(-90deg);}
#liveSwitch.crossed .line:nth-child(1) {
	transform: translateY(-50%) rotate(45deg);
	top: 50%;
}
#liveSwitch.crossed .line:nth-child(2) {
	transform: translateY(-50%) rotate(-45deg);
	top: 50%;
}

/* Live container */
.live-container {
	position: relative;
	aspect-ratio: 16/9;
	width: 100%;
}
@media screen and (max-width: 800px) {
	#live {
		max-width: unset;
	}
}
</style>