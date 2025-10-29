export default function seoFields() {
	return [{
			name: 'SEOHidden',
			description: 'Set to true to hide the page from search indexes',
			type: 'boolean',
			initialValue: false,
			group: 'SEO',
		},
		{
			name: 'SEODescription',
			description: 'Optional. To be used as preview text of the page',
			type: 'text',
			rows: 5,
			group: 'SEO',
		},
		{
			name: 'SEOImage',
			description: 'Optional. To be used as preview image of the page. Suggested dimension is 1200x630px',
			type: 'image',
			group: 'SEO',
		}]
}