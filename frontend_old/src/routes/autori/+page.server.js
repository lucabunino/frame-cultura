import { getAuthors } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load({ url }) {
	const searchString = url.searchParams.get('search');
	const authors = await getAuthors(searchString);
	
	// Group authors by initial
	const grouped = new Map();

	for (const author of authors) {
		let key;
		if (author.surname) {
			key = author.surname.trim()[0].toUpperCase();
		} else if (author.alias) {
			key = '#';
		} else {
			continue; // skip if no surname or alias
		}

		if (!grouped.has(key)) grouped.set(key, []);
		grouped.get(key).push(author);
	}

	// Convert to array for ordered iteration
	const groupedAuthors = Array.from(grouped.entries())
		.sort(([a], [b]) => {
			if (a === '#') return 1; // put aliases at the end
			if (b === '#') return -1;
			return a.localeCompare(b);
		})
		.map(([letter, authors]) => ({ letter, authors }));

	if (groupedAuthors) {
	return {
			groupedAuthors
		};
	}
	throw error(404, 'Not found');
}