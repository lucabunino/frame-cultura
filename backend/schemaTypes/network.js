import colorOptions from './fields/colorOptions.js'
import { SchemaIcon } from '@sanity/icons';

export default {
	name: 'network',
	type: 'document',
	icon: SchemaIcon,
	fields: [
		{
			name: 'title',
			type: 'string',
			hidden: true,
		},
		{
			name: 'introduction',
			type: 'text',
			rows: 3,
		},
		{
			name: 'network',
			type: 'array',
			of: [
				{
					type: 'object',
					icon: SchemaIcon,
					fields: [
						{
							name: 'title',
							type: 'string',
						},
						{
							name: 'slug',
							type: 'slug',
						},
						{
							name: 'organizations',
							type: 'array',
							of: [
								{
									type: 'reference',
									to: [{ type: 'organization' }],
								},
							],
						},
						{
							name: 'activeColor',
							type: 'color',
							options: colorOptions,
							validation: (Rule) => Rule.required(),
						},
						
					]
				},
			],
		},
	],
};