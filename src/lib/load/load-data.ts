import {createItem, createItems, deleteItems, updateItem, updateItems, updateSingleton} from '@directus/sdk'
import {ux} from '@oclif/core'
import path from 'node:path'

import {api} from '../sdk'
import logError from '../utils/log-error'
import readFile from '../utils/read-file'

export default async function loadData(dir:string) {
  const collections = readFile('collections', dir)
  ux.action.start(`Loading data for ${collections.length} collections`)

  await emptyTables(dir)
  await loadSkeletonRecords(dir)
  await loadFullData(dir)
  await loadSingletons(dir)

  ux.action.stop()
  ux.log('Loaded data.')
}

function stop(collection: string) {  
  return false
  if(
    collection === 'languages' ||
    collection === 'content_brands' || 
    collection === 'content_brands_translations' 
  ) return false 
  return true
}

async function emptyTables(dir: string) {
  ux.log('Loading skeleton records')
  const collections = readFile('collections', dir)

  const userCollections = collections
  .filter(item => !item.collection.startsWith('directus_', 0))
  .filter(item => item.schema !== null) // Filter our any "folders"
  .filter(item => !item.meta.singleton) // Filter out any singletons

  // Empty collection
  for (const collection of userCollections) {    
    if(stop(collection.collection)) continue
    ux.log(`Deleting all records in ${collection.collection}`)
    try {
      await api.client.request(deleteItems(collection.collection, {
        limit: -1,
      }))
    } catch (error) {
      ux.error(error.message)
    }
  }

  ux.log('Deleted all records in user collections')
}

async function loadSkeletonRecords(dir: string) {
  
  ux.log('Loading skeleton records')
  const collections = readFile('collections', dir)

  const primaryKeyMap = await getCollectionPrimaryKeys(dir)

  const userCollections = collections
  .filter(item => !item.collection.startsWith('directus_', 0))
  .filter(item => item.schema !== null) // Filter our any "folders"
  .filter(item => !item.meta.singleton) // Filter out any singletons

  for (const collection of userCollections) {
    if(stop(collection.collection)) continue

    ux.log(`Loading skeleton records for ${collection.collection}`)
    const name = collection.collection
    const primaryKeyField = getPrimaryKey(primaryKeyMap, name)
    
    const sourceDir = path.resolve(
      dir,
      'content',
    )

    const data = readFile(name, sourceDir)
    
    for (const entry of data) {
      try {
        await api.client.request(createItem(name, {
          [primaryKeyField]: entry[primaryKeyField],
        }))
      } catch (error) {
        logError(error)
      }
    }
  }

  ux.log('Loaded skeleton records')
}

async function loadFullData(dir:string) {
  ux.log('Updating records with full data')

  const collections = readFile('collections', dir)

  const primaryKeyMap = await getCollectionPrimaryKeys(dir)

  let userCollections = collections
  .filter(item => !item.collection.startsWith('directus_', 0))
  .filter(item => item.schema !== null) // Filter our any "folders"
  .filter(item => !item.meta.singleton) // Filter out any singletons

  for (const collection of userCollections) {
    if(stop(collection.collection)) continue
    ux.log(`Updating records for ${collection.collection}`)
    const name = collection.collection
    const primaryKeyField = getPrimaryKey(primaryKeyMap, name)
    const sourceDir = path.resolve(
      dir,
      'content',
    )

    const data = readFile(name, sourceDir)

    
    const fields = readFile('fields', dir)
    collection.fields = fields.filter(
      (field: any) => field.collection === collection.collection,
    )
    // Get the fields that are type alias
    const aliasFields = collection.fields.filter(
      (field: any) => field.type === 'alias',
    )
    
    // Go trough data object and remove alias fields
    const processedData = data.map((row: any) => {
      for (const field of aliasFields) {
        delete row[field.field]
      }
      return row
    })

    try {
      for (const row of processedData) {
        delete row.user_created
        delete row.user_updated
        await api.client.request(updateItem(name, row[primaryKeyField], row))
      }
    } catch (error) {
      // logError(error)
    }
  }

  ux.log('Updated records with full data')
}

async function loadSingletons(dir:string) {
  ux.log('Loading data for singleton collections')
  const collections = readFile('collections', dir)

  const singletonCollections = collections
  .filter(item => !item.collection.startsWith('directus_', 0))
  .filter(
    item => item.meta.singleton,
  )

  for (const collection of  singletonCollections) {
    ux.log(`Loading Singelton data for ${collection.collection}`)
    const name = collection.collection
    const sourceDir = path.resolve(
      dir,
      'content',
    )

    const data = readFile(name, sourceDir)

    try {
      // @ts-ignore
      delete data.user_created
      // @ts-ignore
      delete data.user_updated
      await api.client.request(updateSingleton(name, data))
    } catch (error) {
      logError(error)
    }
  }

  ux.log('Loaded data for singleton collections')
}

async function getCollectionPrimaryKeys(dir: string) {
  const fields = readFile('fields', dir)

  const primaryKeys = {}

  for (const field of fields) {
    if (field.schema && field.schema?.is_primary_key) {
      primaryKeys[field.collection] = field.field
    }
  }

  return primaryKeys
}

function getPrimaryKey(collectionsMap: any, collection: string) {
  if (!collectionsMap[collection]) {
    throw new Error(
      `Collection ${collection} not found in collections map`,
    )
  }

  return collectionsMap[collection]
}
