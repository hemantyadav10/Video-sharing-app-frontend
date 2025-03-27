import { TabNav, Text } from '@radix-ui/themes'
import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

export default function Content() {
  const { pathname } = useLocation()

  return (
    <div className=''>
      <div className='px-4 space-y-1'>
        <Text as='p' weight={'medium'} size={'6'}>
          Channel content
        </Text>
        <Text as='p' color='gray' size={'2'}>
          Manage your channel content and videos
        </Text>
      </div>
      <div className="sticky z-50 bg-[--color-background] top-16">
        <TabNav.Root size={'3'} mt={'4'} className='sticky top-16'>
          <TabNav.Link
            asChild
            active={pathname === '/dashboard/content/videos' || pathname === '/dashboard/content'}
          >
            <Link
              to={'videos'}
            >
              Videos
            </Link>
          </TabNav.Link>
          <TabNav.Link
            asChild
            active={pathname === '/dashboard/content/playlists'}
          >
            <Link
              to={'playlists'}
            >
              Playlists
            </Link>
          </TabNav.Link>
          <TabNav.Link
            asChild
            active={pathname === '/dashboard/content/tweets'}
          >
            <Link
              to={'tweets'}
            >
              Tweets
            </Link>
          </TabNav.Link>
        </TabNav.Root>
      </div>
      <div className={`w-full`}>
        <Outlet />
      </div>
    </div>
  )
}
