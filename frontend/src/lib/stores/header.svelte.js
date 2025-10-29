let up = $state(false)
let inverted = $state(false)
let initialInverted = $state(false)

export function getHeader() {
	function setUp(u) {
		up = u
	}
	function setInverted(i) {
		inverted = i
	}
	function setInitialInverted(ii) {
		initialInverted = ii
	}
	return {
		get up() {
			return up;
		},
		setUp,
		get inverted() {
			return inverted;
		},
		setInverted,
		get initialInverted() {
			return initialInverted;
		},
		setInitialInverted,
	};
}