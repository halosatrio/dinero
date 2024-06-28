import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// import the generated route tree
import { routeTree } from './routeTree.gen'

// create a new router instance
const router = createRouter({ routeTree })

// register the router instance for the type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <RouterProvider router={router} />
  </React.StrictMode>,
)
