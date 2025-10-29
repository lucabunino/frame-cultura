import React, { useEffect, useState } from 'react'
import { useClient, useFormValue } from 'sanity'

export default function RelatedContentInput(props) {
	const client = useClient({ apiVersion: '2025-01-01' })

	// Get the current item's _id
	const docId = useFormValue(['_id'])
	const [items, setItems] = useState([])

	useEffect(() => {
		if (!docId) return
		const cleanId = docId.replace(/^drafts\./, '') // strip "drafts." if present
		const query = `
		*[_type in ["video","playlist","episode","podcast","event","eventSerie"] && references($id)]{
			_id,
			_type,
			title
		} | order(_type asc, title asc)
		`
		client.fetch(query, { id: cleanId }).then(setItems)
	}, [docId, client])

	const getEditUrl = (item) => {
		// Keep "drafts." prefix if the document exists in draft form
		return `/desk/${item._type};${item._id}`
	}

	return (
		<div>
		{items.length === 0 ? (
			<p style={{ fontStyle: 'italic', color: '#666' }}>
			No content currently references this item.
			</p>
		) : (
			<ul>
			{items.map(item => (
				<li key={item._id}>
				<a
					href={getEditUrl(item)}
					target='blank'
					style={{
					textDecoration: 'none',
					color: 'inherit',
					display: 'inline',
					}}
				>
					{item.title || 'Untitled'} <em style={{ fontSize: '0.7em', color: '#666' }}>{item._type}</em>
				</a>
				</li>
			))}
			</ul>
		)}
		</div>
	)
}