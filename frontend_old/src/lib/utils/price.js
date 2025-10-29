export function formatPrice(price) {
	if (price == null || isNaN(price)) return '';
	const hasDecimal = price % 1 !== 0;
	return hasDecimal ? price.toFixed(2) : String(price);
}