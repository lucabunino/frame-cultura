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
function extractVimeoID(url) {
	const regExp = /vimeo\.com\/(\d+)/;
	const match = url.match(regExp);
	return match ? match[1] : '';
}
</script>

<svelte:window></svelte:window>

{#if isPast(live.start)}
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
		{:else if live.embed.provider === 'Vimeo'}
			<iframe
			title="Vimeo live: {live.title}"
			src={`https://player.vimeo.com/video/${extractVimeoID(live.embed.url)}`}
			width="640"
			height="360"
			frameborder="0"
			allow="autoplay; fullscreen; picture-in-picture"
			allowfullscreen
			></iframe>
		{:else if live.embed.provider === 'Facebook'}
			<iframe
			title="Facebook live: {live.title}"
			src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(live.embed.url)}&show_text=0&width=560`}
			width="560"
			height="315"
			style="border:none;overflow:hidden"
			scrolling="no"
			frameborder="0"
			allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
			allowfullscreen
			></iframe>
		{/if}
	{/if}
{:else}
	<img src={urlFor(live.cover).width(800)} alt="">
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