import body from './fields/body.js'
import seoFields from './fields/seoFields.js'
import {VideoIcon} from '@sanity/icons';

export default {
	name: 'video',
	type: 'document',
	icon: VideoIcon,
	groups: [
		{name: 'Basics'},
		{name: 'Who'},
		{name: 'Preview'},
		{name: 'Related'},
		{name: 'SEO'},
	],
	fieldsets: [
		{name: 'youtube'},
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
			name: 'date',
			description: "When two productions have the same hierarchy, the one with the most recent date is displayed first in 'Esplora' page",
			type: 'date',
			group: 'Basics',
		},
		{
			name: 'cover',
			description: 'Aspect ratio 16:9',
			type: 'image',
			group: 'Basics',
		},
		{
			name: 'youtubeVideoCode',
			title: 'Video Code',
			type: 'string',
			fieldset: 'youtube',
			validation: (Rule) =>
				Rule.custom((val, context) => {
				const { externalLink } = context.document
				if (!val && !externalLink) {
					return 'Either a YouTube Video Code or an External Link is required'
				}
				return true
			}),
			group: 'Basics',
		},
		{
			name: 'youtubePlaylistCode',
			title: 'Playlist Code',
			description: "Required to display the video as part of a Youtube playlist, when loaded in 'Single Video' page",
			type: 'string',
			fieldset: 'youtube',
			group: 'Basics',
		},
		{
			name: 'externalLinkLabel',
			type: 'string',
			fieldset: 'youtube',
			group: 'Basics',
		},
		{
			name: 'externalLink',
			type: 'url',
			fieldset: 'youtube',
			validation: (Rule) =>
				Rule.custom((val, context) => {
				const { youtubeVideoCode } = context.document
				if (!val && !youtubeVideoCode) {
					return 'Either an External Link or a YouTube Video Code is required'
				}
				return true
			}),
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
			validation: (Rule) => Rule.required(),
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
			validation: (Rule) => Rule.required(),
			group: 'Preview',
		},
		{
			name: 'highlightCover',
			description: "Aspect ratio 21:9. To be used if the video is selected in 'Esplora' page",
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
		...seoFields()
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'subtitle',
			media: 'cover',
		},
	},
}