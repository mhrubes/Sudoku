import { Route, Routes } from 'react-router-dom'
import { Game } from './pages/Game'
import { Home } from './pages/Home'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hra/:difficulty" element={<Game />} />
    </Routes>
  )
}
