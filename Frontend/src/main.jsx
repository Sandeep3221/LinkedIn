import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthContex from './Contex/AuthContex.jsx'
import UserContex from './Contex/UserContex.jsx'
createRoot(document.getElementById('root')).render(
<BrowserRouter>
  <AuthContex>
    <UserContex>
    <App />
    </UserContex>
  </AuthContex>
</BrowserRouter>,
)
