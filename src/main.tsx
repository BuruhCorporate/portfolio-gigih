import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource-variable/big-shoulders/opsz.css'
import './styles/global.css'
import { isProtected, protectPage } from './lib/protect'

if (isProtected) protectPage()

const root = document.getElementById('root')
if (!root) throw new Error('index.html is missing the #root element')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
