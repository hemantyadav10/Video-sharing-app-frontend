import { Pencil1Icon } from '@radix-ui/react-icons'
import { AspectRatio, Button, Flex, Heading, TabNav, Text } from '@radix-ui/themes'
import React from 'react'
import { Link, NavLink, Outlet, useLocation, useParams } from 'react-router-dom'

function Channel() {
  const { username } = useParams()
  const location = useLocation();
  const isVideosActive = location.pathname === '/channel/hemant' || location.pathname === '/channel/hemant/videos';


  return (
    <div className='flex flex-col flex-1'>

      {/* cover image and profile image */}
      <div className='relative'>
        <img
          src="https://images.unsplash.com/photo-1479030160180-b1860951d696?&auto=format&fit=crop&w=1200&q=80"
          alt="A house in a forest"
          className='object-cover object-center w-full h-32 sm:h-40 md:h-48 lg:h-52'
        />

        {/* profile image */}
        <div className='absolute bottom-0 translate-y-1/2 rounded-full shadow-md size-24 left-4 shadow-black/50 md:size-36 md:translate-y-3/4 xl:left-20 lg:left-10'>
          <img src="https://images.unsplash.com/photo-1479030160180-b1860951d696?&auto=format&fit=crop&w=1200&q=80" alt=""
            className='object-cover w-full rounded-full aspect-square object-square'
          />
        </div>
      </div>

      {/* user info */}
      <div className='justify-between px-4 pt-16 md:py-8 md:ml-40 md:flex xl:px-20 lg:px-10'>
        <div>
          <Heading as='h3' >
            Jane Doe
          </Heading>
          <Text size={'2'} color='gray'>
            @tranzai
          </Text>
          <Flex gapX={'2'}>
            <Text size={'2'} color='gray'>
              500K subscribers
            </Text>
            <Text size={'2'} color='gray'>
              •
            </Text>
            <Text size={'2'} color='gray'>
              10 videos
            </Text>
          </Flex>
        </div>
        <div className='py-4 space-x-4 md:py-0'>
          <Button variant=''>
            Subscribe
          </Button>
          <Link to='/settings'>
            <Button variant='surface'>
              <Pencil1Icon />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* subscribe or edit button */}


      <div className=' grid grid-cols-3 sm:flex px-4 text-sm border-b border-[#484848] font-medium mt-2 border-t border-t-[#111113] xl:px-20 sticky top-[63px] z-30 bg-[#111113] lg:px-10'>
        <NavLink
          to='/channel/hemant/videos'
          className={() => `tabNav ${isVideosActive ? "tabNav_active" : "tabNav_inactive"} px-6`}
        >
          Videos
        </NavLink>
        <NavLink
          to={'/channel/hemant/playlists'}
          className={({ isActive }) => `tabNav ${isActive ? "tabNav_active" : "tabNav_inactive"} px-6`}
        >
          Playlist
        </NavLink>
        <NavLink
          to={'/channel/hemant/tweets'}
          className={({ isActive }) => `tabNav ${isActive ? "tabNav_active" : "tabNav_inactive"} px-6 `}
        >
          Tweets
        </NavLink>
      </div>
      <div className='flex-1 px-4 py-6 mb-16 lg:px-10 xl:px-20'>
        <Outlet />
      </div>
    </div>
  )
}

export default Channel
