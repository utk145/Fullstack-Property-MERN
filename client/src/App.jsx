import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { About, CreateListing, Home, Listing, Login, PasswordChange, Profile, Register, Search, UpdateListing } from './pages/index.js'
import Header from './components/Header.jsx'
import Private from './components/Private.jsx'


const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route element={<Private />} >
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/change-password" element={<PasswordChange />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/update-listing/:id" element={<UpdateListing />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listings/:id" element={<Listing />} />
        <Route path='/search' element={<Search />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App