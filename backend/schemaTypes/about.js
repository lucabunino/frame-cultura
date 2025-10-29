import colorOptions from './fields/colorOptions.js'
import { UserIcon, UsersIcon, VersionsIcon, NumberIcon, HashIcon } from '@sanity/icons'

export default {
	name: 'about',
	type: 'document',
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
			name: 'body',
			title: 'Body',
			type: 'array',
			of: [
				{
					type: 'block',
					styles: [
						{ value: 'normal', title: 'Normal' },
					],
					lists: [{ title: 'Bullet', value: 'bullet' }],
					marks: {
						decorators: [
						{ title: 'Bold', value: 'strong' },
						{ title: 'Italic', value: 'em' },
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
					type: 'object',
					name: 'anchor',
					title: 'Anchor',
					icon: HashIcon,
					fields: [
						{
							name: 'title',
							type: 'string',
							validation: (Rule) => Rule.required(),
						},
						{
							name: 'slug',
							type: 'slug',
							validation: (Rule) => Rule.required(),
							options: {
								maxLength: 96,
							},
						},
						{
							name: 'visible',
							type: 'boolean',
							validation: (Rule) => Rule.required(),
						},
						{
							name: 'activeColor',
							type: 'color',
							options: colorOptions,
							validation: (Rule) => Rule.required(),
						},
					]
				},

				// Person (1x)
				{
					type: 'reference',
					name: 'person1',
					title: 'Person (1x)',
					icon: UserIcon,
					to: [{ type: 'person' }],
					options: {
						filter: 'isTeam == true'
					}
				},

				// Person (3x)
				{
					type: 'reference',
					name: 'person3',
					title: 'Person (3x)',
					icon: UsersIcon,
					to: [{ type: 'person' }],
					options: {
						filter: 'isTeam == true'
					}
				},

				// Boxed Text
				{
					type: 'object',
					name: 'boxedText',
					icon: VersionsIcon,
					fields: [
						{ name: 'title', type: 'string', validation: (Rule) => Rule.required(), },
						{ name: 'abstract', type: 'text', rows: 6, },
						{ name: 'ctaLabel', type: 'string' },
						{ name: 'ctaLink', type: 'string' },
						{
							name: 'activeColor',
							type: 'color',
							options: colorOptions,
							validation: (Rule) => Rule.required(),
						},
					]
				},

				// Number
				{
					type: 'object',
					name: 'stat',
					icon: NumberIcon,
					fields: [
						{
							name: 'number',
							type: 'number',
							validation: (Rule) => Rule.required(),
						},
						{
							name: 'numberColor',
							type: 'color',
							options: colorOptions,
							validation: (Rule) => Rule.required(),
						},
						{
							name: 'title',
							type: 'string',
							validation: (Rule) => Rule.required(),
						}
					],
					preview: {
						select: {
							number: 'number',
							title: 'title'
						},
						prepare({ number, title }) {
							return {
								title: `${number ?? '–'} ${title ?? ''}`.trim()
							}
						}
					}
				},
			]
		}
	],
};