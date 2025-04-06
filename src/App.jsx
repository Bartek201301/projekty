import { useState } from 'react'
import Dashboard from './components/Dashboard'
import LandingPage from './components/LandingPage'

function App({ showDashboard = false }) {
  return (
    <div className="app">
      {showDashboard ? (
        <Dashboard initialView="checklist" />
      ) : (
        <LandingPage />
      )}
    </div>
  )
}

export default App 