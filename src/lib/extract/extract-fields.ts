import { readFields } from '@directus/sdk'
import { ux } from '@oclif/core'

import { api } from '../sdk'
import writeToFile from '../utils/write-to-file'

/**
 * Extract fields from the Directus instance
 */

export default async function extractFields(dir: string) {
  try {
    const response = await api.client.request(readFields())

    const fields = response
      .filter(
        (i: any) => {
          if (i.meta && !i.meta.system) return true
          return false
        },
      )
      .map(i => {
        delete i.meta.id
        return i
      })

    await writeToFile('fields', fields, dir)
    ux.log('Extracted fields')
  } catch (error) {
    ux.error(error.message)
  }
}
