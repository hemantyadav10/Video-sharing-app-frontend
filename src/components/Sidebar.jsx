import { HomeIcon, CounterClockwiseClockIcon, ListBulletIcon, HeartIcon, AvatarIcon, HamburgerMenuIcon, BookmarkFilledIcon } from '@radix-ui/react-icons'
import { Button, IconButton, Text } from '@radix-ui/themes'
import React from 'react'
import { Link, NavLink } from 'react-router-dom'

function Sidebar({ showMenu, toggleMenu }) {
  const sidebarItems = [
    {
      name: 'Home',
      slug: '/',
      icon: HomeIcon
    },
    {
      name: 'History',
      slug: '/history',
      icon: CounterClockwiseClockIcon
    },
    {
      name: 'Playlists',
      slug: '/playlists',
      icon: ListBulletIcon
    },
    {
      name: 'Liked Videos',
      slug: '/liked-videos',
      icon: HeartIcon
    },
    {
      name: 'Subscriptions',
      slug: '/subscriptions',
      icon: AvatarIcon
    }
  ]

  return (
    <>
      <div className={`bg-[#0c0c0d] top-0 h-screen fixed border-[#484848] md:h-[calc(100vh-64px)] md:sticky md:top-16 ${showMenu ? 'md:w-56 ' : '-translate-x-full md:translate-x-0 md:w-auto '} transition ease-in  z-[100] border-r w-56 `} >
        <div className='flex flex-col gap-5 '>
          <span className='flex items-center h-16 col-span-1 gap-4 px-6 border-b border-transparent md:hidden'>
            <IconButton
              onClick={toggleMenu}
              variant='ghost'
              highContrast
              color='gray'
              radius='full'
              size={'3'}
            >
              <HamburgerMenuIcon height='20' width='20' />
            </IconButton>
            Logo
          </span>
          <div className={`flex-col hidden gap-8 px-4 py-7 ${showMenu ? "" : "md:flex"}`}>
            {
              sidebarItems.map((item) => (
                <NavLink key={item.name} to={item.slug} className={({ isActive }) => `${isActive ? "" : ""}`}>
                  <IconButton variant='ghost' size={'4'} highContrast className='flex flex-col w-full gap-1 '>
                    {<item.icon height={'20'} width={'20'} />} <Text className='text-[10px]' >{item.name}</Text>
                  </IconButton>
                </NavLink>
              ))
            }
          </div>
          <div className={`flex flex-col gap-5 px-5 md:py-6 ${showMenu ? "" : "md:hidden"}`}>
            {sidebarItems.map((item) => (
              <NavLink key={item.name} to={item.slug} className={({ isActive }) => `${isActive ? "" : ""}`}>
                <Button
                  key={item.name}
                  size={'2'}
                  variant='ghost'
                  highContrast
                  className="justify-start w-full px-3 py-3"
                >
                  {item.icon && <item.icon className="mr-2" height={'20'} width={"20"} />}{item.name}
                </Button>
              </NavLink>

            ))}
          </div>
        </div>
      </div>
      <div onClick={toggleMenu} className={`absolute inset-0 z-[90] w-full md:hidden bg-black/70 ${showMenu ? "" : "hidden"}`}></div>
    </>
  )
}

export default Sidebar
