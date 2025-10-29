import { FeedbackIcon, EmptyIcon } from '@sanity/icons'

export default {
	name: 'info',
	type: 'document',
	icon: FeedbackIcon,
	fieldsets: [
		{ name: 'adress' },
	],
	fields: [
		{
			name: 'title',
			type: 'string',
			hidden: true,
		},
		{
			name: 'logo',
			type: 'image',
		},
		{
			name: 'footerPatterns',
			type: 'array',
			of: [
				{
					type: 'image'
				}
			]
		},
		{
			name: 'placeholder',
			description: "To be displayed when no other image is selected",
			type: 'image',
		},
		{
			name: 'ragioneSociale',
			type: 'string',
		},
		{
			name: 'email',
			type: 'string',
		},
		{
			name: 'adressLabel',
			title: 'Label',
			type: 'text',
			rows: 2,
			fieldset: 'adress',
		},
		{
			name: 'adressLink',
			title: 'Link',
			type: 'url',
			fieldset: 'adress',
		},
		{
			name: 'socials',
			type: 'array',
			of: [
				{
					name: 'social',
					type: 'object',
					icon: EmptyIcon,
					options: { columns: 2,},
					fields: [
						{
							name: 'icon',
							type: 'image',
						},
						{
							name: 'link',
							type: 'url'
						},
					],
					preview: {
						select: {
							title: 'link',
							media: 'icon',
						},
					}
				},
			]
		},
		{
			name: 'newsletter',
			type: 'text',
			rows: 4,
		},
		{
			name: 'pIva',
			title: 'P. IVA',
			type: 'string',
		},
		{
			name: 'newsletterLink',
			type: 'url',
		},
	],
};