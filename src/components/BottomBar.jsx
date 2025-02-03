import { Avatar, IconButton, Text } from '@radix-ui/themes'
import { CirclePlus, Home, TvMinimalPlay } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/authContext'

function BottomBar() {
  const { user, isAuthenticated } = useAuth()

  return (
    <div className={`fixed grid ${isAuthenticated ? 'grid-cols-4' : 'grid-cols-3'} bottom-0 left-0 right-0 bg-[#0c0c0d]/80    backdrop-blur-md border-t border-[#484848] sm:hidden h-16 z-50`}>

      <NavLink
        to={'/'}
        className={({ isActive }) => `${isActive ? ' font-medium text-[#70b8ff]' : ''} col-span-1 flex flex-col items-center  justify-center p-2 rounded-lg  transition-all focus-visible:ring-[2px] ring-[#2870bd] outline-none active:bg-[#0081fd6b] `}
      >
        <Home strokeWidth={1.5} size={22} />
        <Text
          mt={'1'}
          align={'center'}
          className='text-[10px]'
        >
          Home
        </Text>
      </NavLink>
      <NavLink
        to={isAuthenticated ? '/dashboard' : '/login'}
        className={({ isActive }) => `${isActive ? 'font-medium text-[#70b8ff]' : ''} col-span-1 flex flex-col items-center  justify-center p-2 rounded-lg  transition-all focus-visible:ring-[2px] ring-[#2870bd] outline-none active:bg-[#0081fd6b]`}
      >
        <CirclePlus strokeWidth={1.5} size={22} />
        <Text
          mt={'1'}
          align={'center'}
          className='text-[10px]'
        >
          Create
        </Text>
      </NavLink>
      <NavLink
        to={'/subscriptions'}
        className={({ isActive }) => `${isActive ? 'font-medium text-[#70b8ff]' : ''} col-span-1 flex flex-col items-center  justify-center p-2 rounded-lg  transition-all focus-visible:ring-[2px] ring-[#2870bd] outline-none active:bg-[#0081fd6b]`}
      >
        <TvMinimalPlay strokeWidth={1.5} size={22} />
        <Text
          mt={'1'}
          align={'center'}
          className='text-[10px]'
        >
          Subscriptions
        </Text>
      </NavLink>
      {isAuthenticated &&
        <NavLink
          to={`/channel/${user?._id}`}
          className={({ isActive }) => `${isActive ? 'font-medium text-[#70b8ff]' : ''} col-span-1 flex flex-col items-center  justify-center p-2 rounded-lg  transition-all focus-visible:ring-[2px] ring-[#2870bd] outline-none active:bg-[#0081fd6b]`}
        >
          <IconButton
            tabIndex={'-1'}
            variant='ghost'
            color='gray'
            radius='full'
          >
            <Avatar
              src={user?.avatar}
              fallback="A"
              size={'1'}
            />
          </IconButton>
          <Text
            mt={'1'}
            align={'center'}
            className='text-[10px]'
          >
            You
          </Text>
        </NavLink>}
    </div>
  )
}

export default BottomBar
