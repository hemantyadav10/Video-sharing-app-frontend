import { Pencil1Icon } from '@radix-ui/react-icons'
import { AspectRatio, Button, Flex, Heading, Popover, Skeleton, Spinner, TabNav, Text } from '@radix-ui/themes'
import React, { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useParams } from 'react-router-dom'
import { useFetchUserChannelInfo, useFetchUserVideos } from '../../lib/queries/userQueries'
import { useAuth } from '../../context/authContext'
import SubscriptionButton from '../../components/SubscriptionButton'

function Channel() {
  const { userId } = useParams()
  const location = useLocation();
  const { user, isAuthenticated } = useAuth()

  const isVideosActive = location.pathname === `/channel/${userId}` || location.pathname === `/channel/${userId}/videos`;
  const { data, isLoading: loadingProfileInfo } = useFetchUserChannelInfo(userId, user?._id)
  const { data: videoData, isFetching: loadingVideos } = useFetchUserVideos(userId)
  console.log(videoData)

  return (
    <div className='relative flex flex-col flex-1'>

      {/* cover image and profile image */}
      <Skeleton loading={loadingProfileInfo}>
        <div className='relative w-full h-32 sm:h-40 md:h-48 lg:h-52'>
          <img
            src={data?.data?.coverImage || 'https://storage.googleapis.com/support-kms-prod/Ch5HG5RGzGnfHhvVSD93gdoEvWm5IPGUkOnS'}
            alt="A house in a forest"
            className='object-cover object-center w-full h-full'
          />

          {/* profile image */}
        </div>
      </Skeleton>
      <div className='absolute -translate-y-1/2 bg-[#111113] rounded-full shadow-md top-32 size-24 left-4 shadow-black/50 md:size-36 xl:left-20 lg:left-10 sm:top-40 md:top-48 lg:top-52 md:-translate-y-1/4'>
        {loadingProfileInfo ?
          <div className='w-full h-full bg-[#ddeaf81c] rounded-full animate-pulse'></div> :
          <img
            src={data?.data?.avatar}
            alt=""
            className='object-cover object-center w-full rounded-full aspect-square'
          />
        }
      </div>
      {/* user info */}
      <div className='flex flex-wrap justify-between px-4 pt-16 pb-8 md:py-8 md:ml-40 xl:px-20 lg:px-10'>
        <div>
          <Heading as='h3' className='capitalize'>
            <Skeleton height={'30px'} loading={loadingProfileInfo}>
              {data?.data?.fullName}
            </Skeleton>
          </Heading>
          <Text as='p' size={'2'} color='gray'>
            <Skeleton loading={loadingProfileInfo} className='w-16'>
              @{data?.data?.username}
            </Skeleton>
          </Text>
          <Flex gapX={'2'}>
            <Text size={'2'} color='gray'>
              <Skeleton loading={loadingProfileInfo}>
                {data?.data?.subscribersCount} subscribers
              </Skeleton>
            </Text>
            <Text hidden={loadingProfileInfo} size={'2'} color='gray'>
              •
            </Text>
            <Text size={'2'} color='gray'>
              <Skeleton loading={loadingVideos}>
                {videoData?.pages[0]?.data.totalDocs} videos
              </Skeleton>
            </Text>
          </Flex>
        </div>
        {/* subscribe or edit button */}
        <div className='py-4 space-x-4 md:py-0'>
          {isAuthenticated ? (
            user?._id !== userId &&
            <SubscriptionButton
              loading={loadingProfileInfo}
              userId={userId}
              subscribed={data?.data.isSubscribed}
            />
          ) :
            <Popover.Root >
              <Skeleton loading={loadingProfileInfo}>
                <Popover.Trigger>
                  <Button
                    color='blur'
                    highContrast
                    radius='full'
                  >
                    Subscribe
                  </Button>
                </Popover.Trigger>
              </Skeleton>
              <Popover.Content className='z-10' width="360px">
                <Flex p={'2'} direction={'column'} gapY={'3'}>
                  <Text as='p'>
                    Want to subscribe to this channel?
                  </Text>
                  <Text size={'2'} color='gray'>
                    Sign in to subscribe to this channel.
                  </Text>
                  <Link to={'/login'}>
                    <Button mt={'4'} radius='full' variant='ghost' className='w-max'>
                      Sign in
                    </Button>
                  </Link>
                </Flex>
              </Popover.Content>
            </Popover.Root>
          }
          {user?._id === userId && <Skeleton loading={loadingProfileInfo}>
            <Link to='/settings' className='flex items-center gap-2 rounded-full'>
              <Button variant='soft' highContrast radius='full'>
                <Pencil1Icon />
                Edit
              </Button>
            </Link>
          </Skeleton>}
        </div>
      </div>

      <div className=' grid grid-cols-3 sm:flex px-4 text-sm border-b border-[#484848] mt-2 border-t border-t-[#111113] xl:px-20 sticky top-[63px] z-30 bg-[#111113] lg:px-10 gap-x-1'>
        <NavLink
          to={`/channel/${userId}/videos`}
          className={() => `tabNav ${isVideosActive ? "tabNav_active" : "tabNav_inactive"}`}
        >
          Videos
        </NavLink>
        <NavLink
          to={`/channel/${userId}/playlists`}
          className={({ isActive }) => `tabNav ${isActive ? "tabNav_active" : "tabNav_inactive"} `}
        >
          Playlist
        </NavLink>
        <NavLink
          to={`/channel/${userId}/tweets`}
          className={({ isActive }) => `tabNav ${isActive ? "tabNav_active" : "tabNav_inactive"} `}
        >
          Tweets
        </NavLink>
      </div>
      <div className='flex-1 py-4 mb-16 sm:mb-0 sm:px-4 lg:px-10 xl:px-20'>
        <Outlet
          context={{ userId }}
        />
      </div>
    </div>
  )
}

export default Channel
