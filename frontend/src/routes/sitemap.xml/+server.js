import { getAuthors, getExplore, getLive } from '$lib/utils/sanity';
let baseUrl = "https://www.framecultura.it/"

export async function GET() {
	const productions = await getExplore();
	const productionsXML = productions.map(production => `
	<url>
		<loc>${baseUrl}/esplora/${production.slug.current}</loc>
		<priority>0.70</priority>
	</url>`
	).join('');

	const authors = await getAuthors();
	const authorsXML = authors.map(author => `
	<url>
		<loc>${baseUrl}/autori/${author.slug.current}</loc>
		<priority>0.70</priority>
	</url>`
	).join('');

	const events = await getLive();
	const eventsXML = events.map(event => `
	<url>
		<loc>${baseUrl}/live/${event.slug.current}</loc>
		<priority>0.70</priority>
	</url>`
	).join('');


	// Build the complete sitemap
	return new Response(
		`
		<?xml version="1.0" encoding="UTF-8"?>
		<urlset
			xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
			xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
		>
			<url>
				<loc>${baseUrl}</loc>
				<priority>1.00</priority>
			</url>
			<url>
				<loc>${baseUrl}/esplora</loc>
				<priority>0.80</priority>
			</url>
			${productionsXML}
			<url>
				<loc>${baseUrl}/autori</loc>
				<priority>0.80</priority>
			</url>
			${authorsXML}
			<url>
				<loc>${baseUrl}/live</loc>
				<priority>0.80</priority>
			</url>
			${eventsXML}
			<url>
				<loc>${baseUrl}/about</loc>
				<priority>0.80</priority>
			</url>
			<url>
				<loc>${baseUrl}/network</loc>
				<priority>0.80</priority>
			</url>
			<url>
				<loc>${baseUrl}/contatti</loc>
				<priority>0.80</priority>
			</url>
			<url>
				<loc>${baseUrl}/cerca</loc>
				<priority>0.80</priority>
			</url>
		</urlset>`.trim(),
		{
		headers: {
		'Content-Type': 'application/xml',
		'Cache-Control': 's-maxage=3600'
		}
		}
	);
}