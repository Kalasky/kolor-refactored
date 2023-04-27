import './index.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// pages
import Home from './pages/Home'
import Auth from './pages/Auth'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
