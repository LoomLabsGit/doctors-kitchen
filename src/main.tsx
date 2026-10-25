import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { FiltersProvider } from './lib/filters'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <FiltersProvider>
        <App />
      </FiltersProvider>
    </HashRouter>
  </StrictMode>,
)
