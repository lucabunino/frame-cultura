import { MarkerIcon } from '@sanity/icons'
import RelatedContentInput from './components/RelatedContentInput'

export default {
	name: 'city',
	type: 'document',
	icon: MarkerIcon,
	fields: [
		{
			name: 'title',
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
			name: 'relatedContent',
			title: 'Referenced In',
			type: 'array',
			of: [{ type: 'reference', to: [
				{ type: 'video' },
				{ type: 'playlist' },
				{ type: 'episode' },
				{ type: 'podcast' },
				{ type: 'event' },
				{ type: 'eventSerie' },
			]}],
			components: {
				input: RelatedContentInput
			},
			readOnly: true
		}
	],
};