import React from 'react'

import SearchUserPreview from '../components/SearchUserPreview'
import { useQueryAllRecommendedUser } from '../../friends/hooks/useFriendHooks'
import { useQuerySearchUsers } from '../hooks/useSearchHooks'
import { useSearchParams } from 'react-router-dom'

const SearchPage = () => {

  const [searchParams] = useSearchParams()

  const searchQuery = searchParams.get('q')?.toString() ?? ""

  const {data: users} = useQuerySearchUsers(searchQuery)

  
  return (
    <div className='flex flex-row gap-2 relative top-[10vh] text-white'>
      {/* <div className='basis-96 stickey min-h-[100vh] h-auto overflow-y-auto overflow-x-clip hidden lg:block'>
          <div className='size-full bg-zinc-800 border-r-2 border-zinc-600'>

          </div>
      </div> */}
      <div className='flex flex-1 p-5 justify-center'>
        <div className='flex flex-col  min-w-64 w-2/3 p-4 rounded-lg gap-4'>
            <header className='flex'>
                {/* <h3 className='font-bold text-2xl'>Recommends</h3> */}
            </header>
            {!users || users?.length === 0 ? 
              <p className='text-zinc-400'>No users found</p>
            :
              <div className='flex flex-col gap-3 justify-center items-center'>
                {users.map(user => (
                  <SearchUserPreview key={user._id} user={user} />
                ))}
              </div>}
        </div>
      </div>
    </div>
  )
}

export default SearchPage