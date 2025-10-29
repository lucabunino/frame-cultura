import colorOptions from './fields/colorOptions.js'
import { VersionsIcon } from '@sanity/icons'

export default {
	name: 'contact',
	type: 'document',
	fields: [
		{
			name: 'title',
			type: 'string',
			hidden: true,
		},
		{
			name: 'boxedTexts',
			type: 'array',
			of: [
				{
					type: 'object',
					name: 'boxedText',
					icon: VersionsIcon,
					fields: [
						{ name: 'title', type: 'string' },
						{ name: 'abstract', type: 'text', rows: 6, },
						{ name: 'ctaLabel', type: 'string' },
						{ name: 'ctaLink', type: 'string' },
						{
							name: 'activeColor',
							type: 'color',
							options: colorOptions
						},
					]
				},
			]
		}
	],
};