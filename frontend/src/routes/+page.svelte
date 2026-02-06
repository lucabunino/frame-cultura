<script>
import { urlFor } from "$lib/utils/image";
import { formatDate } from "$lib/utils/date";
import ProductionsWidget from "$lib/components/ProductionsWidget.svelte";
import Event from "$lib/components/Event.svelte";
import { register } from 'swiper/element/bundle';register();
import { formatAuthorName } from "$lib/utils/author.js";
import { colors } from "$lib/utils/color.js";
import { innerWidth, innerHeight, scrollY } from 'svelte/reactivity/window';

let { data } = $props();
const homepage = data.homepage
let domLoaded = $state(false)
let activeAuthorIndex = $state(0)
let activeAuthor = $derived(homepage.authorsSelection[activeAuthorIndex])
let authorEls = $state([])
let swiperProductionsMobileEl = $state(undefined)
let activeProductionIndex = $state(0)
let activeProduction = $derived(homepage.productionsSelection[activeProductionIndex])
let swiperAuthorsMobileEl = $state(undefined)
let swiperLiveEl = $state(undefined)

$effect(() => {
	if (swiperProductionsMobileEl) {
		swiperProductionsMobileEl.initialize();
	}
	if (swiperAuthorsMobileEl) {
		const swiperParams = {
			slidesPerView: 1.2,
			breakpoints: {
				500: {
					slidesPerView: 1.4,
				},
			},
		};
		Object.assign(swiperAuthorsMobileEl, swiperParams);
		swiperAuthorsMobileEl.initialize();
	}
	if (swiperLiveEl) {
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
					slidesPerView: 3.8,
					slidesOffsetBefore: 15,
					slidesOffsetAfter: 15,
				},
				1200: {
					slidesPerView: 4.8,
					slidesOffsetBefore: 21,
					slidesOffsetAfter: 21,
				},
				1513: {
					slidesPerView: 5.8,
					slidesOffsetBefore: 21,
					slidesOffsetAfter: 21,
				},
				1800: {
					slidesPerView: 6.8,
					slidesOffsetBefore: 21,
					slidesOffsetAfter: 21,
				},
			},
		};
		Object.assign(swiperLiveEl, swiperParams);
		swiperLiveEl.initialize();
	}
	domLoaded = true
})

function handleScroll() {
	if (!authorEls.length) return;

	let firstEl = authorEls[0];
	let lastEl = authorEls[authorEls.length - 1];	
	
	const firstRect = firstEl.getBoundingClientRect();
	const lastRect = lastEl.getBoundingClientRect();

	// Before first element
	if (firstRect.top > innerHeight.current / 3) {
		activeAuthorIndex = 0;
		return;
	}

	// Past last element
	if (lastRect.bottom < innerHeight.current / 3) {
		activeAuthorIndex = authorEls.length - 1;
		return;
	}

	// Track the element closest to the trigger point
	let triggerPoint = innerHeight.current / 3;
	let closestIndex = 0;
	let closestOffset = Infinity;

	authorEls.forEach((el, i) => {
		const rect = el.getBoundingClientRect();
		const offset = Math.abs(rect.top - triggerPoint);
		if (rect.bottom > triggerPoint && rect.top < innerHeight.current) {
			if (offset < closestOffset) {
				closestOffset = offset;
				closestIndex = i;
			}
		}
	});	
	activeAuthorIndex = closestIndex;	
}

function onRealIndexChange(e) {
	activeProductionIndex = e.detail[0].realIndex	
}
</script>

<svelte:window onscroll={() => handleScroll()}></svelte:window>

