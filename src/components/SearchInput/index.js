import React, { Component, Fragment } from 'react'
import { Input, Button, Menu, Dropdown, Spin } from 'antd'
import debounce from 'lodash.debounce'

import { getSuggestion } from '../../services'

const InputGroup = Input.Group

const spin = (
  <div
    style={{
      margin: 0,
      padding: '4px 0',
      textAlign: 'left',
      backgroundColor: '#fff',
      backgroundClip: 'padding-box',
      borderRadius: 4,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    }}
  >
    <Spin
      size="small"
      style={{ padding: '5px 12px', display: 'block', textAlign: 'left' }}
    />
  </div>
)

export default class SearchInput extends Component {
  state = {
    searchKey: '',
    searchTerm: '',
    suggestions: null,
    searching: false,
  }

  static getDerivedStateFromProps(props, state) {
    const { searched } = props

    if (searched && searched !== state.searchTerm) {
      return {
        searchKey: searched,
        searchTerm: searched,
      }
    }

    return null
  }

  setSearchKey = value => {
    this.setState({ searchKey: value })
  }

  handleChange = e => {
    const { name, value } = e.target

    this.setState({ [name]: value })

    if (value) {
      this.fetchSuggestion()
    }
  }

  fetchSuggestion = debounce(async () => {
    this.setState({ searching: true })

    const result = await getSuggestion(this.state.searchKey)
    if (result) {
      this.setSuggestion(result)
    } else {
      this.setState({ searching: false })
    }
  }, 800)

  setSuggestion = result => {
    this.setState({
      suggestions: result
        .reduce((pre, cur) => [...pre, cur.name], [])
        .filter(item => item !== undefined),
      searching: false,
    })
  }

  hanldeSubmit = () => {
    this.props.onSearch(this.state.searchKey)
    this.setState({ searchTerm: this.state.searchKey, suggestions: null })
  }

  render() {
    const { searchKey, searching, suggestions } = this.state

    const menu = (
      <Menu>
        {suggestions &&
          suggestions.map((name, index) => (
            <Menu.Item key={index} onClick={this.hanldeSubmit}>
              {name}
            </Menu.Item>
          ))}
      </Menu>
    )

    return (
      <Fragment>
        <div id="area">
          <InputGroup compact>
            <Dropdown
              visible={searchKey && (searching || !!suggestions)}
              overlay={searching ? spin : menu}
              overlayStyle={{ width: 'calc(100% - 16px)' }}
              getPopupContainer={() => document.getElementById('area')}
            >
              <Input
                autoFocus
                placeholder="Search packages..."
                style={{ width: 'calc(100% - 100px)' }}
                name="searchKey"
                value={searchKey}
                onChange={this.handleChange}
              />
            </Dropdown>

            <Button
              type="primary"
              disabled={!searchKey}
              loading={this.props.isLoading}
              style={{
                width: 100,
              }}
              onClick={this.hanldeSubmit}
            >
              Search
            </Button>
          </InputGroup>
        </div>
      </Fragment>
    )
  }
}
