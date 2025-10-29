import body from './fields/body.js'
import seoFields from './fields/seoFields.js'
import {SquareIcon} from '@sanity/icons';

export default {
	name: 'episode',
	type: 'document',
	icon: SquareIcon,
	groups: [
		{name: 'Basics'},
		{name: 'Who'},
		{name: 'Preview'},
		{name: 'Related'},
		{name: 'SEO'},
	],
	fields: [
		{
			name: 'title',
			type: 'string',
			group: 'Basics',
		},
		{
			name: 'subtitle',
			type: 'string',
			group: 'Basics',
		},
		{
			name: 'slug',
			type: 'slug',
			validation: (Rule) => Rule.required(),
			options: {
				source: 'title',
				maxLength: 96,
			},
			group: 'Basics',
		},
		{
			name: 'number',
			type: 'number',
			group: 'Basics',
		},
		{
			name: 'cover',
			description: 'Aspect ratio 1:1',
			type: 'image',
			group: 'Basics',
		},
		{
			name: 'date',
			type: 'date',
			group: 'Basics',
		},
		{
			name: 'link',
			type: 'url',
			validation: (Rule) => Rule.required(),
			group: 'Basics',
		},
		{
			name: 'topics',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{type: 'topic'},],
				}
			],
			group: 'Basics',
		},
		body({ group: 'Basics' }),
		{
			name: 'authors',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{type: 'person'},],
					options: {
						filter: 'isAuthor == true'
					}
				}
			],
			group: 'Who',
		},
		{
			name: 'authorsPreview',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{type: 'person'},],
				}
			],
			group: 'Who',
		},
		{
			name: 'visible',
			title: "Visible in 'Esplora' page",
			type: 'boolean',
			initialValue: false,
			group: 'Preview',
		},
		{
			name: 'visibleAuthor',
			title: "Visible in 'Author' page",
			type: 'boolean',
			initialValue: false,
			group: 'Preview',
		},
		{
			name: 'hierarchy',
			description: "Higher number means it will be displayed higher in 'Esplora' page",
			type: 'number',
			initialValue: 1,
			group: 'Preview',
		},
		{
			name: 'highlightCover',
			description: "Aspect ratio 21:9. To be used if the podcast is selected in 'Esplora' page",
			type: 'image',
			group: 'Preview',
		},
		{
			name: 'highlightCoverMobile',
			description: "Aspect ratio 1:1. Optional — can be used instead of the Highlight Cover on mobile devices",
			type: 'image',
			group: 'Preview',
		},
		{
			name: 'highlightAbstract',
			type: 'text',
			rows: 5,
			group: 'Preview',
		},
		{
			name: 'related',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{type: 'event'},{type: 'eventSerie'},{type: 'video'},{type: 'playlist'},{type: 'episode'},{type: 'podcast'}],
				}
			],
			group: 'Related',
		},
		...seoFields(),
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'subtitle',
			media: 'cover',
		},
	},
}