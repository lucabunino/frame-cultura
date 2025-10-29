<!-- StatTextStyle.svelte -->
<script>
	let { portableText } = $props();
	let { value } = $derived(portableText);

	let count = $state(0);
	let hasAnimated = false;

	// IntersectionObserver action
	function animateOnVisible(node) {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !hasAnimated) {
						hasAnimated = true;
						animateCount(value.number, 500);
						observer.disconnect();
					}
				});
			},
			{ threshold: 0.3 }
		);
		observer.observe(node);
		return {
			destroy() {
				observer.disconnect();
			}
		};
	}

	function animateCount(target, duration = 1000) {
		let start = 0;
		let startTime;

		function tick(timestamp) {
			if (!startTime) startTime = timestamp;
			let progress = Math.min((timestamp - startTime) / duration, 1);
			count = Math.floor(progress * target);

			if (progress < 1) {
				requestAnimationFrame(tick);
			} else {
				count = target; // make sure it ends clean
			}
		}
		requestAnimationFrame(tick);
	}
</script>

{#if value._type === 'stat'}
<div class="stat" use:animateOnVisible>
	<p class="jost-210" style={`color: ${value.numberColor?.hex}`}>
		{count}
	</p>
	<p class="jost-54">{value.title}</p>
</div>
{/if}

<style>
.stat {
	flex-basis: calc((100% - var(--margin))/2);
	margin-top: 6rem;
	gap: 1rem;
	display: flex;
	flex-direction: column;
}
@media only screen and (max-width: 800px) {
	.stat {
		flex-basis: unset;
	}
}
</style>