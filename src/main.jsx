import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import RoadmapCreator from './components/RoadmapCreator.jsx'
import './index.css'

// Ustalamy, czy renderujemy stronę główną czy dashboard na podstawie URL
const isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html';
const isDashboardPage = window.location.pathname === '/dashboard' || window.location.pathname === '/dashboard.html';
const isRoadmapPage = window.location.pathname === '/roadmap-creator';

// Tworzymy router z prostym przekierowaniem
const router = createBrowserRouter([
  {
    path: "/",
    element: <App showDashboard={false} />,
  },
  {
    path: "/dashboard",
    element: <App showDashboard={true} />,
  },
  {
    path: "/roadmap-creator",
    element: <RoadmapCreator />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Używamy RouterProvider, jeśli mamy pełne ścieżki */}
    {(isHomePage || isDashboardPage || isRoadmapPage) ? (
      isRoadmapPage ? <RoadmapCreator /> : 
      isDashboardPage ? <App showDashboard={true} /> : <App showDashboard={false} />
    ) : (
      <RouterProvider router={router} />
    )}
  </React.StrictMode>,
) 