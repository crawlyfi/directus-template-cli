import {readMe} from '@directus/sdk'
import {ux} from '@oclif/core'

import {api} from '../sdk'
import validateUrl from './validate-url'

export async function getDirectusUrl() {
  let directusUrl
  if (process.env.DIRECTUS_URL) {
    directusUrl = process.env.DIRECTUS_URL
  } else {
    directusUrl = await ux.prompt('What is your Directus URL?', {default: 'http://localhost:8055' })
  }

  // Validate URL
  if (!validateUrl(directusUrl)) {
    ux.warn('Invalid URL')
    return getDirectusUrl()
  }

  api.initialize(directusUrl)

  return directusUrl
}

export async function getDirectusToken(directusUrl: string, directusToken?: string) {
  if (!directusToken) {
    directusToken = await ux.prompt('What is your Directus Admin Token?')
  } 
  // Validate token
  try {
    api.setAuthToken(directusToken)
    const response = await api.client.request(readMe())
    ux.log(`Logged in as ${response.first_name} ${response.last_name}`)
    return directusToken
  } catch (error) {
    console.log(error)
    ux.warn('Invalid token. Please try again.')
    return getDirectusToken(directusUrl)
  }
}
