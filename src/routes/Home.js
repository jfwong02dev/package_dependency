import React, { Component, Fragment } from 'react'
import { getSuggestion, searchPackage } from '../services'
import { Row, Col } from 'antd'
import { getRecent, saveRecent } from '../utils'
import { SearchInput, RecentSearch, List } from '../components'

import './Home.less'

const getLessRecord = list => list.slice(0, 10)

const RecordFoundDescription = num => (
  <span className="record-found-text">{`${
    num ? `${num} dependencies found.` : 'No dependencies found'
  } `}</span>
)

class Home extends Component {
  state = {
    recent: [],
    results: null,
    searchKey: '',
    searchTerm: '',
    fetching: false,
    suggestion: [],
  }

  componentWillMount() {
    const loadState = getRecent()

    if (loadState) {
      this.setState({ recent: loadState })
    }
  }

  updateRecentSearch = searchTerm => {
    const { recent: oldRecent } = this.state
    let updatedRecent = []

    if (!oldRecent.length) {
      updatedRecent = [searchTerm]
    } else {
      let index = oldRecent.indexOf(searchTerm)

      if (!index) {
        return false
      } else if (index === -1) {
        updatedRecent = [searchTerm, ...oldRecent]
      } else {
        updatedRecent = oldRecent.splice(index, 1)
        updatedRecent = [...updatedRecent, ...oldRecent]
      }
    }

    this.setState(
      () => {
        return { recent: updatedRecent }
      },
      () => saveRecent(updatedRecent),
    )
  }

  checkPackageSearchTerm(searchTerm) {
    const { results } = this.state
    return !results || !results[searchTerm]
  }

  handleSearch = value => {
    console.log('here hey')
    console.log({ value })
    this.setState({ searchTerm: value })

    if (this.checkPackageSearchTerm(value)) {
      this.fetchPackage(value)
    } else {
      this.updateRecentSearch(value)
    }
  }

  fetchPackage = async searchKey => {
    this.setState({ fetching: true })

    const result = await searchPackage(searchKey)

    if (result) {
      this.setPackage(result)
    } else if (result == null) {
      this.setNoDependency()
    } else {
      this.setState({ fetching: false })
    }
  }

  setNoDependency = () => {
    this.setState(
      prevState => {
        return {
          results: {
            ...prevState.results,
            [this.state.searchTerm]: {
              packages: [],
              packagesByName: {},
            },
          },
          fetching: false,
        }
      },
      () => this.updateRecentSearch(this.state.searchTerm),
    )
  }

  setPackage = result => {
    this.setState(
      prevState => {
        return {
          results: {
            ...prevState.results,
            [this.state.searchTerm]: {
              packages: Object.keys(result),
              packagesByName: result,
            },
          },
          fetching: false,
        }
      },
      () => this.updateRecentSearch(this.state.searchTerm),
    )
  }

  render() {
    const { results, searchTerm, fetching, recent } = this.state

    const packages =
      results && results[searchTerm] && results[searchTerm].packages

    const plength = packages ? packages.length : 0

    console.log({ plength })

    return (
      <div className="home-wrapper">
        <Row gutter={16}>
          <Col span={12}>
            <SearchInput
              searched={searchTerm}
              isLoading={fetching}
              onSearch={this.handleSearch}
            />

            {packages && (
              <Fragment>
                <RecordFoundDescription num={plength} />
                {plength > 0 && <List list={packages.sort()} />}
              </Fragment>
            )}
          </Col>
          <Col span={12} className="recent-wrapper">
            <RecentSearch
              list={getLessRecord(recent)}
              onSearch={this.handleSearch}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

export default Home
