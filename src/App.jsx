import { Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import Checkout from './pages/Checkout'
import AuthPage from './pages/Auth'


function App() {

  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </div>
  )
}

export default App
