import {CaseIcon} from '@sanity/icons'
import RelatedContentInput from './components/RelatedContentInput'

export default {
name: 'organization',
type: 'document',
icon: CaseIcon,
fields: [
	{
		name: 'title',
		type: 'string',
	},
	{
		name: 'displayTitle',
		type: 'boolean',
		initialValue: 'true',
	},
	{
		name: 'link',
		type: 'url',
	},
	{
		name: 'logo',
		type: 'image',
		validation: (Rule) => Rule.required(),
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