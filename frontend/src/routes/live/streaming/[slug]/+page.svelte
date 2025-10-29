<script>
import Live from '$lib/components/Live.svelte';
import LiveFrame from '$lib/components/LiveFrame.svelte';
import { formatDate, isPast } from '$lib/utils/date.js';
import { urlFor } from '$lib/utils/image.js';
let { data } = $props();
</script>

<svelte:head>
	{#if data.seo.SEOTitle}<title>{data.seo.SEOTitle} — {data.liveStreaming.title}</title>{/if}
	{#if data.liveStreaming.SEODescription}<meta name="description" content={data.liveStreaming.SEODescription}>{/if}
	{#if data.liveStreaming.SEOHidden}
		<meta name="robots" content="index,follow">
		<meta name="robots" content="noindex, nofollow" />
	{/if}
	{#if data.seo.SEOTitle}<meta property="og:title" content={`${data.seo.SEOTitle} — ${data.liveStreaming.title}`}>{/if}
	{#if data.liveStreaming.SEODescription}<meta property="og:description" content={data.liveStreaming.SEODescription}>{/if}
	{#if data.liveStreaming.cover}<meta property="og:image" content={urlFor(data.liveStreaming.cover).width(1200).url()}>{/if}
	{#if data.seo.SEOTitle}<meta property="og:site_name" content={`${data.seo.SEOTitle} — ${data.liveStreaming.title}`}>{/if}
</svelte:head>

<section id="live-streaming" style="--bgColor:{data.liveStreaming.bgColor.hex}">
	<h1 class="jost-74 uppercase">{data.liveStreaming.title}</h1>
	{#if data.liveStreaming.subtitle}<h2 class="jost-45 subtitle">{data.liveStreaming.subtitle}</h2>{/if}
	<h3 class="jost-18 bold bold uppercase"><div class="dot"></div>{isPast(data.liveStreaming.start) ? "Live streaming" : "In programma"}</h3>
	<time class="jost-18 bold bold uppercase" datetime={data.liveStreaming.start}>{formatDate(data.liveStreaming.start)}</time>
	<div class="live-container rounded _16-9">
		<LiveFrame live={data.liveStreaming}/>
	</div>
</section>

<style>
#live-streaming {
	padding: var(--margin);
}
h3 {
	margin-top: 1.5rem;
	display: flex;
	gap: .4em;
	vertical-align: center;
}
time {
	display: block;
}
.dot {
	background-color: var(--bgColor);
	width: .9em;
	height: .9em;
	aspect-ratio: 1;
	border-radius: 999em;
	animation: blink 1s step-start 0s infinite;
	margin-bottom: .05em;
	align-self: center;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}
.live-container {
	margin-top: 4rem;
	overflow: hidden;
	position: relative;
	max-height: calc(100vh - (var(--margin)*2 + 4rem) - 2rem);
	background-color: var(--black);
}
</style>