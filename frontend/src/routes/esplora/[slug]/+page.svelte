<script>
import { PortableText } from '@portabletext/svelte'
import PlainTextStyle from '$lib/components/portableTextStyles/PlainTextStyle.svelte';
import { urlFor } from "$lib/utils/image";
import { formatDate } from '$lib/utils/date';
import { formatEmbed } from '$lib/utils/youtube';
import { formatAuthorName } from '$lib/utils/author';
import { groupMultiAccordions } from '$lib/utils/accordion.js';
import AccordionTextStyle from '$lib/components/portableTextStyles/AccordionTextStyle.svelte';
import DownloadTextStyle from '$lib/components/portableTextStyles/DownloadTextStyle.svelte';
import Related from '$lib/components/Related.svelte';
import { innerWidth, scrollY } from 'svelte/reactivity/window';
let { data } = $props();
const production = data.production
let activeVideoIndex = $state(0)
let activeVideo = $derived(production.videos?.[activeVideoIndex])
let activeVideoPlay = $state(false)
let productionVideoPlay = $state(false)
let videos = $state([])
let activeVideoPlayMobileIndex = $state(null)
</script>

<svelte:head>
	{#if data.seo.SEOTitle}<title>{data.seo.SEOTitle} — {production.title}</title>{/if}
	{#if production.SEODescription}<meta name="description" content={production.SEODescription}>{/if}
	{#if production.SEOHidden}
		<meta name="robots" content="index,follow">
		<meta name="robots" content="noindex, nofollow" />
	{/if}
	{#if data.seo.SEOTitle}<meta property="og:title" content={`${data.seo.SEOTitle} — ${production.title}`}>{/if}
	{#if production.SEODescription}<meta property="og:description" content={production.SEODescription}>{/if}
	{#if production.cover}<meta property="og:image" content={urlFor(production.cover).width(1200).url()}>{/if}
	{#if data.seo.SEOTitle}<meta property="og:site_name" content={`${data.seo.SEOTitle} — ${production.title}`}>{/if}
</svelte:head>

<section id="production" class={production._type}>
	<!-- Podcast -->
	{#if production._type == 'podcast'}
		<div class="description noScrollbar">
			{#if production.topics}
				<div class="topics jost-12 bold uppercase">
					{#each production.topics as topic, j}
						<a class="topic hover-gray" href="/cerca?search={topic.title}">{topic.title}</a>
					{/each}
				</div>
			{/if}
			<div class="titles">
				<h1 class="jost-74 uppercase">{production.title}</h1>
				{#if production.subtitle}<h2 class="jost-45 subtitle">{production.subtitle}</h2>{/if}
			</div>
			{#if production.authors?.length < 4}
				<div class="authors">
					<p class="authors-label jost-12 uppercase bold">Un podcast di</p>
					{#each production.authors as author, j}
						<a href="/autori/{author.slug.current}" class="author jost-24 hover-gray">
							<img class="portrait" src={urlFor(author.portrait ? author.portrait : data.info.placeholder).width(1080)} alt="Ritratto di {formatAuthorName(author)}">
							<h3 class="jost-27">{formatAuthorName(author)}</h3>
						</a>
					{/each}
				</div>
			{:else if production.authors?.length >= 4}
				<p class="jost-27 authors">di Autori vari</p>
			{/if}
			{#if production.cover}
				<a class="cover-wrapper" href={production.link} target="_blank" rel="noopener noreferrer">
					<img class="cover rounded _1-1" src={urlFor(production.cover ? production.cover : data.info.placeholder)} alt="">
					<button class="btn listen">
						<svg width="19" height="15" viewbox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M18.53 7.5 0 15V0l18.53 7.5Z"/>
						</svg>
						Ascolta
					</button>
				</a>
			{/if}
			{#if production.body}
				<div class="body jost-21">
					<PortableText
					value={groupMultiAccordions(production.body)}
					components={{
					block: {
						normal: PlainTextStyle,
						h2: PlainTextStyle,
						h3: PlainTextStyle,
						h4: PlainTextStyle,
					},
					listItem: PlainTextStyle,
					marks: {
						link: PlainTextStyle,
					},
					types: {
						download: DownloadTextStyle,
						accordion: AccordionTextStyle,
					}
					}}/>
				</div>
			{/if}
		</div>
		{#if production.episodes.length > 0}
			<div class="list episodes">
				<h4 class="jost-12 uppercase bold">Episodi</h4>
				{#each production.episodes as episode, i}
					<a class="episode"
					href={episode.link}
					target="_blank" rel="noopener noreferrer"
					>
						<h2 class="jost-24 uppercase bold">{#if episode.number}{episode.number}{@html '. '}{/if}{episode.title}</h2>
						{#if episode.subtitle}<br><h3 class="jost-24 bold">{episode.subtitle}</h3>{/if}
						<svg width="19" height="15" viewbox="0 0 19 15" fill="black" xmlns="http://www.w3.org/2000/svg">
							<path d="M18.53 7.5 0 15V0l18.53 7.5Z"/>
						</svg>
						{#if episode.date}<time class="jost-15" datetime={episode.date}>{formatDate(episode.date)}</time>{/if}
						{#if episode.body}
							<div class="body jost-15">
								<PortableText
								value={groupMultiAccordions(episode.body)}
								components={{
								block: {
									normal: PlainTextStyle,
									h2: PlainTextStyle,
									h3: PlainTextStyle,
									h4: PlainTextStyle,
								},
								listItem: PlainTextStyle,
								marks: {
									link: PlainTextStyle,
								},
								types: {
									download: DownloadTextStyle,
									accordion: AccordionTextStyle,
								}
								}}/>
							</div>
						{/if}
					</a>
				{/each}
			</div>
		{/if}
	{/if}
	
	<!-- Episode -->
	{#if production._type == 'episode'}
		<div class="description noScrollbar">
			{#if production.topics}
				<div class="topics jost-12 bold uppercase">
					{#each production.topics as topic, j}
						<a class="topic hover-gray" href="/cerca?search={topic.title}">{topic.title}</a>
					{/each}
				</div>
			{/if}
			<div class="titles">
				<h1 class="jost-74 uppercase">{production.title}</h1>
				{#if production.subtitle}<h2 class="jost-45 subtitle">{production.subtitle}</h2>{/if}
			</div>
			{#if production.authors?.length < 6}
				<div class="authors">
					<p class="authors-label jost-12 uppercase bold">Un podcast di</p>
					{#each production.authors as author, j}
						<a href="/autori/{author.slug.current}" class="author jost-24 hover-gray">
							<img class="portrait" src={urlFor(author.portrait ? author.portrait : data.info.placeholder).width(1080)} alt="Ritratto di {formatAuthorName(author)}">
							<h3 class="jost-27">{formatAuthorName(author)}</h3>
						</a>
					{/each}
				</div>
			{:else if production.authors?.length >= 6}
				<p class="jost-27 authors">di Autori vari</p>
			{/if}
			{#if production.cover}
				<a class="cover-wrapper" href={production.link} target="_blank" rel="noopener noreferrer">
					<img class="cover rounded _1-1" src={urlFor(production.cover ? production.cover : data.info.placeholder)} alt="">
					<button class="btn listen">
						<svg width="19" height="15" viewbox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M18.53 7.5 0 15V0l18.53 7.5Z"/>
						</svg>
						Ascolta
					</button>
				</a>
			{/if}
			{#if production.body}
				<div class="body jost-21">
					<PortableText
					value={groupMultiAccordions(production.body)}
					components={{
					block: {
						normal: PlainTextStyle,
						h2: PlainTextStyle,
						h3: PlainTextStyle,
						h4: PlainTextStyle,
					},
					listItem: PlainTextStyle,
					marks: {
						link: PlainTextStyle,
					},
					types: {
						download: DownloadTextStyle,
						accordion: AccordionTextStyle,
					}
					}}/>
				</div>
			{/if}
		</div>
		{#if production.podcasts}
			<div class="list podcasts">
				<h4 class="jost-12 uppercase bold">Podcast</h4>
				{#each production.podcasts as podcast, j}
					<a class="podcast jost-24" href="/esplora/{podcast.slug.current}">
						<img class="cover rounded _1-1" src={urlFor(podcast.cover ? podcast.cover : data.info.placeholder)} alt="">
						<h2 class="jost-18 uppercase bold">{podcast.title}</h2>
						{#if podcast.subtitle}<h3 class="jost-18 bold">{podcast.subtitle}</h3>{/if}
					</a>
				{/each}
			</div>
		{/if}
	{/if}

	<!-- Playlist -->
	{#if production._type == 'playlist'}
		<div class="description noScrollbar">
			{#if production.topics}
				<div class="topics jost-12 bold uppercase">
					{#each production.topics as topic, j}
						<a class="topic hover-gray" href="/cerca?search={topic.title}">{topic.title}</a>
					{/each}
				</div>
			{/if}
			<div class="titles">
				<h1 class="jost-74 uppercase">{production.title}</h1>
				{#if production.subtitle}<h2 class="jost-45 subtitle">{production.subtitle}</h2>{/if}
			</div>
			{#if production.authors?.length < 5}
				<div class="authors">
					<p class="authors-label jost-12 uppercase bold">Con</p>
					{#each production.authors as author, j}
						<a href="/autori/{author.slug.current}" class="author jost-24 hover-gray">
							<img class="portrait" src={urlFor(author.portrait ? author.portrait : data.info.placeholder).width(1080)} alt="Ritratto di {formatAuthorName(author)}">
							<h3 class="jost-27">{formatAuthorName(author)}</h3>
						</a>
					{/each}
				</div>
			{:else if production.authors?.length >= 5}
				<p class="jost-27 authors">di Autori vari</p>
			{/if}
			{#if production.body}
				<div class="body jost-24">
					<PortableText
					value={groupMultiAccordions(production.body)}
					components={{
					block: {
						normal: PlainTextStyle,
						h2: PlainTextStyle,
						h3: PlainTextStyle,
						h4: PlainTextStyle,
					},
					listItem: PlainTextStyle,
					marks: {
						link: PlainTextStyle,
					},
					types: {
						download: DownloadTextStyle,
						accordion: AccordionTextStyle,
					}
					}}/>
				</div>
			{/if}
		</div>
		{#if production.videos}
			<div class="content">
				<h4 class="jost-12 uppercase bold">Episodi</h4>
				<div class="active-video">
					{#if activeVideo.youtubeVideoCode}
						<button class="active-video-cover"
						onclick={() => activeVideoPlay = true}
						>
							<img class="cover rounded _16-9" src={urlFor(activeVideo.cover ? activeVideo.cover : data.info.placeholder)} alt="">
							{#if !activeVideoPlay}
								<span class="btn watch">
									<svg width="19" height="15" viewbox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M18.53 7.5 0 15V0l18.53 7.5Z"/>
									</svg>
									Guarda
								</span>
							{:else if activeVideo && activeVideo.youtubeVideoCode}
								<iframe class="embed yt rounded _16-9"
								src={formatEmbed(activeVideo)}
								title={activeVideo.title}
								frameborder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowfullscreen>
								</iframe>
							{/if}
						</button>
					{:else if activeVideo.externalLink}
						<a class="active-video-cover" href={activeVideo.externalLink} target="_blank" rel="noopener noreferrer">
							<img class="cover rounded _16-9" src={urlFor(activeVideo.cover ? activeVideo.cover : data.info.placeholder)} alt="">
							<span class="btn watch">
								<svg width="19" height="15" viewbox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M18.53 7.5 0 15V0l18.53 7.5Z"/>
								</svg>
								{activeVideo.externalLinkLabel ? activeVideo.externalLinkLabel : 'Guarda'}
							</span>
						</a>
					{/if}
				</div>
				<div class="list videos">
					{#each production.videos as video, i}
						<button class="item" class:active={activeVideoIndex == i}
						bind:this={videos[i]}
						onclick={() => {
							activeVideoIndex = i;
							activeVideoPlay = false;
							setTimeout(() => {
								if (production.videos.length - i > 4 || innerWidth.current <= 800) {
									const offset = scrollY.current + videos[i]?.getBoundingClientRect().top - (12*4 + 12*7 - 1);
									window.scrollTo({ top: offset, behavior: 'smooth' });	
								}
							}, 100);
						}}
						>
							{#if innerWidth.current <= 800 && video.youtubeVideoCode}
								<div class="mobile-video">
									<div class="active-video-cover"
									role="button"
  									tabindex="0"
									onclick={() => activeVideoPlayMobileIndex = i}
									onkeydown={(e) => { if (e.key === "Enter" || e.key === " ") activeVideoPlayMobileIndex = i; }}
									>
										<img class="cover rounded _16-9" src={urlFor(video.cover ? video.cover : data.info.placeholder)} alt="">
										{#if activeVideoPlayMobileIndex != i}
											<span class="btn watch">
												<svg width="19" height="15" viewbox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M18.53 7.5 0 15V0l18.53 7.5Z"/>
												</svg>
												Guarda
											</span>
										{:else}
											<iframe class="embed yt rounded _16-9"
											src={formatEmbed(video)}
											title={video.title}
											frameborder="0"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowfullscreen>
											</iframe>
										{/if}
									</div>
								</div>
							{/if}
							<div class="title">
								<h2 class="jost-18 uppercase bold">{i+1}. {video.title}</h2>
								{#if video.subtitle}<h3 class="jost-18 bold">{video.subtitle}</h3>{/if}
							</div>
							<div class="opener">
								{#if video.date}<time class="jost-15" datetime={video.date}>{formatDate(video.date)}</time>{/if}
								{#if video.authors?.length < 6}
									<div class="authors jost-15">
										<p class="authors-label">
											<span>Con</span>
											{#each video.authors as author, j}
												<a class="author inline hover-gray" href="/autori/{author.slug.current}">{formatAuthorName(author)}</a>{@html j < video.authors.length - 1  ? ', ' : ''}
											{/each}
										</p>
									</div>
								{:else if video.authors?.length >= 6}
									<p class="authors">di Autori vari</p>
								{/if}
								{#if video.body}
									<div class="body jost-15">
										<PortableText
										value={video.body}
										components={{
										block: {
											normal: PlainTextStyle,
											h2: PlainTextStyle,
											h3: PlainTextStyle,
											h4: PlainTextStyle,
										},
										listItem: PlainTextStyle,
										marks: {
											link: PlainTextStyle,
										},
										}}/>
									</div>
								{/if}
							</div>
						</button>
					{/each}
				</div>
			</div>
		{/if}
	{/if}

	<!-- Video -->
	{#if production._type == 'video'}
		<div class="description noScrollbar">
			{#if production.topics}
				<div class="topics jost-12 bold uppercase">
					{#each production.topics as topic, j}
						<a class="topic hover-gray" href="/cerca?search={topic.title}">{topic.title}</a>
					{/each}
				</div>
			{/if}
			<div class="titles">
				<h1 class="jost-74 uppercase">{production.title}</h1>
				{#if production.subtitle}<h2 class="jost-45 subtitle">{production.subtitle}</h2>{/if}
			</div>
			{#if production.authors?.length < 4}
				<div class="authors">
					<p class="authors-label jost-12 uppercase bold">Con</p>
					{#each production.authors as author, j}
						<a href="/autori/{author.slug.current}" class="author jost-24 hover-gray">
							<img class="portrait" src={urlFor(author.portrait ? author.portrait : data.info.placeholder).width(1080)} alt="Ritratto di {formatAuthorName(author)}">
							<h3>{formatAuthorName(author)}</h3>
						</a>
					{/each}
				</div>
			{:else if production.authors?.length >= 4}
				<p class="authors">di Autori vari</p>
			{/if}
			{#if production.body}
				<div class="body jost-24">
					<PortableText
					value={production.body}
					components={{
					block: {
						normal: PlainTextStyle,
						h2: PlainTextStyle,
						h3: PlainTextStyle,
						h4: PlainTextStyle,
					},
					listItem: PlainTextStyle,
					marks: {
						link: PlainTextStyle,
					},
					}}/>
				</div>
			{/if}
			{#if production.cover}
				<div class="active-video">
					{#if production.youtubeVideoCode}
						<button class="active-video-cover"
						onclick={() => productionVideoPlay = true}
						>
							<img class="cover rounded _16-9" src={urlFor(production.cover ? production.cover : data.info.placeholder)} alt="">
							{#if !productionVideoPlay}
								<span class="btn watch">
									<svg width="19" height="15" viewbox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M18.53 7.5 0 15V0l18.53 7.5Z"/>
									</svg>
									Guarda
								</span>
							{:else if production.youtubeVideoCode}
								<iframe class="embed yt rounded _16-9"
								src={formatEmbed(production)}
								title="YouTube video with playlist"
								frameborder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowfullscreen>
								</iframe>
							{/if}
						</button>
					{:else if production.externalLink}
						<a class="active-video-cover" href={production.externalLink} target="_blank" rel="noopener noreferrer">
							<img class="cover rounded _16-9" src={urlFor(production.cover ? production.cover : data.info.placeholder)} alt="">
							<span class="btn watch">
								<svg width="19" height="15" viewbox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M18.53 7.5 0 15V0l18.53 7.5Z"/>
								</svg>
								{production.externalLinkLabel ? production.externalLinkLabel : 'Guarda'}
							</span>
						</a>
					{/if}
				</div>
			{/if}
		</div>
		{#if production.playlists.length > 0}
			<div class="list playlists">
				<h4 class="jost-12 uppercase bold">Playlist</h4>
				{#each production.playlists as playlist, j}
					<a class="playlist jost-24" href="/esplora/{playlist.slug.current}">
						<img class="cover rounded _16-9" src={urlFor(playlist.cover ? playlist.cover : data.info.placeholder)} alt="">
						<h2 class="jost-18 uppercase bold">{playlist.title}</h2>
						{#if playlist.subtitle}<h3 class="jost-18 bold">{playlist.subtitle}</h3>{/if}
					</a>
				{/each}
			</div>
		{/if}
	{/if}
</section>
{#if production.related}
	<Related related={production.related}/>
{/if}

<style>
#production {
	padding: 0 var(--margin);
	display: grid;
	grid-template-columns: repeat(10, 1fr);
	gap: var(--gutter);
}
.description {
	grid-column: 1 / span 6;
	overflow-y: scroll;
	position: sticky;
	top: 0;
	height: fit-content;
	padding-top: calc((var(--margin)*2 + 8rem));
	padding-top: var(--margin);
	padding-bottom: 4rem;
}
.topics {
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 1rem;
	column-gap: 1rem;
	z-index: 1;
	position: relative;
}
.playlist .description {
	position: relative;
}
.playlist .description, .podcast .description {
	max-height: 100vh;
}
.authors {
	display: flex;
	flex-wrap: wrap;
	row-gap: var(--gutter);
	column-gap: calc(var(--gutter)*2);
	align-items: center;
	margin-top: 3rem;
}
.list .authors {
	margin-top: 0;
}
.authors-label {
	flex-basis: 100%;
}
.author {
	display: flex;
	column-gap: .8rem;
	align-items: center;
}
.author.inline {
	display: inline !important;
}
.portrait {
	width: 3rem;
}
.listen, .watch {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
	display: inline-flex;
	gap: .6em;
	align-items: center;
}
.listen svg, .watch svg {
	height: 1em;
	fill: var(--black);
	width: auto;
	max-width: unset;
}
.listen:hover svg, .watch:hover svg  {
	fill: var(--white);
}
.description h1 {
	margin-right: var(--margin);
}
.description h2 {
	margin-right: var(--margin);
}
.body {
	margin-top: 3rem;
	margin-bottom: 4rem;
	max-width: 700px;
	padding-right: var(--margin);
}
.podcast .cover-wrapper, .episode .cover-wrapper {
	margin-top: 3rem;
	display: block;
	position: relative;
	overflow: hidden;
	max-width: 300px;
}
.embed.yt {
	width: 100%;
	height: 100%;
	position: absolute;
	display: block;
	top: 0;
	left: 0;
}
.active-video-cover {
	display: block;
	position: relative;
	overflow: hidden;
	width: 100%;
}
.list {
	grid-column: 7 / span 4;
	padding: calc((var(--margin)*2 + 8rem)) 0 2rem;
	padding: var(--margin) 0 2rem;
}
.playlist .list {
	padding: 0;
}
.episode .list,
.playlist .list,
.video .list {
	grid-column: 8 / span 3;
}
h4 {
	margin-bottom: 1rem;
}
@media screen and (max-width: 800px) {
	#production {
		display: flex;
		flex-direction: column;
	}
	.description {
		top: unset;
		position: relative;
		height: auto;
		display: grid;
		justify-content: center;
		grid-template-columns: repeat(1, 1fr);
	}
	.description .titles {
		grid-row: 1;
	}
	.description h1, .description h2 {
		text-align: center;
		margin-right: unset;
	}
	.description .topics {
		grid-row: 2;
		margin-bottom: 0;
		margin-top: 1rem;
		justify-content: center;
		text-align: center;
	}
	.description .cover-wrapper {
		grid-row: 3;
		justify-self: center;
		max-width: 500px;
		margin-top: 5rem;
	}
	.description .authors {
		grid-row: 4;
		margin-top: 2rem;
	}
	.description .body {
		grid-row: 5;
		margin-top: 4rem;
	}
	.body {
		padding-right: unset;
	}
	.playlist .description, .podcast .description {
		max-height: unset;
	}
	.list {
		padding-top: 0;
	}
}

/* Podcast */
.podcast .episode {
	display: block;
	border-top: solid 1px var(--black);
	padding: 2rem 20px 4rem 0;
}
.podcast .episode h2, .podcast .episode h3 {
	display: inline;
}
.podcast .episode .body {
	margin-bottom: 0;
}
.podcast .episode svg {
	opacity: 0;
	display: inline;
	margin-left: .5rem;
	height: .7em;
	width: auto;
}
.podcast .episode time {
	display: block;
	margin: 1rem 0 2rem;
}
@media screen and (min-width: 801px) {
	.podcast .episode:hover {
		border-right: solid 5px var(--black);
		padding-right: 15px;
	}
	.podcast .episode:hover svg {
		opacity: 1;
	}
}
@media screen and (max-width: 800px) {
	.podcast .episode {
		padding-right: 0;
	}
}


/* Episode */
.episode .cover {
	display: block;
	position: relative;
	overflow: hidden;
	max-width: 300px;
}
.episode .podcasts h4 {
	border-bottom: solid 1px var(--black);
	padding-bottom: 1rem;
}
.episode .podcasts h2 {
	margin-top: 1rem;
}
.episode .podcasts .cover {
	max-height: 150px;
	width: auto;
}
.episode .podcasts .podcast {
	display: block;
	padding-top: 1rem;
	padding-bottom: 3rem;
}
@media screen and (max-width: 800px) {
	.episode .podcasts {
		display: grid;
		grid-template-columns: repeat(2, calc((100% - var(--gutter))/2));
		column-gap: var(--margin);
	}
	.episode .podcasts h4 {
		grid-column: 1 / span 2;
	}
}


/* Playlist */
.playlist .content {
	grid-column: 1 / span 10;
	display: grid;
	grid-template-columns: repeat(10, 1fr);
	column-gap: var(--gutter);
}
.playlist h4 {
	position: sticky;
	top: calc((var(--margin)*2 + 5.7rem));
}
.playlist .active-video {
	grid-column: 1 / span 7;
	position: sticky;
	height: fit-content;
	top: calc((var(--margin)*2 + 8rem));
}
.playlist .cover {
	max-height: calc(100vh - (var(--margin)*3 + 8rem));
	width: 100%;
	object-fit: cover;
}
.playlist .videos .item {
	width: 100%;
	display: block;
}
.playlist .videos .item:not(.active):hover .title {
	border-right: solid 5px var(--black);
	padding-right: calc(var(--gutter) - 5px);
	border-radius: 0;
}
.playlist .videos .item + .item:not(.active) {
	border-top: solid 1px var(--black);
}
.playlist .videos .opener {
	height: 0;
	overflow: hidden;
}
.playlist .videos .title {
	padding: var(--gutter);
	border-radius: .6rem;
}
.playlist .videos .item.active .title {
	background-color: var(--gray);
}
.playlist .videos .item.active:not(:first-of-type) .title {
	margin-top: 1px;
}
.playlist .videos .authors {
	padding: 0;
}
.playlist .videos .author {
	display: inline-block;
	text-decoration: underline;
}
.playlist .videos .item.active .opener {
	height: auto;
	padding: var(--gutter);
}
@media screen and (max-width: 800px) {
	.playlist .content {
		grid-column: 1 / span 1;
		display: flex;
		flex-direction: column;
	}
	.playlist h4 {
		position: relative;
		top: unset;
	}
	.playlist .titles {
		border-bottom: solid 1px var(--black);
		padding-bottom: 6rem;
	}
	.playlist .active-video {
		display: none;
	}
	.playlist .videos .mobile-video {
		margin: 2rem 0;
	}
	.playlist .videos .title {
		padding: 0;
	}
	.playlist .videos .item.active .title {
		background-color: transparent;
	}
	.playlist .videos .opener {
		/* height: auto; */
		margin-top: 1rem;
	}
	.playlist .videos .item.active .opener {
		/* height: auto; */
		padding: unset;
	}
	.playlist .videos .body {
		margin-bottom: 0;
	}
	.playlist .videos .item {
		padding-bottom: 6rem;
	}
	.playlist .videos .item.active:not(:first-of-type) .title {
		margin-top: unset;
	}
	.playlist .videos .item:not(.active):hover .title {
		border-right: unset;
		padding-right: unset;
		border-radius: unset;
	}
	.playlist .videos .item + .item {
		border-top: solid 1px var(--black);
	}
}

/* Video */
.video .description {
	grid-column: 1 / span 6;
}
.video .active-video {
	margin-top: 4rem;
}

.video .playlists {
	grid-column: 8 / span 3;
}
.video .playlists h4 {
	border-bottom: solid 1px var(--black);
	padding-bottom: 1rem;
}
.video .playlists h2 {
	margin-top: 1rem;
}
.video .playlists .cover {
	max-height: 150px;
	width: auto;
}
.video .playlists .playlist {
	display: block;
	padding-top: 1rem;
	padding-bottom: 3rem;
}
@media screen and (max-width: 800px) {
	.video .playlists {
		display: grid;
		grid-template-columns: repeat(2, calc((100% - var(--gutter))/2));
		column-gap: var(--margin);
	}
	.video .playlists h4 {
		grid-column: 1 / span 2;
	}
}
</style>