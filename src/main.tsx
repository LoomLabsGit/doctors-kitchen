import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import 'material-symbols/rounded.css'
import './index.css'
import App from './App'
import { FiltersProvider } from './lib/filters'
import { PlansProvider } from './lib/plans'
import { SavedProvider } from './lib/saved'
import { ProgressProvider } from './lib/progress'
import { VersionProvider } from './lib/version'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <VersionProvider>
        <FiltersProvider>
          <PlansProvider>
            <SavedProvider>
              <ProgressProvider>
                <App />
              </ProgressProvider>
            </SavedProvider>
          </PlansProvider>
        </FiltersProvider>
      </VersionProvider>
    </HashRouter>
  </StrictMode>,
)
