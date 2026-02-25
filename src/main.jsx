import { StrictMode } from 'react'
console.log("App loaded, build version: 20260226_0635");
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
