import axios from 'axios'
import { message } from 'antd'

const PATH_BASE = 'https://npm-registry-proxy.glitch.me'
const PATH_SEARCH = '/search'
const PATH_SUGGESTION = '/suggestions'
const PATH_LATEST = '/latest'
const PARAM_SEARCH = 'q='

const SEARCH_URL = `${PATH_BASE}${PATH_SEARCH}`
const SUGGESTION_URL = `${SEARCH_URL}${PATH_SUGGESTION}?${PARAM_SEARCH}`

function handleData(res) {
  let subDependencies = {}

  res.forEach(rs => {
    const {
      data: { dependencies },
    } = rs

    if (dependencies) {
      subDependencies = { ...subDependencies, ...dependencies }
    }
  })

  return subDependencies
}

function handleError(error) {
  const {
    response: { status, data },
  } = error

  if (status === 404) {
    message.error(data, 3)
  }

  return false
}

export async function searchPackage(term) {
  return await axios
    .get(`${PATH_BASE}/${term}${PATH_LATEST}`)
    .then(res => res.data)
    .then(await getDependencies)
    .catch(handleError)
}
export async function getSuggestion(term) {
  return await axios
    .get(`${SUGGESTION_URL}${term}`)
    .then(res => res.data)
    .catch(handleError)
}

async function createPromise(dependency) {
  return await axios
    .get(`${PATH_BASE}/${dependency}${PATH_LATEST}`)
    .catch(error => {
      return error.response
    })
}

async function getDependencies(data) {
  const { dependencies } = data

  if (dependencies) {
    return { ...dependencies, ...(await getSubDependencies(dependencies)) }
  }
  return null
}

async function getSubDependencies(dependencies) {
  const promises = []

  Object.keys(dependencies).forEach(d => {
    promises.push(createPromise(d))
  })

  return await Promise.all(promises)
    .then(handleData)
    .catch(error => {
      console.log('promise all', { error })
    })
}
