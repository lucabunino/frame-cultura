<script>
import { browser } from "$app/environment";
import { isPast } from "$lib/utils/date";
import { urlFor } from "$lib/utils/image";
import { onMount } from "svelte";
import { fade, fly, slide } from "svelte/transition";
let {
	live,
} = $props()
let now = $state(new Date());
let clientReady = $state(false);
let liveOpen = $state(false);
let liveStarted = $derived(live?.start ? now >= new Date(live.start) : false)
let liveStarted = $derived(live?.start ? now >= new Date(live.start) : false)
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
function extractYouTubeID(url) {
	const regExp = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/;
	const match = url.match(regExp);
	return match ? match[1] : '';
}
</script>

<svelte:window></svelte:window>

{#if liveStarted}
	{#if live.embed && live.embed.url}
		{#if live.embed.provider === 'YouTube'}
			<iframe
			title="Youtube live: {live.title}"
			width="560"
			height="315"
			src={`https://www.youtube.com/embed/${extractYouTubeID(live.embed.url)}`}
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
			></iframe>
		{:else if live.embed.provider === 'Facebook'}
			<iframe
			title="Facebook live: {live.title}"
			src={live.embed.url}
			width="1920"
			height="1080"
			style="border:none;overflow:hidden"
			scrolling="no"
			frameborder="0"
			allowfullscreen="true"
			allowfullscreen="true"
			allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
			allowFullScreen></iframe>
			allowFullScreen></iframe>
		{/if}
	{/if}
{:else}
	<img src={urlFor(live.cover).width(1920)} alt="">
	<img src={urlFor(live.cover).width(1920)} alt="">
	<a href="/live/streaming/{live.slug.current}" class="countdown btn bg-white">Live tra {formatCountdown(countdown)}</a>
{/if}

<style>
img,
iframe {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
}
.countdown {
	width: clamp(0px, 65%, 300px);
	white-space: pre;
	text-align: center;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translateX(-50%) translateY(-50%);
	text-overflow: ellipsis;
    overflow: hidden;
}
.countdown:hover {
	background-color: var(--bgColor);
}
</style>