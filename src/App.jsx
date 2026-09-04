import { Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
function App() {

  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </div>
  )
}

export default App
