import Layout from "./components/layout"
import { Routes, Route } from "react-router-dom"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<h1>About</h1>} />
      </Route>
    </Routes>
  )
}

export default App
