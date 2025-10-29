<!-- AboutTextStyle -->
<script>
  import { fileUrl } from '$lib/utils/sanity';

  let { portableText, children } = $props();
  let { global, value } = $derived(portableText);
  let { style, listItem, markDefs } = $derived(value);
</script>

{#if value?._type === 'download'}
  <a
    class="download btn"
    href={fileUrl(value.file)}
    target="_blank"
    rel="noopener noreferrer"
  >
    {value.title}{@html ' ↓'}
  </a>
{/if}

<style>
.download {
	display: block;
	width: fit-content;
	margin: 2em 0 4em;
	background-color: var(--black);
	color: var(--white);
}
</style>