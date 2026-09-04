import { Routes, Route } from 'react-router-dom'
function App() {

  return (
    <div className="App">
      <h1 className="text-5xl">Hello, Vite!</h1>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
      </Routes>
    </div>
  )
}

export default App
