export default {
	name: 'explore',
	type: 'document',
	fields: [
		{
			name: 'title',
			type: 'string',
			hidden: true,
		},
		{
			name: 'exploreSelection',
			title: 'Selection',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{type: 'podcast'},{type: 'video'},{type: 'playlist'},],
				}
			],
		},
	],
};