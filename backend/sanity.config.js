import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {myStructure} from './structure.js'
import {colorInput} from '@sanity/color-input'
import {media} from 'sanity-plugin-media'



export default defineConfig({
  name: 'default',
  title: 'Frame Cultura',

  projectId: '9iecy3ct',
  dataset: 'production',

  plugins: [
		structureTool({
			structure: myStructure,
		}),
		media(),
		visionTool(),
		colorInput(),
	],

  schema: {
    types: schemaTypes,
  },
})
