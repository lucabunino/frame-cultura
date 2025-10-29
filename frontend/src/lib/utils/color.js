export function isDark(hex) {
	if (hex) {
		hex = hex.replace(/^#/, '');

		const r = parseInt(hex.substr(0, 2), 16);
		const g = parseInt(hex.substr(2, 2), 16);
		const b = parseInt(hex.substr(4, 2), 16);

		const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
		return luminance < 128;	
	} else {
		return false;
	}
}

export const colors = ["#78aed2", "#355b8a", "#0e7f93", "#478a68", "#99c92f", "#f89b22", "#c23b3f", "#b0216e"]