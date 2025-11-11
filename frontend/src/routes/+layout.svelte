<script>
// Imports
import "../app.css";
import { dev } from '$app/environment';
import { page, navigating } from '$app/state';
import { urlFor } from '$lib/utils/image';
import { getHeader } from '$lib/stores/header.svelte';
let header = getHeader()
import { onMount } from "svelte";
import { goto } from "$app/navigation";
import { ProgressBar } from "@prgm/sveltekit-progress-bar";
import { isPast } from "$lib/utils/date";
import Live from "$lib/components/Live.svelte";
import SearchBar from "$lib/components/SearchBar.svelte";
import { innerWidth, scrollY } from 'svelte/reactivity/window';

// Variables
let { data, children } = $props();
if (page.url.pathname == '/esplora' && data.exploreHasContent || page.url.pathname == '/live' && data.liveHasContent) {
	header.setInverted(true)
} else {
	header.setInverted(false)
}
let mouse = $state([])
let domLoaded = $state(false)
let placeholder = $derived(innerWidth.current > 800  ? 'cerca nel sito' : 'cerca')
let lastScrollY = $state(0)
let menuOpen = $state(false)
let cookieAccepted = $state(false)
let headerHeight = $state(undefined)
let search = $state(undefined)
let body = $state(undefined)
let showBanner = $state()
let searchOpen = $state(false)

// Lifecycle
$effect(() => {
	if (navigating.to) {
		header.setUp(false)
	}
	if (menuOpen) {
		body.style.overflow = 'hidden';
	} else {
		body.style.overflow = '';
	}
	if (localStorage.getItem('cookieConsent') === 'accepted') {
		showBanner = false;
	} else {
		showBanner = true;
	}
})

// Functions
function handleMousemove(event) {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
}
function acceptCookies() {
  localStorage.setItem('cookieConsent', 'accepted');
  showBanner = false;
  cookieAccepted = true;
}
function rejectCookies() {
  localStorage.setItem('cookieConsent', 'rejected');
  showBanner = false;
  cookieAccepted = false;
}
function handleScroll(e) {
	if (scrollY.current > lastScrollY && scrollY.current > 50) {
		header.setUp(true)
	} else {
		header.setUp(false)
	}
	if (header.initialInverted) {
		if (scrollY.current > 250 - headerHeight) {
			header.setInverted(false)
		} else {
			header.setInverted(true)
		}
	}
	lastScrollY = scrollY.current
}

// Dev
let viewGrid = $state(false)
const gridColumnsDesktop = 10
const gridColumnsMobile = 8
function handleKey({key}) {if (key === 'G' && dev) {viewGrid = !viewGrid}}
</script>

<svelte:window onkeyup={handleKey} onmousemove={handleMousemove} onscroll={(e) => handleScroll(e)}></svelte:window>
<svelte:body bind:this={body}></svelte:body>

