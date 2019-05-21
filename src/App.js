import React from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'

// Component
import Home from './routes/Home'

import { Breadcrumb, Layout } from 'antd'

import 'antd/dist/antd.css'

const { Header, Footer, Content } = Layout

function App() {
  return (
    <Layout className="layout">
      <Router>
        <Header>
          <div className="logo" />
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>
              <Link to="/">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>PackageOverview</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <Switch>
              <Route path="/:packages" component={Home} />
              <Route path="/" component={Home} />
            </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Package Dependency ©2019 Created by James Wong
        </Footer>
      </Router>
    </Layout>
  )
}

export default App
