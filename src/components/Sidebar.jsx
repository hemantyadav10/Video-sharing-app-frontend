import { HomeIcon, CounterClockwiseClockIcon, ListBulletIcon, HeartIcon, AvatarIcon, HamburgerMenuIcon, BookmarkFilledIcon, ChevronLeftIcon } from '@radix-ui/react-icons'
import { IconButton, Text } from '@radix-ui/themes'
import React from 'react'
import { NavLink } from 'react-router-dom'
import ThumbsUp from '../assets/ThumbsUpIcon'

function Sidebar({ showMenu, toggleMenu }) {
  const sidebarItems = [
    {
      name: 'Home',
      slug: '/',
      icon: HomeIcon,
    },
    {
      name: 'Subscriptions',
      slug: '/subscriptions',
      icon: AvatarIcon,
      separator: true
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
      icon: ThumbsUp,
      separator: true
    },

  ]

  return (
    <>
      <div className={`bg-[#0c0c0d] top-0 h-screen fixed border-[#484848] md:h-[calc(100vh-64px)] md:sticky md:top-16 ${showMenu ? 'md:w-56 ' : '-translate-x-full md:translate-x-0 md:w-auto '} transition ease-in  z-[100] border-r w-56 $`} >
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
          <div className={`flex-col hidden px-1 py-7 gap-1 ${showMenu ? "" : "md:flex"} `}>
            {
              sidebarItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.slug}
                  className={({ isActive }) => `${isActive ? "bg-[#0077ff3a] f text-[#c2e6ff]" : ""} flex flex-col items-center gap-2 justify-center p-2 py-3 rounded-lg hover:bg-[#0077ff3a] transition-all focus-visible:ring-[2px] ring-[#2870bd] outline-none active:bg-[#0081fd6b]`}
                >
                  {<item.icon height={'20'} width={'20'} />} <Text className='text-[10px]' >{item.name}</Text>
                </NavLink>
              ))
            }
          </div>
          <div className={`flex flex-col gap-1 px-3 md:py-6 ${showMenu ? "" : "md:hidden"} `}>
            {sidebarItems.map((item) => (
              <div key={item.name}>
                <NavLink
                  to={item.slug}
                  className={({ isActive }) => `${isActive ? "bg-[#0077ff3a]  text-[#c2e6ff]" : ""} flex hover:bg-[#0077ff3a]  transition-all p-3 gap-2 items-center rounded-lg text-sm focus-visible:ring-[2px] ring-[#2870bd] outline-none active:bg-[#0081fd6b]`}
                >
                  {item.icon && <item.icon className="mr-2" height={'20'} width={"20"} />}{item.name}
                </NavLink>
                {item.separator &&
                  <hr className='border-[#484848] my-2' />
                }
              </div>
            ))}
          </div>
        </div>
      </div>
      <div onClick={toggleMenu} className={`absolute inset-0 z-[90] w-full md:hidden bg-black/70 ${showMenu ? "" : "hidden"}`}></div>
    </>
  )
}

export default Sidebar