{#if viewGrid}
<div id="layout"
			style="grid-template-columns:repeat({innerWidth.current > 800 ? gridColumnsDesktop : gridColumnsMobile}, 1fr);pointer-events:none;display: grid;position:fixed; z-index:999;width: -moz-available;width: -webkit-fill-available;width: -moz-available;width: fill-available;height: -moz-available;height: -webkit-fill-available;margin:0 var(--margin);gap:var(--gutter);opacity:.2;">
	{#each Array(innerWidth.current > 800 ? gridColumnsDesktop : gridColumnsMobile) as _, i}
		<div style="background-color:red"></div>
	{/each}
</div>
{/if}

<svelte:head>
	{#if data.seo.SEOTitle}<title>{data.seo.SEOTitle}</title>{/if}
	{#if data.seo.SEODescription}<meta name="description" content={data.seo.SEODescription}>{/if}
	<link rel="canonical" href={page.url}>
	<meta name="robots" content="index,follow">
	<meta name="googlebot" content="index,follow">
	{#if data.seo.SEOTitle}<meta property="og:title" content={data.seo.SEOTitle}>{/if}
	{#if data.seo.SEODescription}<meta property="og:description" content={data.seo.SEODescription}>{/if}
	{#if data.seo.SEOImage}<meta property="og:image" content={urlFor(data.seo.SEOImage).width(2000).url()}>{/if}
	<meta property="og:url" content={page.url}>
	<meta property="og:type" content="website">
	{#if data.seo.SEOTitle}<meta property="og:site_name" content={data.seo.SEOTitle}>{/if}
</svelte:head>
<header>
	<nav aria-label="menu" class="menu" class:open={menuOpen} class:up={header.up} class:inverted={header.inverted} bind:clientHeight={headerHeight}>
		{#if data.info.logo}
			<a class="logo" href="/" class:active={page.url.pathname === "/"}
			onclick={() => {menuOpen = false, header.setUp(false), search = undefined}}>
				<img src={urlFor(data.info.logo)} alt="">
			</a>
		{/if}
		<ul class="jost-74">
			<li class="menu-item" class:active={page.url.pathname === "/esplora" || page.url.pathname.includes("/esplora/")}>
				<a href="/esplora"
				onclick={() => {menuOpen = false, header.setUp(false), search = undefined}}>esplora</a>
			</li>
			<li class="menu-item" class:active={page.url.pathname === "/autori" || page.url.pathname.includes("/autori/")}>
				<a href="/autori"
				onclick={() => {menuOpen = false, header.setUp(false), search = undefined}}>autori</a>
			</li>
			<li class="menu-item" class:active={page.url.pathname === "/live" || page.url.pathname.includes("/live/")}>
				<a href="/live"
				onclick={() => {menuOpen = false, header.setUp(false), search = undefined}}>live</a>
			</li>
			<li class="menu-item" class:active={page.url.pathname === "/about"}>
				<a href="/about"
				onclick={() => {menuOpen = false, header.setUp(false), search = undefined}}
				>about</a>
			</li>
			<li class="menu-item" class:active={page.url.pathname === "/network"}>
				<a href="/network"
				onclick={() => {menuOpen = false, header.setUp(false), search = undefined}}>network</a>
			</li>
			<li class="menu-item" class:active={page.url.pathname === "/contatti"}>
				<a href="/contatti"
				onclick={() => {menuOpen = false, header.setUp(false), search = undefined}}>contatti</a>
			</li>
			<form id="search-bar" class="menu-item" onsubmit={(e) => {
				e.preventDefault()
				if (search?.trim()) {
					goto(`/cerca?search=${encodeURIComponent(search)}`)
					menuOpen = false, header.setUp(false), search = undefined
				}
			}}>
				<input type="text" name="search" id="search" placeholder="cerca" bind:value={search}>
				<button type="submit" id="search-submit" class="btn bg-gray">
					cerca
				</button>
			</form>
		</ul>
		<div id="switchContainer">
			<div class="desktop-only">
				{#if searchOpen}
					<SearchBar bind:searchOpen={searchOpen} search={search} header={true} small={true} mobileAnchorBottom={false} placeholder={"Cerca nel sito"}/>
				{:else}
					<button aria-label="Search switch" id="searchSwitch" class="jost-27" onclick={() => searchOpen = !searchOpen}>
						<svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 13">
							<path d="M7.96 0c-2.8-.017-5.083 2.25-5.1 5.063-.003 1 .495 2.193 1.043 3.029L0 11.57 1.417 13l3.38-3.888c.808.547 2.087 1.07 3.133 1.074 2.788 0 5.053-2.262 5.07-5.063C13.017 2.31 10.76.017 7.96 0Zm.001 8.861a3.843 3.843 0 0 1-3.864-3.8h-.004A3.859 3.859 0 0 1 7.93 1.207a3.842 3.842 0 0 1 3.838 3.8A3.843 3.843 0 0 1 7.96 8.861h.001Z"/>
						</svg>
					</button>
				{/if}
			</div>
			<button aria-label="Menu switch" id="menuSwitch" onclick={(e) => {menuOpen = !menuOpen, header.setUp(false), search = undefined}} class:crossed={menuOpen}>
				<div class="line"></div>
				<div class="line"></div>
				<div class="line"></div>
			</button>
		</div>
	</nav>
</header>

{#key data.pathname + cookieAccepted}
	<main class:marginTop={!header.initialInverted}>
		{@render children()}
	</main>
{/key}

<div class="pre-footer jost-74">
	<form id="search-bar" class="menu-item" onsubmit={(e) => {
		e.preventDefault()
		if (search?.trim()) {
			goto(`/cerca?search=${encodeURIComponent(search)}`)
		}
	}}>
		<input type="text" name="search" id="search" placeholder={placeholder} bind:value={search}>
		<button type="submit" id="search-submit" class="btn bg-gray">
			cerca
		</button>
	</form>
	{#if data.info.newsletter && data.info.newsletterLink}
		<div class="newsletter mobile-only">
			<h5>newsletter</h5>
			<p class="jost-18">{data.info.newsletter}</p>
			<a class="btn bg-black text-white mobile-w-100" href={data.info.newsletterLink} target="_blank" rel="noopener noreferrer">Iscriviti</a>
		</div>
	{/if}
	{#if data.info.footerPatterns}
		{@const randomIndex = Math.floor(Math.random() * data.info.footerPatterns.length)}
		<div class="footer-pattern" style={`background-image: url(${urlFor(data.info.footerPatterns[randomIndex])})`}></div>
	{/if}
</div>
<footer class="jost-24 mobile-jost-22" class:marginBottom={data.liveWidget && isPast(data.liveWidget?.liveWidget?.displayStart)}>
	<div>
		{#if data.info.ragioneSociale}<p>{data.info.ragioneSociale}</p>{/if}
		{#if data.info.adressLabel}
			{#if data.info.adressGoogleMaps}
				<a href={data.info.adressGoogleMaps} target="_blank" rel="noopener noreferrer">{data.info.adressLabel}</a>
			{:else}
				<p>{data.info.adressLabel}</p>
			{/if}
		{/if}
	</div>
	<div>
		{#if data.info.email}<a href="mailto:{data.info.email}">{data.info.email}</a>{/if}
		{#if data.info.socials}
			<h4 class="jost-12 uppercase bold">Seguici su</h4>
			<div class="socials">
				{#each data.info.socials as social}
					<a href={social.link} target="_blank" rel="noopener noreferrer"><img class="social" src={urlFor(social.icon)} alt=""></a>
				{/each}
			</div>
		{/if}
	</div>
	<nav>
		<ul>
			<li class="footer-item" class:active={page.url.pathname === "/esplora" || page.url.pathname.includes("/esplora/")}>
				<a href="/esplora">esplora</a>
			</li>
			<li class="footer-item" class:active={page.url.pathname === "/autori" || page.url.pathname.includes("/autori/")}>
				<a href="/autori">autori</a>
			</li>
			<li class="footer-item" class:active={page.url.pathname === "/live" || page.url.pathname.includes("/live/")}>
				<a href="/live">live</a>
			</li>
			<li class="footer-item" class:active={page.url.pathname === "/about"}>
				<a href="/about">about</a>
			</li>
			<li class="footer-item" class:active={page.url.pathname === "/network"}>
				<a href="/network">network</a>
			</li>
			<li class="footer-item" class:active={page.url.pathname === "/contatti"}>
				<a href="/contatti">contatti</a>
			</li>
		</ul>
	</nav>
	{#if data.info.newsletter && data.info.newsletterLink}
		<div class="desktop-only">
			<h5>newsletter</h5>
			<p class="jost-18">{data.info.newsletter}</p>
			<a class="btn" href={data.info.newsletterLink} target="_blank" rel="noopener noreferrer">Iscriviti</a>
		</div>
	{:else}
		<div class="desktop-only"></div>
	{/if}
	<div class="jost-15 mobile-jost-12">
		<div>
			<p>©{new Date().getFullYear()} {#if data.info.ragioneSociale}{data.info.ragioneSociale}{/if}</p>
			{#if data.info.pIva || data.info.ccia}
				<p>{#if data.info.pIva}P.IVA {data.info.pIva}{/if}</p>
			{/if}
			{#if data.policies}
				{#each data.policies as policy}
					<!-- <a href="/{policy.kind}">{policy.kind.charAt(0).toUpperCase() + policy.kind.slice(1)}</a> -->
					<a href="/{policy.kind}">{policy.kind}</a>
				{/each}
			{/if}
		</div>
		<p>sviluppo: <a class="underline" href="http://www.lucabunino.com" target="_blank" rel="noopener noreferrer">Luca Bunino</a></p>
	</div>
</footer>

<div id="loader">
	<ProgressBar color="var(--blue)" zIndex={100}/>
</div>

<!-- {#if !page.url.pathname.includes("/live/streaming/") && data.liveWidget && isPast(data.liveWidget?.liveWidget?.displayStart)}
	<Live live={data.liveWidget.liveWidget} />
{/if} -->

{#if showBanner}
	<div id="cookie-banner" class="jost-15 shadow rounded">
		<p>Questo sito utilizza servizi di terze parti come Youtube che possono impostare cookie. Avviando la riproduzione di un video, consenti l’uso dei relativi cookie.{#each data.policies as policy}{#if policy.kind == 'cookies'}{@html ' '}Per saperne di più, consulta la nostra <a href="/cookies" class="underline">cookie policy</a>{/if}{/each}</p>
		<div id="cookie-btns">
			<button id="accept-cookies" onclick={acceptCookies} class="jost-12 bold uppercase">Ok, ho capito</button>
		</div>
	</div>
{/if}

<style>
/* Header */
.menu {
	background-color: var(--white);
	display: flex;
	justify-content: space-between;
	padding: var(--margin);
	position: fixed;
	top: 0;
	width: 100%;
	z-index: 10;
	transition: var(--transition);
	transition-property: transform;
	gap: var(--margin);
}
.menu.inverted:not(.open) {
	background-color: transparent;
	color: var(--white);
}
.menu.inverted:not(.open) .logo {
	filter: brightness(100);
}
.menu.up:not(.open) {
	transform: translateY(-100%);
}
.menu ul {
	position: absolute;
	top: 0;
	left: 0;
	background-color: var(--white);
	width: 100vw;
	height: 0;
	list-style: none;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	padding: 0;
}
.menu a {
	line-height: 1;
}
.menu.open ul {
	height: 100vh;
	height: 100svh;
	padding: calc(var(--margin)*2 + 4rem + var(--margin) + 2rem) var(--margin);
}
.logo {
	z-index: 2;
}
.logo img {
	height: 4rem;
}
.menu-item {
	width: fit-content;
}
.menu-item:hover, .menu-item.active {
	color: var(--blue);
}
#switchContainer {
	display: flex;
	gap: 1em;
}
#searchSwitch {
	z-index: 2;
	width: 1.4em;
	height: auto;
	cursor: pointer;
	display: block;
	position: relative;
	align-self: center;
}
#searchSwitch svg {
	fill: var(--black);
	width: 100%;
	height: auto;
	margin-top: .3em;
}
.inverted:not(.open) #searchSwitch svg {
	fill: var(--white);
}
#menuSwitch {
	z-index: 2;
	width: 2.5em;
	height:1em;
	cursor: pointer;
	display: block;
	position: relative;
	align-self: center;
}
#menuSwitch .line {
	width: 100%;
	height: clamp(1px, .1vw, 2px);
	height: 4px;
	background-color: var(--black);
	position: absolute;
	-webkit-transition: var(--transition);
	-o-transition: var(--transition);
	transition: var(--transition);
	-webkit-transition-property: top, width, -webkit-transform, -webkit-transform-origin;
	transition-property: top, width, -webkit-transform, -webkit-transform-origin;
	-o-transition-property: top, transform, transform-origin, width;
	transition-property: top, transform, transform-origin, width;
	transition-property: top, transform, transform-origin, width, -webkit-transform, -webkit-transform-origin, -ms-transform-origin;
	-webkit-transform-origin: center;
	    -ms-transform-origin: center;
	        transform-origin: center;
}
.menu.inverted:not(.open) #menuSwitch .line {
	background-color: var(--white);
}
#menuSwitch .line:nth-child(1) {top: 0;}
#menuSwitch .line:nth-child(2) {top: 50%;}
#menuSwitch .line:nth-child(3) {top: 100%;}
#menuSwitch.crossed .line:nth-child(1) {
	-webkit-transform: rotate(35deg);
	    -ms-transform: rotate(35deg);
	        transform: rotate(35deg);
	top: 50%;
}
#menuSwitch.crossed .line:nth-child(2) {
	-webkit-transform: scaleX(0);
	    -ms-transform: scaleX(0);
	        transform: scaleX(0);
}
#menuSwitch.crossed .line:nth-child(3) {
	-webkit-transform: rotate(-35deg);
	    -ms-transform: rotate(-35deg);
	        transform: rotate(-35deg);
	top: 50%;
}
@media screen and (max-width: 800px) {
	.menu ul {
		gap: .1em;
	}
}

/* Search */
#search-bar {
	appearance: none;
	position: relative;
	display: flex;
	align-items: center;
	max-width: stretch;
	width: 100%;

}
#search-bar input {
	height: calc(1em + 1rem);
	border: none;
	padding: 0;
	display: inline;
	width: 100%;
	border-bottom: solid 1px transparent;
	padding-bottom: 1rem;
}
#search-bar input:focus {
	border-bottom: solid 1px var(--black);
}
#search-bar input::placeholder {
	color: var(--gray);
	display: inline;
}
#search-bar button {
	position: absolute;
	right: 0;
	opacity: 0;
}
#search-bar input:focus + button {
	opacity: 1;
}
.pre-footer #search-bar {
	margin: 2rem var(--margin);
}
.pre-footer #search-bar input {
	border-color: var(--black);
}
@media screen and (max-width: 800px) {
	.pre-footer #search-bar {
		display: none;
	}
	.pre-footer {
		border-top: solid 1px var(--black);
	}
	#search-bar {
		position: absolute;
		left: var(--margin);
		bottom: 2rem;
		right: var(--margin);
		border-bottom: solid 1px var(--black);
	}
	#search-bar button {
		opacity: 1;
	}
}

/* Main */
main.marginTop {
	margin-top: calc(var(--margin)*2 + 4rem);
	padding-top: 2rem;
}

/* Pre-footer */
.pre-footer {
	margin-top: 20rem;
}
.footer-pattern {
  height: 50px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.pre-footer .newsletter {
	padding: 4rem var(--margin);
	text-align: center;
}
.pre-footer .newsletter p {
	margin: 2rem 0;
}

/* Footer */
footer {
	background-color: var(--black);
	color: var(--white);
	display: grid;
	grid-template-columns: repeat(10, 1fr);
	column-gap: var(--gutter);
	row-gap: 4rem;
	padding: var(--margin);
}
footer > :nth-child(1) {grid-column: 1 / span 2;}
footer > :nth-child(2) {grid-column: 3 / span 2;}
footer h4 {
	margin-top: 2rem;
}
footer .socials {
	display: flex;
	gap: .5rem;
	margin-top: 1rem;
}
footer .social {
	height: 2rem;
	width: auto;
}
footer > :nth-child(3) {grid-column: 5 / span 2;}
footer nav ul {
	padding: 0;
	list-style: none;
}
footer > :nth-child(4) {grid-column: 7 / span 4;}
footer > :nth-child(4) p {
	margin: 2rem 0;
	max-width: 600px;
}
footer > :nth-child(5) {
	grid-column: 1 / span 10;
	display: grid;
	grid-template-columns: repeat(10, 1fr);
	margin-top: 6rem;
	align-items: end;
}
footer > :nth-child(5) > div {
	display: flex;
	column-gap: var(--margin);
	grid-column: 1 / span 6;
}
footer > :nth-child(5) > p {
	grid-column: 7 / span 4;
}
footer a:hover:not(.btn) {
	opacity: .3;
}
footer .btn {
	border: solid 1px var(--white);
}
@media screen and (max-width: 1080px) {
	footer > :nth-child(1) {grid-column: 1 / span 5;}
	footer > :nth-child(2) {grid-column: 6 / span 5;}
	footer > :nth-child(3) {grid-column: 1 / span 5;}
	footer > :nth-child(4) {grid-column: 6 / span 5;}
	footer > :nth-child(5) > div {grid-column: 1 / span 5;}
	footer > :nth-child(5) > p {grid-column: 6 / span 5;}
}
@media screen and (max-width: 800px) {
	footer {
		display: flex;
		flex-direction: column;
		padding: 4rem var(--margin);
	}
	footer.marginBottom {
		padding: 4rem var(--margin) calc(5rem + var(--liveHeight) + var(--margin)*2);
	}
	footer h4 {
		margin-top: 4rem;
	}
	footer .socials {
		gap: 1rem;
	}
	footer .social {
		height: 3rem;
	}
	footer > :nth-child(5) {
		flex-direction: column;
		gap: var(--margin);
	}
	footer > :nth-child(5) div {
		flex-direction: column;
	}
}

/* Loader */
#loader {
	display: block;
	position: fixed;
	bottom: 0;
	width: 100%;
	z-index: 99;
}

/* Banner */
#cookie-banner {
	position: fixed;
	left: 0;
	bottom: 1rem;
	background-color: var(--white);
	max-width: 500px;
	padding: 1rem var(--margin);
	display: flex;
	flex-direction: column;
	gap: 2rem;
	z-index: 99;
	margin: 0 calc(var(--margin)/2);
}
</style>