import { EarthGlobeIcon, InfoOutlineIcon, TagsIcon, CalendarIcon, HomeIcon, SchemaIcon, UsersIcon, EditIcon, UserIcon, SparkleIcon, PlayIcon, EnvelopeIcon, FeedbackIcon, ListIcon } from '@sanity/icons'

export const myStructure = (S, context) => {
	const entities = [
		S.divider(),
		S.listItem()
			.title('Homepage')
			.icon(HomeIcon)
			.child(S.document().schemaType('homepage').documentId('homepage')),
		S.documentTypeListItem('story')
			.title('Stories'),
		S.divider(),
		S.listItem()
			.title('Explore')
			.icon(PlayIcon)
			.child(S.document().schemaType('explore').documentId('explore')),
		S.documentTypeListItem('episode')
			.title('Episodes'),
		S.documentTypeListItem('podcast')
			.title('Podcasts'),
		S.documentTypeListItem('video')
			.title('Videos'),
		S.documentTypeListItem('playlist')
			.title('Playlists'),
		S.divider(),
		S.listItem()
			.title('Live')
			.icon(CalendarIcon)
			.child(S.document().schemaType('live').documentId('live')),
		S.documentTypeListItem('event')
			.title('Events'),
		S.documentTypeListItem('eventSerie')
			.title('Event Series'),
		S.documentTypeListItem('eventLive')
			.title('Event Lives'),
		S.divider(),
		S.listItem()
			.title('People')
			.icon(UsersIcon)
			.child(
			S.list()
				.title('People')
				.items([
				S.listItem()
				.title('Authors (all)')
				.icon(EditIcon)
				.child(
					S.documentList()
					.title('Authors')
					.filter('_type == "person" && isAuthor == true')
				),
				S.listItem()
				.title('Authors (with content)')
				.icon(EditIcon)
				.child(
					S.documentList()
					.title('Authors')
					.filter(
						`_type == "person" && isAuthor == true &&
						count(*[
						_type in ["video","playlist","episode","podcast"] &&
						references(^._id)
						]) > 0`
					)
				),
				S.listItem()
				.title('Authors (without content)')
				.icon(EditIcon)
				.child(
					S.documentList()
					.title('Authors')
					.filter(
						`_type == "person" && isAuthor == true &&
						count(*[
						_type in ["video","playlist","episode","podcast"] &&
						references(^._id)
						]) == 0`
					)
				),
				S.listItem()
					.title('Team')
					.icon(SparkleIcon)
					.child(
					S.documentList()
						.title('Team')
						.filter('_type == "person" && isTeam == true')
					),
				S.listItem()
					.title('Others')
					.icon(UserIcon)
					.child(
					S.documentList()
						.title('Others')
						.filter('_type == "person" && isAuthor == false && isTeam == false')
					),
				])
			),
		S.documentTypeListItem('organization')
			.title('Organizations'),
		S.documentTypeListItem('topic')
			.icon(TagsIcon)
			.title('Topics'),
		S.documentTypeListItem('format')
			.icon(ListIcon)
			.title('Formats'),
		S.documentTypeListItem('city')
			.title('Cities'),
		S.divider(),
		S.listItem()
			.title('About')
			.icon(FeedbackIcon)
			.child(S.document().schemaType('about').documentId('about')),
		S.divider(),
		S.listItem()
			.title('Network')
			.icon(SchemaIcon)
			.child(S.document().schemaType('network').documentId('network')),
		S.divider(),
		S.listItem()
			.title('Contact')
			.icon(EnvelopeIcon)
			.child(S.document().schemaType('contact').documentId('contact')),
	];
	const siteSettings = [
		S.divider(),
		S.listItem()
			.title('Info')
			.icon(InfoOutlineIcon)
			.child(S.document().schemaType('info').documentId('info')),
		S.listItem()
			.title('SEO')
			.icon(EarthGlobeIcon)
			.child(S.document().schemaType('seo').documentId('seo')),
		S.documentTypeListItem('policy')
			.title('Policies'),
	];

	return S.list()
		.title('Content')
		.items([
			...entities,
			...siteSettings,
		]);
};