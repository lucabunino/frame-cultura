import body from './fields/body.js'
import colorOptions from './fields/colorOptions.js';
import seoFields from './fields/seoFields.js'
import { RemoveIcon, UsersIcon } from '@sanity/icons'

export default {
	name: 'event',
	type: 'document',
	icon: RemoveIcon,
	groups: [
		{name: 'Basics'},
		{name: 'Who'},
		{name: 'Where'},
		{name: 'Access'},
		{name: 'Preview'},
		{name: 'Live'},
		{name: 'Reserve'},
		{name: 'Related'},
		{name: 'SEO'},
	],
	fieldsets: [
		{name: 'CTA'},
		{name: 'Tag'},
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
			name: 'start',
			description: "Set time to '00:00' to only display date",
			type: 'datetime',
			validation: (Rule) => Rule.required(),
			group: 'Basics',
		},
		{
			name: 'end',
			description: "Leave this field empty if you just want 'start'. Set time to '00:00' to only display date",
			type: 'datetime',
			group: 'Basics',
		},
		{
			name: 'format',
			type: 'reference',
			to: [{type: 'format'},],
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
			name: 'people',
			type: 'object',
			fields: [
				{
				name: 'clusters',
				type: 'array',
				of: [
					{
						type: 'object',
						icon: UsersIcon,
						fields: [
							{
								name: 'label',
								type: 'string',
							},
							{
								name: 'people',
								type: 'array',
								of: [
									{
										name: 'person',
										type: 'reference',
										to: [{ type: 'person' }],
									},
								],
							},
						],
						preview: {
							select: {
								label: 'label',
								people0Name: 'people.0.name',
								people0Surname: 'people.0.surname',
								people0Alias: 'people.0.alias',
								people1Name: 'people.1.name',
								people1Surname: 'people.1.surname',
								people1Alias: 'people.1.alias',
								people2Name: 'people.2.name',
								people2Surname: 'people.2.surname',
								people2Alias: 'people.2.alias',
								people3Name: 'people.3.name',
								people3Surname: 'people.3.surname',
								people3Alias: 'people.3.alias',
							},
							prepare(selection) {
								const { label, people0Name, people0Surname, people0Alias, people1Name, people1Surname, people1Alias, people2Name, people2Surname, people2Alias, people3Name, people3Surname, people3Alias } = selection
								const firstPerson = [people0Name, people0Surname].filter(Boolean).join(' ') +
													(people0Alias ? ` (${people0Alias})` : '')
								const secondPerson = [people1Name, people1Surname].filter(Boolean).join(' ') +
													(people1Alias ? ` (${people1Alias})` : '')
								const thirdPerson = [people2Name, people2Surname].filter(Boolean).join(' ') +
													(people2Alias ? ` (${people2Alias})` : '')
								const fourthPerson = [people3Name, people3Surname].filter(Boolean).join(' ') +
													(people3Alias ? ` (${people3Alias})` : '')
								return { title: `${label}: ${firstPerson}${secondPerson ? ', ' + secondPerson : ''}${thirdPerson ? ', ' + thirdPerson : ''}${fourthPerson ? '...' : ''}` }
							},
						}
					},
				],
				},
			],
			group: 'Who',
		},
		{
			name: 'peoplePreview',
			type: 'array',
			of: [
				{
					name: 'person',
					type: 'reference',
					to: [{ type: 'person' }],
				},
			],
			group: 'Who',
		},
		{
			name: 'organizations',
			type: 'object',
			fields: [
				{
				name: 'clusters',
				type: 'array',
				of: [
					{
						type: 'object',
						icon: UsersIcon,
						fields: [
							{
								name: 'label',
								type: 'string',
							},
							{
								name: 'organizations',
								type: 'array',
								of: [
									{
										name: 'organization',
										type: 'reference',
										to: [{ type: 'organization' }],
									},
								],
							},
						],
						preview: {
							select: {
								label: 'label',
								people0Title: 'organizations.0.title',
								people1Title: 'organizations.1.title',
								people2Title: 'organizations.2.title',
								people3Title: 'organizations.3.title',
							},
							prepare(selection) {
								const { label, people0Title, people1Title, people2Title, people3Title } = selection
								return { title: `${label}: ${people0Title}${people1Title ? ', ' + people1Title : ''}${people2Title ? ', ' + people2Title : ''}${people3Title ? '...' : ''}` }
							},
						}
					},
				],
				},
			],
			group: 'Who',
		},
		{
			name: 'location',
			type: 'string',
			group: 'Where',
		},
		{
			name: 'city',
			type: 'reference',
			to: [{type: 'city'},],
			group: 'Where',
		},
		{
			name: 'adress',
			type: 'string',
			group: 'Where',
		},
		{
			name: 'adressLink',
			type: 'string',
			group: 'Where',
		},
		{
			name: 'accessColor',
			title: 'Color',
			type: 'color',
			options: colorOptions,
			group: 'Access',
		},
		{
			name: 'accessCtaDisplay',
			title: 'Display CTA',
			type: 'boolean',
			initialValue: false,
			group: 'Access',
			fieldset: 'CTA',
		},
		{
			name: 'accessCtaLabel',
			title: 'Label',
			type: 'string',
			group: 'Access',
			fieldset: 'CTA',
		},
		{
			name: 'accessCtaLink',
			title: 'Link',
			type: 'url',
			group: 'Access',
			fieldset: 'CTA',
		},
		{
			name: 'accessTagDisplay',
			title: 'Display Tag',
			type: 'boolean',
			initialValue: false,
			group: 'Access',
			fieldset: 'Tag',
		},
		{
			name: 'accessTagLabel',
			title: 'Label',
			type: 'string',
			group: 'Access',
			fieldset: 'Tag',
		},
		{
			name: 'visible',
			title: "Visible in 'Live' page",
			type: 'boolean',
			initialValue: false,
			validation: (Rule) => Rule.required(),
			group: 'Preview',
		},
		{
			name: 'hierarchy',
			description: 'Higher number means it will be displayed higher in Live',
			type: 'number',
			initialValue: 1,
			validation: (Rule) => Rule.required(),
			group: 'Preview',
		},
		{
			name: 'cover',
			description: 'Aspect ratio 5:7',
			type: 'image',
			group: 'Preview',
		},
		{
			name: 'abstract',
			type: 'text',
			rows: 5,
			group: 'Preview',
		},
		{
			name: 'highlightCover',
			description: "Aspect ratio 16:9. To be used if the event is selected in 'Live' page",
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
			name: 'live',
			title: 'Live',
			type: 'reference',
			to: [{ type: 'eventLive' }],
			group: 'Live',
		},
		{
			name: 'production',
			type: 'reference',
			to: [{type: 'video'},{type: 'playlist'}],
			group: 'Live',
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
};