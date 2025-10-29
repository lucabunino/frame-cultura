export default [`
	.swiper-button-prev,
	.swiper-button-next {
		width: 30%;
		top: 0;
		z-index: 1;
		height: 100%;
		margin: 0;
		position: absolute;
		border: solid 1px white;
	}
	.swiper-button-prev {
		left: 0;
	}
	.swiper-button-next {
		right: 0;
	}
	.swiper-button-next svg,
	.swiper-button-prev svg {
		display: none;
	}
	.swiper-button-disabled {
		cursor: default;
		pointer-events: none;
		display: none;
	}
`];