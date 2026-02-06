import colorOptions from './fields/colorOptions.js';
import seoFields from './fields/seoFields.js'
import {BlockContentIcon, BlockElementIcon, DownloadIcon, DocumentIcon, ImagesIcon, ProjectsIcon, VersionsIcon, BookIcon} from '@sanity/icons'

export default {
	name: 'story',
	type: 'document',
	icon: BlockContentIcon,
	groups: [
		{name: 'Basics'},
		{name: 'Body'},
		{name: 'Table'},
		{name: 'Preview'},
		{name: 'SEO'},
	],
	fields: [
		{
			name: 'runningHead',
			type: 'string',
			group: 'Basics',
		},
		{
			name: 'title',
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
			name: 'intro',
			type: 'text',
			rows: 5,
			group: 'Basics',
		},
		{
			name: 'cover',
			description: 'Aspect ratio 16:9',
			type: 'image',
			group: 'Basics',
		},
		{
			name: 'coverMobile',
			description: 'Optional, replaces cover for mobile devices (used on top, not as background). Aspect ratio 16:9',
			type: 'image',
			group: 'Basics',
		},
		{
			name: 'bodyButtonLabel',
			type: 'string',
			group: 'Basics',
		},
		{
			name: 'tableButtonLabel',
			type: 'string',
			group: 'Basics',
		},
		{
			name: 'body',
			title: 'Body',
			type: 'array',
			group: 'Body',
			of: [
				{
					type: 'block',
					styles: [
						{ value: 'normal', title: 'Normal' },
						{ value: 'h3', title: 'H3' },
					],
					lists: [{ title: 'Bullet', value: 'bullet' }],
					marks: {
						decorators: [
						{ title: 'Bold', value: 'strong' },
						{ title: 'Italic', value: 'em' },
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

				// Slider
				{
					type: 'object',
					name: 'slider',
					icon: ImagesIcon,
					fields: [
						{
							name: 'images',
							type: 'array',
							validation: (Rule) => Rule.required(),
							of: [
								{
									type: 'image',
								}
							],
							options: {
								layout: 'grid'
							}
						},
					],
					preview: {
						select: {
							images: 'images'
						},
						prepare(selection) {
							const { images } = selection;
							const count = images ? images.length : 0;
							return {
								title: 'Slider',
								subtitle: `${count} image${count === 1 ? '' : 's'}`,
								media: images && images.length > 0 ? images[0] : ImagesIcon
							};
						}
					}
				},

				// Grid
				{
					type: 'object',
					name: 'grid',
					icon: ProjectsIcon,
					fields: [
						{
							name: 'items',
							type: 'array',
							validation: (Rule) => Rule.required(),
							of: [
								{
									type: 'object',
									name: 'gridItem',
									fields: [
										{
											name: 'itemType',
											type: 'string',
											options: {
												list: [
													{ title: 'Internal Reference', value: 'internal' },
													{ title: 'File / Download', value: 'file' }
												],
												layout: 'radio'
											},
											initialValue: 'internal'
										},
										{
											name: 'internalReference',
											type: 'reference',
											to: [
												{type: 'event'}, {type: 'eventSerie'}, {type: 'video'}, 
												{type: 'playlist'}, {type: 'episode'}, {type: 'podcast'}
											],
											hidden: ({ parent }) => parent?.itemType !== 'internal'
										},
										{
											name: 'title',
											type: 'string',
											hidden: ({ parent }) => parent?.itemType !== 'file'
										},
										{
											name: 'upload',
											type: 'file',
											hidden: ({ parent }) => parent?.itemType !== 'file'
										},
										{
											name: 'color',
											type: 'color',
											options: colorOptions,
											hidden: ({ parent }) => parent?.itemType !== 'file',
										},
									],
									preview: {
										select: {
											itemType: 'itemType',
											fileTitle: 'title',
											fileName: 'upload.asset.originalFilename',
											refTitle: 'internalReference.title',
											refSubtitle: 'internalReference.runningHead',
											refMedia: 'internalReference.cover'
										},
										prepare(selection) {
											const { itemType, fileTitle, fileName, refTitle, refSubtitle, refMedia } = selection;

											if (itemType === 'file') {
												return {
													title: fileTitle || 'Untitled File',
													subtitle: fileName ? `${fileName}` : 'No file uploaded',
													media: DownloadIcon
												};
											}

											return {
												title: refTitle || 'No reference selected',
												subtitle: refSubtitle || undefined,
												media: refMedia || DocumentIcon
											};
										}
									}
								}
							],
						},
					],
					preview: {
						select: {
							items: 'items'
						},
						prepare(selection) {
							const { items } = selection;
							const count = items ? items.length : 0;
							return {
								title: 'Grid',
								subtitle: `${count} item${count === 1 ? '' : 's'}`,
								media: ProjectsIcon
							};
						}
					}
				},

				// Single
				{
					type: 'object',
					name: 'single',
					icon: BookIcon,
					fields: [
						{
							name: 'title',
							type: 'string',
						},
						{
							name: 'description',
							type: 'text',
							rows: 6,
						},
						{
							name: 'cover',
							type: 'image',
						},
						{
							name: 'ctaLabel',
							type: 'string',
						},
						{
							name: 'fileUpload',
							type: 'file',
						},
						{
							name: 'reference',
							type: 'reference',
							to: [
								{type: 'event'}, {type: 'eventSerie'}, {type: 'video'}, 
								{type: 'playlist'}, {type: 'episode'}, {type: 'podcast'}
							]
						},
						{
							name: 'externalLink',
							type: 'url',
							description: 'Link to an external site'
						}
					],
					preview: {
						select: {
							title: 'title',
							subtitle: 'ctaLabel',
							media: 'cover'
						},
						prepare({title, subtitle, media}) {
							return {
								title: title || 'Single',
								subtitle: subtitle,
								media: media || BookIcon
							}
						}
					}
				},
			]
		},
		{
			name: 'tableTitle',
			type: 'string',
			group: 'Table',
		},
		{
			name: 'tableRows',
			type: 'array',
			group: 'Table',
			of: [
				{
					type: 'object',
					name: 'tableRow',
					fields: [
						{
							name: 'date',
							type: 'date',
							options: { dateFormat: 'DD.MM.YYYY' }
						},
						{
							name: 'title',
							type: 'string',
						},
						{
							name: 'subtitle',
							type: 'string'
						},
						{
							name: 'body',
							type: 'array',
							of: [
								{
									type: 'block',
									styles: [
										{ value: 'normal', title: 'Normal' },
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
							]
						},
						{
							name: 'image',
							type: 'image',
							options: { hotspot: true }
						},
						{
							name: 'internalReference',
							type: 'reference',
							to: [
								{type: 'event'},
								{type: 'eventSerie'},
								{type: 'video'},
								{type: 'playlist'},
								{type: 'episode'},
								{type: 'podcast'}
							],
						},
						{
							name: 'externalLink',
							type: 'url',
							description: 'Link to an external site'
						}
					],
					preview: {
						select: {
							title: 'title',
							refTitle: 'internalReference.title',
							date: 'date',
							media: 'image'
						},
						prepare({title, refTitle, date, media}) {
							return {
								title: title || refTitle || 'Untitled Row',
								subtitle: date || '',
								media: media || BlockElementIcon
							}
						}
					}
				}
			]
		},
		{
			name: 'visibleMenu',
			title: "Visible in 'Menu' page",
			type: 'boolean',
			initialValue: false,
			validation: (Rule) => Rule.required(),
			group: 'Preview',
		},
		...seoFields()
	],
};