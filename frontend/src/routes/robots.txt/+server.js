export async function GET() {
	return new Response(
`User-agent: *
Disallow: /cgi-bin/
Disallow: /*?

Sitemap: https://www.framecultura.it/sitemap.xml
`,
		{
			headers: {
				'Content-Type': 'text/plain; charset=utf-8',
			},
		}
	);
}