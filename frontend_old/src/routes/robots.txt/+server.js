export async function GET() {
	return new Response(
`User-agent: *
Disallow: /cgi-bin/
`,
		{
			headers: {
				'Content-Type': 'text/plain; charset=utf-8',
			},
		}
	);
}