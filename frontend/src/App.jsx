import './index.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// pages
import Home from './pages/Home'
import Auth from './pages/Auth'
import AuthSuccess from './pages/AuthSuccess'
import AuthError from './pages/AuthError'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/auth-error" element={<AuthError />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
