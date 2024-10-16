import { Pencil1Icon } from '@radix-ui/react-icons';
import { Button, Flex, Heading, Text } from '@radix-ui/themes';
import React from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import CameraIcon from '../../assets/CameraIcon';

function Settings() {
  const location = useLocation();
  const isVideosActive = location.pathname === '/settings' || location.pathname === '/settings/personalInfo';

  return (
    <div className='flex flex-col flex-1'>

      {/* cover image and profile image */}
      <div className='relative'>
        <img
          src="https://images.unsplash.com/photo-1479030160180-b1860951d696?&auto=format&fit=crop&w=1200&q=80"
          alt="A house in a forest"
          className='object-cover object-center w-full h-32 cursor-pointer sm:h-40 md:h-48 lg:h-52'
        />

        {/* profile image */}
        <div className='absolute bottom-0 translate-y-1/2 rounded-full shadow-md cursor-pointer size-24 left-4 shadow-black/50 md:size-36 md:translate-y-3/4 xl:left-20 lg:left-10 group'>
          <img src="https://images.unsplash.com/photo-1479030160180-b1860951d696?&auto=format&fit=crop&w=1200&q=80 " alt=""
            className='object-cover w-full rounded-full aspect-square object-square '
          />
          <span className='absolute inset-0 flex items-center justify-center transition-opacity duration-200 rounded-full opacity-0 group-hover:opacity-100 bg-black/40'><CameraIcon /></span>
        </div>
        <span className='absolute flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-full pointer-events-none bottom-2 right-2 bg-black/70'><CameraIcon /> Edit</span>
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
          <Link to='/channel/hemant'>
            <Button>
              View Channel
            </Button>
          </Link>
        </div>
      </div>

      {/* subscribe or edit button */}


      <div className=' grid grid-cols-2 sm:flex px-4 text-sm border-b border-[#484848] font-medium mt-2 border-t border-t-[#111113] xl:px-20 sticky top-[63px] z-30 bg-[#111113] lg:px-10'>
        <NavLink
          to='/settings/personalInfo'
          className={() => `tabNav ${isVideosActive ? "tabNav_active" : "tabNav_inactive"} px-6`}
        >
          Personal Information
        </NavLink>
        <NavLink
          to={'/settings/change-password'}
          className={({ isActive }) => `tabNav ${isActive ? "tabNav_active" : "tabNav_inactive"} px-6`}
        >
          Change Password
        </NavLink>
      </div>
      <div className='flex-1 px-4 py-6 mb-16 lg:px-10 xl:px-20'>
        <Outlet />
      </div>
    </div>
  )

}

export default Settings
