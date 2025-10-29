<script>
  import PlainTextStyle from './PlainTextStyle.svelte';
  import DownloadTextStyle from './DownloadTextStyle.svelte';
  import { PortableText } from '@portabletext/svelte';

  let { portableText, children } = $props();
  let { global, value } = $derived(portableText);
  let { style, listItem, markDefs } = $derived(value);

  let accordionOpen = $state(false);
  let accordionHeight = $state(undefined);
</script>

{#if value?.title}
  <button class="opener" class:first={value?.first}
    onclick={(e) => { e.preventDefault(); accordionOpen = !accordionOpen }}>
    <h2 class="jost-18 uppercase bold">
      {value.title}
      <div id="accordionSwitch" class="plus" class:crossed={accordionOpen}>
        <div class="line"></div>
        <div class="line"></div>
      </div>
    </h2>
  </button>
{/if}

<div class="content-wrapper" class:last={value?.last}
     style="height: {accordionOpen ? accordionHeight : '0'}px">
  <div class="content" bind:clientHeight={accordionHeight}>
    {#each value?.content ?? [] as item, j}
      <PortableText
        value={item}
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
          }
        }}
      />
    {/each}
  </div>
</div>

<style>
.opener {
	border-top: solid 1px var(--darkGray);
	padding: 1em 0;
	position: relative;
	display: block;
	width: 100%;
}
.opener.first {
	margin-top: 4rem;
}
.content-wrapper {
	overflow: hidden;
	transition: var(--transition);
}
.content-wrapper.last {
	border-bottom: solid 1px var(--darkGray);
	margin-bottom: 4rem;
}
.content {
	padding-bottom: 4rem;
}
#accordionSwitch {
	z-index: 9;
	height: 100%;
	cursor: pointer;
	display: block;
	position: absolute;
	right: 0;
	top: 50%;
	aspect-ratio: 1;
	align-self: center;
	justify-items: center;
}
#accordionSwitch .line {
	width: 50%;
	height: 2px;
	background-color: var(--black);
	position: absolute;
	transition: var(--transition);
	transition-property: top, transform, transform-origin, width;
	transform-origin: center;
}
#accordionSwitch .line:nth-child(1) {transform: translateY(-50%)}
#accordionSwitch .line:nth-child(2) {transform: translateY(-50%) rotate(-90deg);}
#accordionSwitch.crossed .line:nth-child(1) {
	transform: translateY(-50%) rotate(45deg);
}
#accordionSwitch.crossed .line:nth-child(2) {
	transform: translateY(-50%) rotate(-45deg);
}
</style>