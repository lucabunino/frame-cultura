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
{:else if style === 'h2'}
  <h2 class="jost-21 uppercase bold">{@render children()}</h2>
{:else if style === 'h3'}
  <h3 class="jost-12 uppercase bold">{@render children()}</h3>
{:else if style === 'h4'}
  <p class="jost-36 mobile-jost-27">{@render children()}</p>
{/if}
<style>
p {
	flex-basis: 100%;
}
:global(.body p:not(:first-child)) {
	margin-top: 1rem;
}
.link {
	text-decoration: underline;
	cursor: pointer;
}
h2, h3 {
	flex-basis: 100%;
	margin-top: 4rem;
	margin-bottom: 2rem;
}
:global(.body .jost-36:not(:first-child)) {
	margin-top: 3rem;
}
.jost-36 {
	margin-bottom: 3rem;
}
li {
	padding: 0;
	text-indent: 0;
	list-style-type: "— ";
    list-style-position: inside;
}
</style>