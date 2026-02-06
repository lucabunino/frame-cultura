<script>
  let { portableText, children } = $props();
  let { global, value } = $derived(portableText);
  let { style, listItem, markDefs } = $derived(value);
</script>

{#if value?._type === 'link'}
  <span class="link">
    <a href={value?.url} target={value?.blank ? '_blank' : undefined}>
      {@render children()}
      {#if value?.blank}<sup>{@html ' ↗'}</sup>{/if}
    </a>
  </span>
{:else if style === 'normal' && !listItem}
  <p>{@render children()}</p>
{:else if listItem === 'bullet'}
  <li>{@render children()}</li>
{:else if style === 'h3'}
  <h3 class="jost-21 uppercase bold">{@render children()}</h3>
{/if}

<style>
p {
	flex-basis: 100%;
	width: 100%;
	max-width: 700px;
}
:global(#body p:not(:first-child)) {
	margin-top: 1.2em;
}
.link {
	text-decoration: underline;
	cursor: pointer;
}
h3 {
	flex-basis: 100%;
	margin-top: 12rem;
	margin-bottom: 6rem;
	border-top: solid 1px var(--black);
	width: 100%;
	text-align: center;
	padding-top: 6rem;
}
li {
	padding: 0;
	text-indent: 0;
	list-style-type: "— ";
    list-style-position: inside;
}
</style>