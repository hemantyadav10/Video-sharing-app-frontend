import { Pencil1Icon } from '@radix-ui/react-icons'
import { AspectRatio, Button, Flex, Heading, Skeleton, Spinner, TabNav, Text } from '@radix-ui/themes'
import React from 'react'
import { Link, NavLink, Outlet, useLocation, useParams } from 'react-router-dom'
import { useFetchUserChannelInfo, useFetchUserVideos } from '../../lib/queries/userQueries'

function Channel() {
  const { userId } = useParams()
  const location = useLocation();
  const isVideosActive = location.pathname === `/channel/${userId}` || location.pathname === `/channel/${userId}/videos`;
  const { data, isLoading: loadingProfileInfo } = useFetchUserChannelInfo(userId)
  const { data: videoData, isLoading: loadingVideos } = useFetchUserVideos(userId)

  console.log(videoData?.data)

  console.log(data?.data)


  return (
    <div className='relative flex flex-col flex-1'>

      {/* cover image and profile image */}
      <Skeleton loading={loadingProfileInfo}>
        <div className='relative w-full h-32 sm:h-40 md:h-48 lg:h-52'>
          <img
            src={data?.data?.coverImage || 'https://static.vecteezy.com/system/resources/previews/036/226/143/non_2x/ai-generated-nature-landscapes-background-free-photo.jpg'}
            alt="A house in a forest"
            className='object-cover object-center w-full h-full'
          />

          {/* profile image */}
        </div>
      </Skeleton>
      <div className='absolute -translate-y-1/2 bg-[#111113] rounded-full shadow-md top-32 size-24 left-4 shadow-black/50 md:size-36 xl:left-20 lg:left-10 sm:top-40 md:top-48 lg:top-52 md:-translate-y-1/4'>
        {loadingProfileInfo ?
          <div className='w-full h-full bg-gray-700 rounded-full animate-pulse'></div> :
          <img
            src={data?.data?.avatar}
            alt=""
            className='object-cover object-center w-full rounded-full aspect-square'
          />
        }
      </div>
      {/* user info */}
      <div className='justify-between px-4 pt-16 md:py-8 md:ml-40 md:flex xl:px-20 lg:px-10'>
        <div>
          <Heading as='h3' className='capitalize'>
            <Skeleton height={'30px'} loading={loadingProfileInfo}>
              {data?.data?.fullName}
            </Skeleton>
          </Heading>
          <Text size={'2'} color='gray'>
            <Skeleton loading={loadingProfileInfo}>
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
                {videoData?.data.totalDocs} videos
              </Skeleton>
            </Text>
          </Flex>
        </div>
        <div className='py-4 space-x-4 md:py-0'>
          <Skeleton loading={loadingProfileInfo}>
            <Button variant=''>
              Subscribe
            </Button>
          </Skeleton>
          <Skeleton loading={loadingProfileInfo}>
            <Button variant='surface'>
              <Link to='/settings' className='flex items-center gap-2'>
                <Pencil1Icon />
                Edit
              </Link>
            </Button>
          </Skeleton>
        </div>
      </div>

      {/* subscribe or edit button */}


      <div className=' grid grid-cols-3 sm:flex px-4 text-sm border-b border-[#484848] font-medium mt-2 border-t border-t-[#111113] xl:px-20 sticky top-[63px] z-30 bg-[#111113] lg:px-10'>
        <NavLink
          to={`/channel/${userId}/videos`}
          className={() => `tabNav ${isVideosActive ? "tabNav_active" : "tabNav_inactive"} px-6`}
        >
          Videos
        </NavLink>
        <NavLink
          to={`/channel/${userId}/playlists`}
          className={({ isActive }) => `tabNav ${isActive ? "tabNav_active" : "tabNav_inactive"} px-6`}
        >
          Playlist
        </NavLink>
        <NavLink
          to={`/channel/${userId}/tweets`}
          className={({ isActive }) => `tabNav ${isActive ? "tabNav_active" : "tabNav_inactive"} px-6 `}
        >
          Tweets
        </NavLink>
      </div>
      <div className='flex-1 px-4 py-6 mb-16 lg:px-10 xl:px-20'>
        {loadingVideos ? <Spinner className='h-6 mx-auto' /> :
          <Outlet
            context={
              {
                videos: videoData?.data,
                loading: loadingVideos, 
                userId
              }}
          />
        }
      </div>
    </div>
  )
}

export default Channel
