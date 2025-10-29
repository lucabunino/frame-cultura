import sanityClient from '@sanity/client'

const client = sanityClient({
  projectId: 'yourProjectId',
  dataset: 'production',
  useCdn: true,
})

export function fileUrl(file) {
  // file.asset._ref format: file-<id>-<ext>
  if (!file?.asset?._ref) return ''
  const [_, id, ext] = file.asset._ref.split('-')
  return `https://cdn.sanity.io/files/${client.config().projectId}/${client.config().dataset}/${id}.${ext}`
}