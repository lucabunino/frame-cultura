<!-- BoxedTextStyle -->
<script>
let { portableText } = $props();
let { value } = $derived(portableText)
</script>

{#if value._type === 'boxedText'}
<div class="box">
	<p class="jost-45">{value.title}</p>
	{#if value.abstract}
		<p class="jost-18">{value.abstract}</p>
	{/if}
</div>
{/if}

<style>
.box {
	border-radius: 1rem;
	background-color: var(--gray);
	padding: var(--gutter);
}
</style>