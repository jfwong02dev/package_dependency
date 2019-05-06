import axios from 'axios'

const PATH_BASE = 'https://npm-registry-proxy.glitch.me'
const PATH_SEARCH = '/search'
const PATH_SUGGESTION = '/suggestions'
const PATH_LATEST = '/latest'
const PARAM_SEARCH = 'q='

const SEARCH_URL = `${PATH_BASE}${PATH_SEARCH}`
const SUGGESTION_URL = `${SEARCH_URL}${PATH_SUGGESTION}?${PARAM_SEARCH}`

export async function searchPackage(term) {
  return get(`${PATH_BASE}/${term}${PATH_LATEST}`)
}
export async function getSuggestion(term) {
  return await get(`${SUGGESTION_URL}${term}`)
}

function createPromise(dependency) {
  return axios.get(`${PATH_BASE}/${dependency}${PATH_LATEST}`)
}

async function get(url = '') {
  return axios
    .get(url)
    .then(res => res.data)
    .then(await getDependencies)
    .catch(error => {
      const { response, name } = error

      if (response) {
        const {
          data: { error },
        } = response

        console.log(`${name}: ${error}`)
      }
    })
}

async function getDependencies(data) {
  const { dependencies } = data

  console.log('get', dependencies)

  if (dependencies) {
    return { ...dependencies, ...(await getSubDependencies(dependencies)) }
  }
  return null
}

async function getSubDependencies(dependencies) {
  const promises = []
  let subDependencies = {}

  Object.keys(dependencies).forEach(d => {
    promises.push(createPromise(d))
  })

  await Promise.all(promises).then(res => {
    res.forEach(rs => {
      const {
        data: { dependencies },
      } = rs

      if (dependencies) {
        subDependencies = { ...subDependencies, ...dependencies }
      }
    })
  })

  return subDependencies
}
