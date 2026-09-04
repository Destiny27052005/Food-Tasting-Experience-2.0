import { Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import Checkout from './pages/Checkout'
function App() {

  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </div>
  )
}

export default App
