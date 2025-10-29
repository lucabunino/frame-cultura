<script>
  let { portableText, children } = $props();
  let { global, value } = $derived(portableText);
  let { style, listItem, markDefs } = $derived(value);
</script>

{#if value._type === 'link'}
  <span class="link">
    <a href={value?.url} target={value?.blank ? '_blank' : undefined}>
      {@render children()}
      {#if value?.blank}<sup>{@html ' ↗'}</sup>{/if}
    </a>
  </span>
{:else if style === 'normal' && !listItem}
  <p class="jost-30">{@render children()}</p>
{:else if listItem === 'bullet'}
  <li>{@render children()}</li>
{:else if value._type === 'anchor'}
  <span id={value.slug?.current} class="anchor"></span>
  <h4 class="jost-12 uppercase bold" class:invisible={!value.visible}>{value.title}</h4>
{/if}

<style>
p {
	flex-basis: 100%;
}
.link {
	text-decoration: underline;
	cursor: pointer;
}
h4 {
	flex-basis: 100%;
	border-bottom: solid 1px var(--black);
	padding-top: calc(var(--margin)*2 + 4rem);
	margin-bottom: 1rem;
	padding-bottom: 1rem;
}
h4.invisible {
	margin: 0;
	padding: 0;
	height: 0;
	overflow: hidden;
}
li {
	padding: 0;
	text-indent: 0;
	list-style-type: "— ";
    list-style-position: inside;
}
.anchor {
	height: 0;
	overflow: hidden;
	margin-top: calc((var(--margin)*2 + 4rem)*-1);
}
</style>