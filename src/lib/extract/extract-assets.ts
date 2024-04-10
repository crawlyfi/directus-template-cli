import {readAssetRaw,  readFiles} from '@directus/sdk'
import {ux} from '@oclif/core'
import fs from 'node:fs'
import path from 'node:path'
import {pipeline} from 'node:stream/promises'

import {api} from '../sdk'

export async function getAssetList() {
  let response

  if(process.env.SKIP_ASSET_FOLDERS) {
    response = await api.client.request(readFiles({
      filter: {
        folder: {
          name: {
            _nin: process.env.SKIP_ASSET_FOLDERS.split(',')
          }
        }
      },
      limit: -1
    }))
    ux.log('Skipped extracting files form folders: ' + process.env.SKIP_ASSET_FOLDERS)
  } else {
    response = await api.client.request(readFiles({limit: -1}))
  }
  return response
}

export async function downloadFile(file: any, dir: string) {
  // Returned as ReadableStream<Uint8Array>
  const response = await api.client.request(readAssetRaw(file.id))

  // Write the file to disk
  const fullPath = path.join(dir, 'assets', file.filename_disk)

  await pipeline(
    // @ts-ignore
    response,
    fs.createWriteStream(fullPath),
  )
}

export async function downloadAllFiles(dir: string) {
  // Create assets folder if it doesn't exist
  const fullPath = path.join(dir, 'assets')
  if (path && !fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, {recursive: true})
  }

  // Get the list of files
  let fileList = await getAssetList()

  // Download all files
  await Promise.all(fileList.map(file => downloadFile(file, dir).catch(error => {
    ux.warn(`Error downloading ${file.filename_disk}`)
    ux.warn(error.message)
  })))

  // Log message after all files have been downloaded
  ux.log('All files have been downloaded.')
}