<section id="hero" class={homepage.highlights ? 'highights' : 'noHighlights'}>
	<h1 class="jost-74">{homepage.intro1}</h1>
	{#if homepage.intro2}
		<p>{homepage.intro2}</p>
	{/if}
	<a href="/about" class="btn bg-gray">Leggi di più</a>
</section>

{#if homepage.highlights}
	{#if innerWidth.current > 800}
		<section id="highlights" class:high={homepage.highlights.length == 3}>
			{#each homepage.highlights as highlight, i}
				{#if highlight.ctaReference || highlight.ctaLink}
					<a class="highlight"
					class:left={i == 0}
					class:right={i > 0}
					class:wide={homepage.highlights.length == 1}
					class:high={homepage.highlights.length == 3 && i == 0}
					style={
						(highlight.backgroundColor ? `background-color: ${highlight.backgroundColor.hex}; ` : '') +
						(highlight.backgroundImage ? `background-image: url(${urlFor(highlight.backgroundImage)});` : '')
					}
					href={highlight.ctaReference ? `/${{
						video: 'esplora',
						playlist: 'esplora',
						podcast: 'esplora',
						event: 'live',
						eventSerie: 'live',
					}[highlight.ctaReference._type]}/${highlight.ctaReference.slug.current}` : `${highlight.ctaLink}`}
					target={highlight.ctaLink ? `_blank` : ``}
					rel={highlight.ctaLink ? `noopener noreferrer` : ``}
					>
						<div>
							{#if highlight.subtitle}<h3 class="jost-24">{highlight.subtitle}</h3>{/if}
							{#if highlight.title}<h2 class="jost-54 mobile-jost-27">{highlight.title}</h2>{/if}
							{#if highlight.abstract}<p class="jost-18">{highlight.abstract}</p>{/if}
						</div>
						{#if highlight.ctaLabel}<button class="btn bg-white">{highlight.ctaLabel}</button>{/if}
					</a>
				{:else}
					<div class="highlight"
					class:left={i == 0}
					class:right={i > 0}
					class:wide={homepage.highlights.length == 1}
					class:high={homepage.highlights.length == 3 && i == 0}
					style={
						(highlight.backgroundColor ? `background-color: ${highlight.backgroundColor.hex}; ` : '') +
						(highlight.backgroundImage ? `background-image: url(${urlFor(highlight.backgroundImage)});` : '')
					}
					>
						<div>
							{#if highlight.subtitle}<h3 class="jost-24">{highlight.subtitle}</h3>{/if}
							{#if highlight.title}<h2 class="jost-54 mobile-jost-27">{highlight.title}</h2>{/if}
							{#if highlight.abstract}<p class="jost-18">{highlight.abstract}</p>{/if}
						</div>
						{#if highlight.ctaLabel}<button class="btn bg-white">{highlight.ctaLabel}</button>{/if}
					</div>
				{/if}
			{/each}
		</section>
	{:else}
		<swiper-container id="highlights"
			class:invisible={!domLoaded}
			loop={false}
			slides-per-view={1.1}
			free-mode={false}
			>
				{#each homepage.highlights as highlight, i}
					<swiper-slide>
						{#if highlight.ctaReference || highlight.ctaLink}
							<a class="highlight mobile"
							class:left={i == 0}
							class:right={i > 0}
							class:wide={homepage.highlights.length == 1}
							class:high={homepage.highlights.length == 3 && i == 0}
							style={
								(highlight.backgroundColor ? `background-color: ${highlight.backgroundColor.hex}; ` : '') +
								(highlight.backgroundImageMobile
									? `background-image: url(${urlFor(highlight.backgroundImageMobile)});`
									: highlight.backgroundImage
									? `background-image: url(${urlFor(highlight.backgroundImage)});`
									: '')
							}
							href={highlight.ctaReference ? `/${{
								video: 'esplora',
								playlist: 'esplora',
								podcast: 'esplora',
								event: 'live',
								eventSerie: 'live',
							}[highlight.ctaReference._type]}/${highlight.ctaReference.slug.current}` : `${highlight.ctaLink}`}
							target={highlight.ctaLink ? `_blank` : ``}
							rel={highlight.ctaLink ? `noopener noreferrer` : ``}
							>
								<div>
									{#if highlight.subtitle}<h3 class="jost-24">{highlight.subtitle}</h3>{/if}
									{#if highlight.title}<h2 class="jost-54 mobile-jost-27">{highlight.title}</h2>{/if}
									{#if highlight.abstract}<p class="jost-18">{highlight.abstract}</p>{/if}
								</div>
								{#if highlight.ctaLabel}<button class="btn bg-white">{highlight.ctaLabel}</button>{/if}
							</a>
						{:else}
							<div class="highlight mobile"
							class:left={i == 0}
							class:right={i > 0}
							class:wide={homepage.highlights.length == 1}
							class:high={homepage.highlights.length == 3 && i == 0}
							style={
								(highlight.backgroundColor ? `background-color: ${highlight.backgroundColor.hex}; ` : '') +
								(highlight.backgroundImageMobile
									? `background-image: url(${urlFor(highlight.backgroundImageMobile)});`
									: highlight.backgroundImage
									? `background-image: url(${urlFor(highlight.backgroundImage)});`
									: '')
							}
							>
								<div>
									{#if highlight.subtitle}<h3 class="jost-24">{highlight.subtitle}</h3>{/if}
									{#if highlight.title}<h2 class="jost-54 mobile-jost-27">{highlight.title}</h2>{/if}
									{#if highlight.abstract}<p class="jost-18">{highlight.abstract}</p>{/if}
								</div>
								{#if highlight.ctaLabel}<button class="btn bg-white">{highlight.ctaLabel}</button>{/if}
							</div>
						{/if}
					</swiper-slide>
				{/each}
		</swiper-container>
	{/if}
{/if}

{#if homepage.liveSelection}
	<section id="live" class={homepage.highlights ? 'highights' : 'noHighlights'}>
		<h4 class="jost-54 inline-title">Live</h4>
		{#if homepage.liveIntro}<span class="section-description-inline jost-18">{homepage.liveIntro}</span>{/if}
		<swiper-container class="events"
		bind:this={swiperLiveEl}
		init={false}
		class:invisible={!domLoaded}
		loop={false}
		space-between={15}
		grabCursor={true}
		free-mode={false}
		mousewheel-force-to-axis={true}
		>
			{#each homepage.liveSelection as event, i}
				<swiper-slide>
					<Event event={event} slider={true} placeholder={data.info.placeholder}/>
				</swiper-slide>
			{/each}
		</swiper-container>
		<a href="/live" class="btn bg-gray">Vedi tutti</a>
	</section>
{/if}

{#if homepage.productionsSelection}
	<section id="productions">
			<h4 class="jost-54 inline-title">Video e podcast</h4>{#if homepage.productionsIntro}
			<span class="section-description jost-18">{homepage.productionsIntro}</span>{/if}
			{#if innerWidth.current > 800}
				<ProductionsWidget productions={homepage.productionsSelection} />
				<a href="/esplora" class="btn bg-gray">Esplora tutti i contenuti</a>
			{:else}
				<swiper-container
				id="productions-swiper"
				class:invisible={!domLoaded}
				init={false}
				bind:this={swiperProductionsMobileEl}
				loop={true}
				slides-per-view={4}
				centered-slides={true}
				grab-cursor={true}
				effect={"coverflow"}
				coverflow-effect-rotate={5}
				coverflow-effect-scale={.8}
				coverflow-effect-stretch={30}
				coverflow-effect-depth={30}
				coverflow-effect-modifier={1}
				coverflow-effect-slide-shadows={false}
				touch-ratio={1.3}
				touch-angle={30}
				resistance-ratio={.9}
				long-swipes={true}
				long-swipes-ratio={.1}
				short-swipes={true}
				speed={200}
				onswiperrealindexchange={onRealIndexChange}
				>
					{#each homepage.productionsSelection as production, i}
						<swiper-slide>
							<a
								class="production jost-18"
								href={`/esplora/${production.slug.current}`}
							>
								<img
									class="cover rounded"
									class:_1-1={production._type == "episode" || production._type == "podcast"}
									class:_16-9={production._type == "video" || production._type == "playlist"}
									src={urlFor(production.cover)}
									alt=""
								/>
								<div class="text jost-18">
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
						</swiper-slide>
					{/each}
				</swiper-container>
				<div class="btns">
					<a class="btn watch jost-18 border-black" href={`/esplora/${activeProduction.slug.current}`}>
						<svg width="19" height="15" viewbox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M18.53 7.5 0 15V0l18.53 7.5Z"/>
						</svg>
						{#if activeProduction._type == "video" || activeProduction._type == "playlist"}Guarda{/if}
						{#if activeProduction._type == "episode" || activeProduction._type == "podcast"}Ascolta{/if}
					</a>
					<a href="/esplora" class="btn bg-gray border-gray">Esplora</a>
				</div>
			{/if}
	</section>
{/if}

{#if homepage.authorsSelection}
	<section id="authors">
		{#if innerWidth.current > 800}
			<div class="active-author">
				<h4 class="jost-54 inline-title">Autori</h4>
				<div class="card">
					<img class="portrait portrait _1-1" src={urlFor(activeAuthor?.portrait ? activeAuthor.portrait : data.info.placeholder)} alt="">
					{#if activeAuthor?.highlight}<blockquote>{activeAuthor.highlight}</blockquote>{/if}
				</div>
				{#if activeAuthor?.highlightedContents}
					<div class="highlighted-contents-wrapper">
						<p class="jost-12 uppercase bold highlighted-title">Compare in</p>
						<swiper-container class="highlighted-contents"
						class:invisible={!domLoaded}
						loop={false}
						space-between={10}
						grabCursor={true}
						slides-per-view={2}
						free-mode={false}
						mousewheel-force-to-axis={true}
						pagination-clickable={true}
						>
							{#each activeAuthor.highlightedContents as production, i}
								{#if i < 4}
								<swiper-slide>
									<a class="highlighted-content jost-15" href={`/esplora/${production.slug.current}`}>
										<img class="cover rounded" src={urlFor(production.cover)} alt=""
										class:_1-1={production._type == "episode" || production._type == "podcast"}
										class:_16-9={production._type == "video" || production._type == "playlist"}
										>
										<div>
											<h2 class="uppercase bold">{production.title}</h2>
											<!-- {#if production.subtitle}<h3>{production.subtitle}</h3>{/if} -->
											<p>
												{#if production._type == "video"}Guarda il video{/if}
												{#if production._type == "playlist"}Guarda la playlist{/if}
												{#if production._type == "episode"}Ascolta l'episodio{/if}
												{#if production._type == "podcast"}Ascolta il podcast{/if}
											</p>
										</div>
									</a>
								</swiper-slide>
								{/if}
							{/each}
						</swiper-container>
					</div>
				{/if}
			</div>
			<div class="authors">
				{#if homepage.authorsIntro}<span class="section-description jost-18">{homepage.authorsIntro}</span>{/if}
				{#each homepage.authorsSelection as author, i}
					<a class="author jost-54" href={`/autori/${author.slug.current}`}
					style={"--activeColor: " + colors[i%8]}
					class:active={activeAuthorIndex == i}
					onmouseover={() => {activeAuthorIndex = i}}
					onfocus={() => {activeAuthorIndex = i}}
					bind:this={authorEls[i]}
					>
						<h2>{formatAuthorName(author)}</h2>
					</a>
				{/each}
				<a href="/autori" class="btn bg-gray">Vedi tutti</a>
			</div>
		{:else}
				<h4 class="jost-54 inline-title">Autori</h4>
				{#if homepage.authorsIntro}<span class="section-description jost-18">{homepage.authorsIntro}</span>{/if}
				<swiper-container
				id="authors-swiper"
				class:invisible={!domLoaded}
				init={false}
				bind:this={swiperAuthorsMobileEl}
				loop={true}
				grab-cursor={true}
				auto-height={true}
				onswiperrealindexchange={onRealIndexChange}
				>
					{#each homepage.authorsSelection as author, i}
						<swiper-slide>
							<div class="author">
								<a href={`/autori/${author.slug.current}`}>
									<h2 class="mobile-jost-27">{formatAuthorName(author)}</h2>
									<img class="portrait _1-1" src={urlFor(author.portrait ? author.portrait : data.info.placeholder)} alt="">
									{#if author.highlight}<blockquote class="jost-24">{author.highlight}</blockquote>{/if}
								</a>
								{#if author.highlightedContents}
									<p class="jost-12 uppercase bold highlighted-title">Compare in</p>
									{#each author.highlightedContents as production, i}
										{#if i < 4}
											<a class="highlighted-content jost-15" href={`/esplora/${production.slug.current}`}>
												<img class="cover rounded" src={urlFor(production.cover)} alt=""
												class:_1-1={production._type == "episode" || production._type == "podcast"}
												class:_16-9={production._type == "video" || production._type == "playlist"}
												>
												<div>
													<h2 class="uppercase bold">{production.title}</h2>
													{#if production.subtitle}<h3>{production.subtitle}</h3>{/if}
													<p>
														{#if production._type == "video"}Guarda il video{/if}
														{#if production._type == "playlist"}Guarda la playlist{/if}
														{#if production._type == "episode"}Ascolta l'episodio{/if}
														{#if production._type == "podcast"}Ascolta il podcast{/if}
													</p>
												</div>
											</a>
										{/if}
									{/each}
								{/if}
							</div>
						</swiper-slide>
					{/each}
				</swiper-container>
				<a id="seeAllAuthorsMobile" href="/autori" class="btn bg-gray">Vedi tutti</a>
		{/if}
	</section>
{/if}

<style>
/* General */
.inline-title,
.section-description-inline {
	display: inline-block;
	white-space: pre;
}
.section-description-inline {
	margin-left: var(--margin);
}
.section-description {
	display: block;
	max-width: 600px;
	white-space: pre;
}
@media screen and (max-width: 800px) {
	.inline-title,
	.section-description-inline,
	.section-description {
		white-space: unset;
	}
	.section-description-inline {
		margin-left: 0;
		margin-top: 1rem;
	}
}

/* Hero */
#hero {
	padding: var(--margin) var(--margin) 4rem;
}
#hero p {
	margin: 3rem 0 8rem;
	max-width: 600px;
}
#hero.noHighlights p {
	margin: 3rem 0 3rem;
}
@media screen and (max-width: 800px) {
	#hero h1 {
		white-space: normal;
	}
}

/* Highlights */
#highlights {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	color: var(--white);
}
#highlights.high {
	grid-template-rows: repeat(2, minmax(400px, calc((100vh - (var(--margin)*2 + 4rem))/2)));
	grid-template-rows: repeat(2, minmax(400px, 50vh));
}
.highlight {
	width: 100%;
	background-position: center;
	padding: 2rem var(--margin) 4rem;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background-size: cover;
}
.highlight.mobile {
	background-position: right bottom;
	background-size: cover;
}
.highlight.left {
	grid-column: 1 / span 1;
}
.highlight.right {
	grid-column: 2 / span 1;
}
.highlight.wide {
	grid-column: 1 / span 2;
	text-align: center;
}
.highlight.wide div {
	margin: auto;
	align-self: center;
}
.highlight.wide .btn {
	align-self: center;
}
.highlight.wide div * {
	max-width: 700px;
}
.highlight.high {
	grid-row: 1 / span 2;
}
.highlight h3 {
	margin-bottom: 1rem;
	max-width: 600px;
}
.highlight h2 {
	margin-bottom: 2rem;
	max-width: 600px;
}
.highlight p {
	max-width: 450px;
}
.highlight .btn {
	width: fit-content;
	margin-top: 4rem;
}
@media screen and (max-width: 800px) {
	#highlights {
		display: flex;
	}
	.highlight {
		height: 50vh;
	}
}

/* Live */
#live {
	margin-top: 10rem;
	padding: 2rem var(--margin);
}
#live.noHighlights {
	margin-top: 6rem;
}
.events {
	margin: 2rem calc(var(--margin)*-1) 4rem;
	display: flex;
}

/* Productions */
#productions {
	margin: 8rem 0 14rem;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	width: 100%;
}
#productions-swiper {
	width: 100%;
}
@media screen and (max-width: 800px) {
	#productions {
		margin: 12rem 0;
	}
	#productions>h4, #productions>.section-description {
		padding: 0 var(--margin);
	}
	#productions-swiper {
		height: 55vw;
		min-height: 300px;
	}
	#productions-swiper swiper-slide {
		width: auto;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: visible;
		margin-top: -5vw;
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
	.production .cover {
		height: 35vw;
		width: auto;
		transition: var(--transition);
	}
	.production .text {
		margin-top: 2rem;
		top: 100%;
		left: 50%;
		position: absolute;
		transform: translateX(-50%);
		width: 0;
		opacity: 0;
		justify-items: center;
		pointer-events: none;
	}
	.production .text * {
		white-space: nowrap;
	}
	:global(#productions-swiper swiper-slide.swiper-slide-active .text), :global(#productions-swiper swiper-slide.swiper-slide-active .btns) {
		opacity: 1;
	}
	#productions .btns {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: .3rem;
	}
	#productions .btns .watch {
		display: inline-flex;
		gap: .6em;
		align-items: center;
	}
	#productions .btns .watch svg {
		height: 1em;
		fill: var(--black);
		width: auto;
		max-width: unset;
	}
}

/* Authors */
#authors {
	display: grid;
	grid-template-columns: repeat(2, 50%);
}
.active-author {
	position: sticky;
	top: 0;
	height: fit-content;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 2rem var(--margin) 2rem;
}
.active-author .card {
	position: absolute;
	top: 25%;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	max-width: 600px;
	text-align: center;
	width: 80%;
}
.active-author .portrait {
	width: 20vh;
	min-width: 200px;
}
.active-author blockquote {
	margin-top: 2rem;
}
.active-author .highlighted-title {
	margin-bottom: 1rem;
}
.active-author .highlighted-contents {
	margin-top: -2rem;
}
.active-author .highlighted-contents h2 {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	line-clamp: 2;
	overflow: hidden;
	text-overflow: ellipsis;
}
.active-author .highlighted-contents swiper-slide {
	margin-top: 2rem;
}
.active-author .highlighted-contents::part(pagination) {
	width: fit-content;
	left: unset;
	bottom: unset;
	right: 0;
	top: 0;
	line-height: 0;
}
.active-author .highlighted-contents::part(bullet) {
	margin: 0 2px;
	background-color: transparent;
	border: solid 1px var(--black);
	opacity: 1;
}
.active-author .highlighted-contents::part(bullet-active) {
	margin: 0 2px;
	background-color: var(--black);
	border: solid 1px var(--black);
	opacity: 1;
}
.active-author .highlighted-content {
	display: flex;
	gap: var(--gutter);
	line-height: 1.1;
	align-items: center;
}
.active-author .highlighted-content img {
	height: 50px;
	width: auto;
}
#authors .section-description {
	margin-bottom: 2rem;
}
.authors {
	padding: 2rem var(--margin);
}
.author.active h2 {color: var(--activeColor);}
.authors .btn {
	margin-top: 4rem;
}
@media screen and (max-width: 800px) {
	#authors {
		grid-template-columns: repeat(1, 100%);
	}
	#authors>h4 {
		padding: 0 var(--margin);
	}
	#authors>.section-description {
		padding: 1rem var(--margin) 4rem;
	}
	#authors-swiper {
		width: 100%;
	}
	.author {
		display: block;
		padding: 0 var(--margin);
	}
	.author .portrait {
		margin-top: 2rem;
		max-height: 200px;
	}
	.author blockquote {
		margin-top: 2rem;
	}
	.author .highlighted-title {
		margin: 6rem 0 1rem;
	}
	.author .highlighted-content {
		display: flex;
		gap: var(--gutter);
		line-height: 1.1;
		align-items: center;
		margin: 1rem 0 2rem;
	}
	.author .highlighted-content img {
		height: 50px;
		width: auto;
	}
	#seeAllAuthorsMobile {
		width: fit-content;
		margin: var(--margin);
	}
}
</style>