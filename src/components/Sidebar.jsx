import { HomeIcon, CounterClockwiseClockIcon, ListBulletIcon, HeartIcon, AvatarIcon, HamburgerMenuIcon } from '@radix-ui/react-icons'
import { Button, IconButton } from '@radix-ui/themes'
import React from 'react'

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
    <div className={`bg-[#111113] h-screen fixed border-[#484848] md:h-[calc(100vh-64px)] md:sticky md:top-16 ${showMenu ? '' : '-translate-x-full'} ease-in-out duration-200 z-50 border-r w-56`}>
      <div className='flex flex-col gap-5 '>
        <span className='flex items-center h-16 col-span-1 gap-4 px-6 border-b border-transparent md:hidden'>
          <IconButton
            onClick={toggleMenu}
            variant='ghost'
            highContrast
            color='gray'
            radius='full'
          >
            <HamburgerMenuIcon height='20' width='20' />
          </IconButton>
          Logo
        </span>
        <div className='flex flex-col gap-5 px-5 md:py-6'>
          {sidebarItems.map((item) => (
            <Button
              key={item.name}
              size={'3'}
              variant='ghost'
              highContrast
              className="justify-start px-3 py-3"
            >
              {item.icon && <item.icon className="mr-2" height={'20'} width={"20"} />}{item.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
