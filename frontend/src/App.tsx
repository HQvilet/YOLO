import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import LoginPage from './pages/auth/LoginPage.tsx'
import SignUpPage from './pages/auth/SignUpPage.tsx'
import HomePage from './pages/HomePage.tsx'
import ChatPage from './layout/ChatPage.tsx'
import NavBar from './layout/NavBar'
import ProfilePage from './pages/ProfilePage.tsx'

import { useQueryAuthUser } from './features/auth/handleUser.ts'
import FriendRequestPage from './pages/FriendRequestPage.tsx'
import SearchPage from './pages/SearchPage.tsx'
import { useSocketStore } from './features/socketStore.ts'
import { useCookies } from 'react-cookie'
import ChatCallVideoStreaming from './components/chat/ChatCallVideoStreaming.tsx'

function App() {
  const {
    data: authUser,
    isLoading,
    error
  } = useQueryAuthUser()
  const { connectSocket, disConnectSocket } = useSocketStore();

  useEffect(() => {
    connectSocket()

    return () => disConnectSocket()
  }, [authUser, connectSocket, disConnectSocket])

  if (isLoading) return null // or a loading spinner
  // if (error) return <div>Error loading user</div>
  
  
  return (
    <>
      {authUser && <NavBar />}
      <Routes>
        {authUser ? (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile/:userID" element={<ProfilePage />} />
            <Route path="/friendrequests" element={<FriendRequestPage />}/>
            <Route path="/search" element={<SearchPage />}/>
            <Route path="/login" element={<Navigate to="/home" />} />
            <Route path="/signup" element={<Navigate to="/home" />} />
            {/* <Route path="/video-call" element={<ChatCallVideoStreaming/>} /> */}
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>{authUser && <ChatPage />}
    </>
  )
}

export default App
