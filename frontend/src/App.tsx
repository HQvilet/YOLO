import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import LoginPage from './features/auth/pages/LoginPage.tsx'
import SignUpPage from './features/auth/pages/SignUpPage.tsx'
import HomePage from './layout/HomePage.tsx'
import ChatPage from './features/chat/ChatPage.tsx'
import NavBar from './layout/NavBar'
import ProfilePage from './features/profile/pages/ProfilePage.tsx'

import { useQueryAuthUser } from './features/auth/hooks/useAuthUser.ts'
import FriendRequestPage from './features/friends/pages/FriendRequestPage.tsx'
import SearchPage from './features/search/pages/SearchPage.tsx'
import { useSocketStore } from './features/chat/store/chatSocketStore.ts'
import { useCookies } from 'react-cookie'
import ChatCallVideoStreaming from './features/chat/components/VideoCallScreen.tsx'

function App() {
  const {
    data: authUser,
    isLoading,
    error
  } = useQueryAuthUser()
  const { connectSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    connectSocket()

    return () => disconnectSocket()
  }, [connectSocket, disconnectSocket])

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
