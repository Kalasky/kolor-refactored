import './index.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// pages
import Home from './pages/Home'
import Auth from './pages/Auth'
import AuthCallback from './pages/AuthCallback'
import AuthError from './pages/AuthError'
import AuthSuccess from './pages/AuthSuccess'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/api/twitch/callback" element={<AuthCallback />} />
          <Route path="/auth-error" element={<AuthError />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
