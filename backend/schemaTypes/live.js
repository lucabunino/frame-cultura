import { CalendarIcon } from '@sanity/icons';


export default {
	name: 'live',
	type: 'document',
	icon: CalendarIcon,
	fields: [
		{
			name: 'title',
			type: 'string',
			hidden: true,
		},
		{
			name: 'liveIntro',
			type: 'text',
			rows: 2,
		},
		{
			name: 'liveSelection',
			title: 'Selection',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{type: 'event'},{type: 'eventSerie'}],
				}
			],
		},
		{
			name: 'liveWidget',
			type: 'reference',
			to: [{ type: 'eventLive' }],
		},
	],
};