import {DownloadIcon, StopIcon, BlockElementIcon} from '@sanity/icons'

export default function body({ group = undefined } = {}) {
	return {
		name: 'body',
		type: 'array',
		group,
		of: [
			{
				type: 'block',
				styles: [
					{ value: 'h2', title: 'H2' },
					{ value: 'h3', title: 'H3' },
					{ value: 'h4', title: 'Big' },
					{ value: 'normal', title: 'Normal' },
				],
				lists: [
					{title: 'Bullet', value: 'bullet'}
				],
				marks: {
					decorators: [
						{title: 'Bold', value: 'strong'},
						{title: 'Italic', value: 'em'},
					],
					annotations: [
						{
							name: 'link',
							type: 'object',
							fields: [
							{
								name: 'url',
								type: 'string',
								validation: Rule =>
								Rule.custom(href => {
									if (!href) return true;
									return /^(https?:\/\/|mailto:|tel:)/.test(href)
									? true
									: 'Must be a valid URL, mailto:, or tel: link';
								}),
							},
							{
								title: 'Open in new tab',
								name: 'blank',
								type: 'boolean',
							},
							],
						},
					],
				},
			},
			{
				name: 'download',
				type: 'object',
				icon: DownloadIcon,
				fields: [
				{
					name: 'title',
					type: 'string',
				},
				{
					name: 'file',
					type: 'file',
				},
				{
					name: 'externalLink',
					type: 'url',
				},
				],
			},
			{
				type: 'object',
				name: 'accordionTitle',
				icon: BlockElementIcon,
				fields: [
					{
						name: 'title',
						type: 'string',
						validation: (Rule) => Rule.required(),
					},
				]
			},
			{
				type: 'object',
				name: 'accordionEnd',
				icon: StopIcon,
				fields: [
					{
					name: 'placeholder',
					title: 'Placeholder',
					type: 'string',
					hidden: true,
					initialValue: '',
					}
				],
				preview: {
					prepare() {
						return {
							title: 'Accordion end',
							subtitle: 'Closes all accordion sections',
							media: StopIcon,
						}
					},
				},
			},
		]
	}
}