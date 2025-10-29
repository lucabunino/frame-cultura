<script>
import { PortableText } from '@portabletext/svelte'
import PlainTextStyle from "$lib/components/portableTextStyles/PlainTextStyle.svelte";
let { data } = $props()
</script>

<section id="policy">
	{#if data.policy.title}<h1 class="jost-74">{data.policy.title}</h1>{/if}
	{#if data.policy.body}
		<div class="body jost-21">
			<PortableText
			value={data.policy.body}
			components={{
			block: {
				normal: PlainTextStyle,
				h2: PlainTextStyle,
				h3: PlainTextStyle,
			},
			listItem: PlainTextStyle,
			marks: {
				link: PlainTextStyle,
			},
			}}/>
		</div>
	{/if}
</section>

<style>
#policy {
	padding: var(--margin);
	max-width: 800px;
}
h1 {
	margin-bottom: 2rem;
}
</style>