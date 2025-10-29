import colorOptions from './fields/colorOptions.js'
import { BoltIcon } from '@sanity/icons'

export default {
	name: 'eventLive',
	type: 'document',
	icon: BoltIcon,
	fields: [
		{
			name: 'title',
			type: 'string',
		},
		{
			name: 'subtitle',
			type: 'string',
		},
		{
			name: 'slug',
			type: 'slug',
			validation: (Rule) => Rule.required(),
			options: {
				source: 'title',
				maxLength: 96,
			},
		},
		{
			name: 'visible',
			type: 'boolean',
			initialValue: false,
			validation: (Rule) => Rule.required(),
		},
		{
			name: 'bgColor',
			type: 'color',
			options: colorOptions,
			validation: (Rule) => Rule.required(),
		},
		{
			name: 'start',
			description: "When will the live start?",
			type: 'datetime',
			validation: (Rule) => Rule.required(),
		},
		{
			name: 'displayStart',
			description: "When to start displaying about the live in single page",
			type: 'datetime',
			validation: (Rule) => Rule.required(),
		},
		{
			name: 'cover',
			description: 'Aspect ratio 16:9',
			type: 'image',
		},
		{
			name: 'embed',
			title: 'Embed',
			type: 'object',
			fields: [
				{
				name: 'provider',
				title: 'Provider',
				type: 'string',
				options: {
					list: ['YouTube', 'Vimeo', 'Facebook'],
				},
				},
				{
				name: 'url',
				title: 'URL',
				type: 'url',
				}
			]
		}

	],
};