import React, { useState, type ReactNode } from 'react'
import { Route, Link, useNavigate, createSearchParams } from 'react-router-dom'
import Logo from '../assets/Logo'
import AvatarImage from '../assets/AvatarImage'
import { useQueryAuthUser } from '../features/auth/hooks/useAuthUser'

import { HiDotsHorizontal } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { FaHome } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { PiFilmSlateFill } from "react-icons/pi";
import { FaStore } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { IoSearch } from "react-icons/io5";


import { useQueryClient } from '@tanstack/react-query'
import { useAuthLogOut } from '../features/auth/hooks/useAuthMutation'
import NavChatFlyOutMenu from '../features/chat/NavChatFlyOutMenu'

const NavBarNavigation = ({to, children}: {to: string, children: ReactNode}) => {
  return(
    <Link to={to} className='flex flex-1 justify-center items-center align-middle hover:text-violet-400 hover:bg-zinc-700 h-full self-center'>
      {children}
    </Link>
  )
}

const NavBar = () => {

  

  const queryClient = useQueryClient()
  const navigate = useNavigate();

  const [isOpenDropDown, openDropDown] = useState<boolean>(false)
  const [search, setSearch] = useState<string>("");
  
  const {
    data: authUser,
  } = useQueryAuthUser();

  const {
    mutate: logOut,
  } = useAuthLogOut({
    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null);
      queryClient.invalidateQueries({queryKey: ["authUser"]})
    }
  })

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const text = search.trim()
    if(text === "") return
    navigate({
      pathname: `/search`,
      search: `?${createSearchParams({q: text})}`
    })
  }

  return (
    <nav className='flex justify-stretch gap-5 border-b-4 border-violet-500 bg-zinc-800 w-[100vw] fixed top-0 right-0 z-10'>
        <div className='flex basis-1/3 items-center'>
          <Link to={'/home'} className='flex ml-3'>
            <Logo />
          </Link>
          <div className='input_box pl-3 p-2 self-center bg-zinc-700 rounded-full text-zinc-200'>
            <IoSearch />
            <form action=""
              className='input_box'
              onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search here"
                className='bg-transparent'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
            
          </div>
        </div>
        {/* Navigation */}
        <div className='flex gap-2 basis-1/2 text-white text-2xl'>
          <NavBarNavigation to={"/home"}>
            <FaHome/>
          </NavBarNavigation>
          <NavBarNavigation to={"/friendrequests"}>
            <FaUserFriends/>
          </NavBarNavigation>
          <NavBarNavigation to={"/home"}>
            <PiFilmSlateFill/>
          </NavBarNavigation>
          <NavBarNavigation to={"/home"}>
            <FaStore/>
          </NavBarNavigation>
          <NavBarNavigation to={"/home"}>
            <HiOutlineUserGroup/>
          </NavBarNavigation>
        </div>
        <div className='relative flex justify-end items-center basis-1/3 gap-4 mr-2'>
          <div className='size-11'>
            <button className='size-full bg-zinc-700 rounded-full overflow-hidden border-2 border-violet-500 hover:bg-zinc-500'
              onClick={e => openDropDown(prev => !prev)} 
            >
              <HiDotsHorizontal className='text-4xl mx-auto text-violet-400'/>
            </button>
            
          </div>
          <div className=' bg-white rounded-full overflow-hidden' >
            <Link to={`/profile/${authUser?._id}`} className='size-11'>
              <AvatarImage src={authUser?.profileImg} className='size-11'/>
            </Link>
          </div>
          <div className='size-11'>
            <button className='size-full bg-zinc-700 rounded-full overflow-hidden border-2 border-red-500 hover:bg-zinc-500'
              onClick={() => logOut()}
            >
              <FiLogOut className='text-2xl mx-auto text-red-500'/>
            </button>
          </div>

          {isOpenDropDown && <NavChatFlyOutMenu />}
        </div>
        
    </nav>
  )
}

export default NavBar