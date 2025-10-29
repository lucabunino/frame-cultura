<script>
import { formatAuthorName } from "$lib/utils/author";
import { urlFor } from "$lib/utils/image";
let {
	production
} = $props()
</script>

<a class="production" href="/esplora/{production.slug.current}">
	<img class="cover rounded"
	class:_1-1={production._type == "episode" || production._type == "podcast"}
	class:_16-9={production._type == "video" || production._type == "playlist"}
	src={urlFor(production.cover ? production.cover : data.info.placeholder).width(800)}
	alt="Copertina di {production.title}"
	>
	<span class="btn"
	class:listen={production._type == "episode" || production._type == "podcast"}
	class:watch={production._type == "video" || production._type == "playlist"}
	>
		<svg width="19" height="15" viewbox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M18.53 7.5 0 15V0l18.53 7.5Z"/>
		</svg>
		{production._type == "episode" || production._type == "podcast" ? "Ascolta" : "Guarda"}
	</span>
</a>

<style>
.production {
	max-width: 400px;
	display: block;
	position: relative;
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
.production h2, .production h3 {
	line-height: 1.05;
}
.production p {
	margin-top: 1rem;
}
.production .cover {
	margin-bottom: 1rem;
}
</style>