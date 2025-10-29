import sanityClient from '@sanity/client'

const client = sanityClient({
  projectId: '9iecy3ct', // replace with your project ID
  dataset: 'production',     // replace with your dataset
  useCdn: false,
})

async function migrate() {
  const persons = await client.fetch(`*[_type == "person" && defined(body)]{
    _id,
    body
  }`)

  for (const person of persons) {
    if (!person.body) continue

    const newBody = [
      {
        _type: 'block',
        _key: Math.random().toString(36).substr(2, 9),
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: Math.random().toString(36).substr(2, 9),
            text: person.body,
            marks: [],
          },
        ],
      },
    ]

    await client
      .patch(person._id)
      .set({ body: newBody })
      .commit()
      .then(() => console.log(`Updated ${person._id}`))
      .catch((err) => console.error(`Failed ${person._id}`, err))
  }

  console.log('Migration complete!')
}

migrate()
