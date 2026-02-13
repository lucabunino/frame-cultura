import colorOptions from './fields/colorOptions.js'
import { HomeIcon } from '@sanity/icons';

console.log(colorOptions);


export default {
	name: 'homepage',
	type: 'document',
	icon: HomeIcon,
	fieldsets: [
		{name: 'hero'},
		{name: 'live'},
		{name: 'productions'},
		{name: 'authors'},
	],
	fields: [
		{
			name: 'title',
			type: 'string',
			hidden: true,
		},
		{
			name: 'intro1',
			type: 'text',
			rows: 3,
			fieldset: 'hero',
			validation: (Rule) => Rule.required(),
		},
		{
			name: 'intro2',
			rows: 3,
			type: 'text',
			fieldset: 'hero',
			validation: (Rule) => Rule.required(),
		},
		{
			name: 'highlights',
			type: 'array',
			of: [
				{
					name: 'highlight',
					type: 'object',
					fields: [
						{
							name: 'subtitle',
							type: 'string',
						},
						{
							name: 'title',
							type: 'string',
						},
						{
							name: 'abstract',
							type: 'text',
							rows: 4,
						},
						{
							name: 'ctaLabel',
							type: 'string',
						},
						{
							name: 'ctaReference',
							description: 'Link to a content inside framecultura.it',
							type: 'reference',
							to: [{ type: 'podcast' }, { type: 'video' }, { type: 'playlist' }, { type: 'event' }, { type: 'eventSerie' }],
						},
						{
							name: 'ctaLink',
							description: 'Link to an external website',
							type: 'url',
						},
						{
							name: 'backgroundColor',
							type: 'color',
							options: colorOptions
						},
						{
							name: 'backgroundImage',
							type: 'image',
						},
						{
							name: 'backgroundImageMobile',
							description: 'Optional — can be used instead of the background image on mobile devices',
							type: 'image',
						},
					]
				}
			]
		},
		{
			name: 'liveIntro',
			title: 'Intro',
			type: 'text',
			rows: 2,
			fieldset: 'live',
		},
		{
			name: 'liveSelection',
			title: 'Selection',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{type: 'event'},{type: 'eventSerie'},],
				}
			],
			fieldset: 'live',
			validation: Rule => Rule.max(20).warning('You can select up to 20 items only.'),
		},
		{
			name: 'productionsIntro',
			title: 'Intro',
			type: 'text',
			rows: 2,
			fieldset: 'productions',
		},
		{
			name: 'productionsSelection',
			title: 'Selection',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{type: 'episode'}, {type: 'podcast'}, {type: 'video'}, {type: 'playlist'},],
				}
			],
			fieldset: 'productions',
			validation: Rule => Rule.max(10).warning('You can select up to 10 items only.'),
		},
		{
			name: 'authorsIntro',
			title: 'Intro',
			type: 'text',
			rows: 2,
			fieldset: 'authors',
		},
		{
			name: 'authorsSelection',
			title: 'Selection',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{type: 'person'}],
					options: {
						filter: 'isAuthor == true'
					}
				}
			],
			fieldset: 'authors',
		},
		{
			name: 'preFooter',
			type: 'object',
			fields: [
				{
					name: 'runningHead',
					type: 'string',
				},
				{
					name: 'title',
					type: 'string',
				},
				{
					name: 'subtitle',
					type: 'string',
				},
				{
					name: 'abstract',
					type: 'text',
					rows: 5,
				},
				{
					name: 'ctaLabel',
					type: 'string',
				},
				{
					name: 'ctaReference',
					description: 'Link to a content inside framecultura.it',
					type: 'reference',
					to: [{ type: 'podcast' }, { type: 'video' }, { type: 'playlist' }, { type: 'event' }, { type: 'eventSerie' }, { type: 'story' }],
				},
				{
					name: 'ctaLink',
					description: 'Link to an external website',
					type: 'url',
				},
				{
					name: 'backgroundImage',
					description: 'Aspect ratio 16:9',
					type: 'image',
				},
				{
					name: 'backgroundImageMobile',
					description: 'Aspect ratio 1:1. Optional — can be used instead of the background image on mobile devices',
					type: 'image',
				},
			]
		},
	],
};