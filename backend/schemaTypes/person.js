import seoFields from './fields/seoFields.js'
import { UserIcon } from '@sanity/icons'

export default {
	name: 'person',
	type: 'document',
	icon: UserIcon,
	fieldsets: [
		{name: 'author'},
		{name: 'team'},
	],
	groups: [
		{name: 'author'},
		{name: 'team'},
		{name: 'SEO'},
	],
	fields: [
		{
			name: 'name',
			type: 'string',
		},
		{
			name: 'surname',
			type: 'string',
		},
		{
			name: 'alias',
			type: 'string',
		},
		{
			name: 'slug',
			type: 'slug',
			validation: (Rule) => Rule.required(),
			options: {
				source: (doc) => `${doc.name}-${doc.surname}`,
				maxLength: 96,
			},
		},
		{
			name: 'portrait',
			type: 'image',
		},
		{
			name: 'isAuthor',
			type: 'boolean',
			initialValue: true,
			validation: (Rule) => Rule.required(),
			fieldset: 'author',
			group: 'author',
		},
		{
			name: 'occupation',
			type: 'string',
			hidden: ({ parent }) => parent?.isAuthor !== true,
			fieldset: 'author',
			group: 'author',
		},
		{
			name: 'bio',
			description: "The 'body' field is temporarily replaced due to a legacy import. Use 'body' to apply styling and links.",
			type: 'text',
			hidden: ({ parent }) => parent?.isAuthor !== true,
			fieldset: 'author',
			group: 'author',
		},
		{
			name: 'authorBody',
			title: 'Body',
			type: 'array',
			of: [
				{
					type: 'block',
					styles: [
						{ value: 'normal', title: 'Normal' },
						{ value: 'h3', title: 'Title' },
					],
					lists: [
						{title: 'Bullet', value: 'bullet'}
					],
					marks: {
						decorators: [
							{title: 'Bold', value: 'strong'},
							{title: 'Italic', value: 'em'},
						],
						annotations: [
						{
							name: 'link',
							type: 'object',
							fields: [
							{
								name: 'url',
								type: 'string',
								validation: Rule =>
								Rule.custom(href => {
									if (!href) return true;
									return /^(https?:\/\/|mailto:|tel:)/.test(href)
									? true
									: 'Must be a valid URL, mailto:, or tel: link';
								}),
							},
							{
								title: 'Open in new tab',
								name: 'blank',
								type: 'boolean',
							},
							],
						},
						],
					},
				},
			],
			hidden: ({ parent }) => parent?.isAuthor !== true,
			fieldset: 'author',
			group: 'author',
		},
		{
			name: 'highlight',
			description: 'In homepage, if author is selected',
			type: 'text',
			rows: 4,
			hidden: ({ parent }) => parent?.isAuthor !== true,
			fieldset: 'author',
			group: 'author',
		},
		{
			name: 'highlightedContents',
			description: 'In homepage, if author is selected',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [
						{type: 'video'},
						{type: 'playlist'},
						{type: 'episode'},
						{type: 'podcast'},
					],
				}
			],
			hidden: ({ parent }) => parent?.isAuthor !== true,
			fieldset: 'author',
			group: 'author',
		},
		{
			name: 'isTeam',
			type: 'boolean',
			initialValue: false,
			validation: (Rule) => Rule.required(),
			fieldset: 'team',
			group: 'team',
		},
		{
			name: 'role',
			type: 'string',
			hidden: ({ parent }) => parent?.isTeam !== true,
			fieldset: 'team',
			group: 'team',
		},
		{
			name: 'abstract',
			type: 'text',
			rows: 6,
			hidden: ({ parent }) => parent?.isTeam !== true,
			fieldset: 'team',
			group: 'team',
		},
		{
			name: 'teamBody',
			title: 'Body',
			type: 'array',
			of: [
				{
					type: 'block',
					styles: [
						{ value: 'normal', title: 'Normal' },
						{ value: 'h3', title: 'Title' },
					],
					lists: [
						{title: 'Bullet', value: 'bullet'}
					],
					marks: {
						decorators: [
							{title: 'Bold', value: 'strong'},
							{title: 'Italic', value: 'em'},
						],
						annotations: [
						{
							name: 'link',
							type: 'object',
							fields: [
							{
								name: 'url',
								type: 'string',
								validation: Rule =>
								Rule.custom(href => {
									if (!href) return true;
									return /^(https?:\/\/|mailto:|tel:)/.test(href)
									? true
									: 'Must be a valid URL, mailto:, or tel: link';
								}),
							},
							{
								title: 'Open in new tab',
								name: 'blank',
								type: 'boolean',
							},
							],
						},
						],
					},
				},
			],
			hidden: ({ parent }) => parent?.isTeam !== true,
			fieldset: 'team',
			group: 'team',
		},
		...seoFields(),
	],
	orderings: [
		{
			title: 'Surname',
			name: 'surnameAsc',
			by: [
				{ field: 'surname', direction: 'asc' },
			],
		},
		{
			title: 'Name',
			name: 'nameAsc',
			by: [
				{ field: 'name', direction: 'asc' },
			],
		},
	],
	preview: {
		select: {
			name: 'name',
			surname: 'surname',
			alias: 'alias',
			media: 'portrait',
		},
		prepare(selection) {
			const {name, surname, alias, media} = selection;
			return {
				title: `${name ? name : ``} ${surname ? surname : ``} ${alias ? `(${alias})` : ``}`,
				media: media
			};
		}
	}
};