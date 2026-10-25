import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { FiltersProvider } from './lib/filters'
import { PlansProvider } from './lib/plans'
import { SavedProvider } from './lib/saved'
import { ProgressProvider } from './lib/progress'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <FiltersProvider>
        <PlansProvider>
          <SavedProvider>
            <ProgressProvider>
              <App />
            </ProgressProvider>
          </SavedProvider>
        </PlansProvider>
      </FiltersProvider>
    </HashRouter>
  </StrictMode>,
)
