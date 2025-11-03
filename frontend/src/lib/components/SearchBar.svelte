<script>
import { goto } from "$app/navigation";
let {
	search,
	mobileFullWidth = false,
	small = true,
	mobileAnchorBottom = true,
	placeholder = "Cerca",
	openSearch = false,
	header = false,
	searchOpen = $bindable(true),
	keepPage = false
} = $props()
function handleKeydown(e) {
	if (event.key === "Escape") {
		searchOpen = false;
	}
}
</script>

<svelte:window onkeydown={(e) => handleKeydown(e)}></svelte:window>

<form id="search-bar" class="btn" class:small={small} class:mobileFullWidth={mobileFullWidth} class:header={header} class:open={openSearch} class:mobileAnchorBottom={mobileAnchorBottom}
onsubmit={(e) => {
	e.preventDefault()
	searchOpen = false
	if (search?.trim()) {
		if (keepPage) {
			goto(`?search=${encodeURIComponent(search)}`)
		} else {
			goto(`/cerca?search=${encodeURIComponent(search)}`)
		}
	}
}}>
	<input type="text" name="search" id="search" class="{small ? "jost-15 mobile-jost-12 bold uppercase" : "jost-27 bold"}" bind:value={search} placeholder={placeholder}>
	<button aria-label="Search submit" type="submit" id="search-submit" class="jost-27">
		<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" style={search ? 'fill: var(--black)' : ''}>
			<g clip-path="url(#a)">
				<path d="M7.96 0c-2.8-.017-5.083 2.25-5.1 5.063a5.103 5.103 0 0 0 .835 2.813L0 11.57 1.417 13l3.687-3.688c.807.547 1.78.869 2.826.874 2.788 0 5.053-2.262 5.07-5.063C13.017 2.31 10.76.017 7.96 0Zm.001 8.113a3.073 3.073 0 0 1-3.094-3.05h-.004A3.089 3.089 0 0 1 7.93 1.955a3.072 3.072 0 0 1 3.068 3.05A3.073 3.073 0 0 1 7.96 8.113Z"/>
			</g>
			<defs>
				<clipPath id="a">
					<path fill="#fff" d="M0 0h13v13H0z"/>
				</clipPath>
			</defs>
		</svg>
	</button>
</form>

<style>
/* Search */
#search-bar {
	display: inline;
	position: relative;
	background-color: var(--gray);
	width: auto;
	display: inline-block;
}
#search-bar.header {
	position: absolute;
	right: 8rem;
}
input::placeholder {
	color: var(--darkGray);
}
#search {
	width: 400px;
	padding: 0;
	border: none;
	background: transparent;
}
#search-bar.small #search {
	width: 250px;
}
#search-submit {
	position: absolute;
    height: 100%;
    display: block;
    right: 2.5rem;
    top: 0;
}
#search-submit svg {
	fill: var(--darkGray);
	height: 35%;
    width: auto;
}
@media only screen and (max-width: 800px) {
	#search-bar.mobileFullWidth {
		width: 100%;
	}
	#search {
		width: stretch;
	}
}
@media screen and (max-width: 800px) {
	#search-bar {
		display: none;
	}
	#search-bar:not(.mobileAnchorBottom) {
		display: block;
	}
	#search-bar input {
		width: stretch;
	}
	#search-bar.open {
		display: flex;
		border: none;
	}
}
</style>