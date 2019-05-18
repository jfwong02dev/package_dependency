import React, { Component } from 'react'
import { getSuggestion, searchPackage } from '../services'
import { Input, Row, Col } from 'antd'

import './Home.less'

const Search = Input.Search

class Home extends Component {
  state = {
    results: null,
    searchKey: 'react',
    searchTerm: '',
    isLoading: false,
  }

  checkPackageSearchTerm(searchTerm) {
    const { results } = this.state
    return !results || !results[searchTerm]
  }

  handleChange = e => {
    const { name, value } = e.target

    this.setState({ [name]: value })
  }

  handleSearch = () => {
    const { searchKey } = this.state

    this.setState({ searchTerm: searchKey })

    if (this.checkPackageSearchTerm(searchKey)) {
      this.fetchPackage(searchKey)
    }
  }

  fetchPackage = async searchKey => {
    const result = await searchPackage(searchKey)

    if (result) {
      this.setPackage(result)
    }
  }

  setPackage = result => {
    this.setState(prevState => {
      return {
        results: {
          ...prevState.results,
          [this.state.searchTerm]: {
            packages: Object.keys(result),
            packagesByName: result,
          },
        },
      }
    })
  }

  render() {
    const { results, searchTerm, searchKey } = this.state

    console.log({ results, searchTerm })
    console.log(results && Object.keys(results).reverse())

    return (
      <div className="home-wrapper">
        <Search
          autoFocus
          className="search-input"
          placeholder="Search packages..."
          enterButton="Search"
          size="large"
          name="searchKey"
          value={searchKey}
          onChange={this.handleChange}
          onSearch={this.handleSearch}
        />

        <Row gutter={16}>
          <Col span={12}>
            {results && results[searchTerm] && (
              <ul>
                {results[searchTerm].packages.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </Col>
          <Col span={12}>Suggestion:</Col>
        </Row>
      </div>
    )
  }
}

export default Home
