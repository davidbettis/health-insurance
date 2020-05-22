import React from 'react'
import { Root, Routes, addPrefetchExcludes } from 'react-static'
import { Link, Router } from 'components/Router'

import './app.css'

// Any routes that start with 'dynamic' will be treated as non-static routes
addPrefetchExcludes(['dynamic'])

function App () {
  return (
    <Root>
      <div
        style={{
          background: '#efefef',
          marginBottom: '1.45rem'
        }}
      >
        <div
          style={{
            margin: '0 auto',
            maxWidth: 960,
            padding: '1.45rem 1.0875rem'
          }}
        >
          <h1 style={{ margin: 0 }}>
            <Link to="/health-insurance/" style={{ color: 'black', textDecoration: 'none' }}>
              Health Insurance
            </Link>
          </h1>
        </div>

      </div>
      <div
        style={{
          margin: '0 auto',
          maxWidth: 960,
          padding: '0px 1.0875rem 1.45rem',
          paddingTop: 0
        }}
      >
        <div className="content">
          <React.Suspense fallback={<em>Loading...</em>}>
            <Router>
              <Routes path="*" />
            </Router>
          </React.Suspense>
        </div>
        <footer>
        </footer>
      </div>
    </Root>
  )
}

export default App
