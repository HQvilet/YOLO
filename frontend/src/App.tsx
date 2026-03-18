import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import LoginPage from './pages/auth/LoginPage.tsx'
import SignUpPage from './pages/auth/SignUpPage.tsx'
import HomePage from './pages/home/HomePage.tsx'
import ChatPage from './pages/chat/ChatPage.tsx'
import NavBar from './layout/NavBar'
import ProfilePage from './pages/user/ProfilePage.tsx'

import { useQueryAuthUser } from './hooks/handleUser.ts'

function App() {
  const {
    data: authUser,
    isLoading,
    error
  } = useQueryAuthUser()
  
  return (
    <>
      {authUser && <NavBar/>}
      {authUser && <ChatPage/>}
      <Routes>
        <Route path="/" element= { authUser ? <HomePage/> : <Navigate to="/login" /> } />
        <Route path="/home" element= { authUser ? <HomePage/> : <Navigate to="/login" /> } />
        <Route path="/signup" element= { !authUser ? <SignUpPage/> : <Navigate to="/" /> } />
        <Route path="/login" element= { !authUser ? <LoginPage/> : <Navigate to="/" /> } />
        <Route path="/profile/:userID" element= { authUser ? <ProfilePage /> : <Navigate to="/login" /> } />
      </Routes>
    </>
  )
}

export default App
