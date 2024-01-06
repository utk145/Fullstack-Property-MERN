import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { About, Home, Login, Profile, Register } from './pages/index.js'
import Header from './components/Header.jsx'


const App = () => {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App