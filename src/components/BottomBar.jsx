import { Avatar, IconButton, Text } from '@radix-ui/themes'
import { CirclePlus, Home, TvMinimalPlay } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/authContext'

function BottomBar() {
  const { user, isAuthenticated } = useAuth()

  return (
    <div className={`fixed grid ${isAuthenticated ? 'grid-cols-4' : 'grid-cols-3'} bottom-0 left-0 right-0 bg-[--color-background] backdrop-blur-md border-t border-[--gray-a6] sm:hidden h-16 z-50`}>
      <NavItems
        to={'/'}
        label='Home'
      >
        <Home strokeWidth={1.5} size={22} />
      </NavItems>
      <NavItems
        to={isAuthenticated ? '/dashboard' : '/login'}
        label='Create'
      >
        <CirclePlus strokeWidth={1.5} size={22} />
      </NavItems>
      <NavItems
        to={'/subscriptions'}
        label='Subscriptions'
      >
        <TvMinimalPlay strokeWidth={1.5} size={22} />
      </NavItems>

      {isAuthenticated &&
        <NavItems
          to={`/channel/${user?._id}`}
          label='You'
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
        </NavItems>
      }
    </div>
  )
}

export default BottomBar

export const NavItems = ({
  to = '/',
  children,
  label=''
}) => {

  return (
    <NavLink
      to={to}
      className={({ isActive }) => `${isActive ? 'font-medium text-[--blue-12]' : ''} col-span-1 flex flex-col items-center  justify-center p-2 rounded-lg  transition-all focus-visible:ring-[2px] ring-[--focus-8] outline-none active:bg-[--blue-a3]`}
    >
      {children}
      <Text
        mt={'1'}
        align={'center'}
        className='text-[10px]'
      >
        {label}
      </Text>
    </NavLink>
  )
}
