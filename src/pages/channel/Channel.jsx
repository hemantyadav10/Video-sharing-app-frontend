import { Button, Flex, Popover, Skeleton, Text } from '@radix-ui/themes'
import React, { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useParams } from 'react-router-dom'
import AboutChannelDialog from '../../components/AboutChannelDialog'
import QueryErrorHandler from '../../components/QueryErrorHandler'
import SubscriptionButton from '../../components/SubscriptionButton'
import { useAuth } from '../../context/authContext'
import { useFetchUserChannelInfo, useFetchUserVideos } from '../../lib/queries/userQueries'

function Channel() {
  const { userId } = useParams()
  const location = useLocation();
  const { user, isAuthenticated } = useAuth()

  const isVideosActive = location.pathname === `/channel/${userId}` || location.pathname === `/channel/${userId}/videos`;
  const { data, isLoading: loadingProfileInfo, error, isError, refetch } = useFetchUserChannelInfo(userId, user?._id, true)
  const { data: videoData, isFetching: loadingVideos } = useFetchUserVideos(userId)
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <div className='relative flex flex-col flex-1 pt-4'>

      {/* cover image and profile image */}
      {isError && <QueryErrorHandler error={error} onRetry={refetch} />}
      {!isError &&
        <>
          <div className={`sm:aspect-[6/1] aspect-[7/2] mx-4 rounded-xl xl:mx-20 lg:mx-10 ${data?.data?.coverImage === '' && "hidden"}`}>
            <Skeleton loading={loadingProfileInfo} className='w-full h-full rounded-xl'>

              {data?.data?.coverImage && <img
                src={data?.data?.coverImage}
                alt="A house in a forest"
                className='object-cover object-center w-full h-full rounded-xl sm:aspect-[6/1] aspect-[7/2]'
              />}
              {/* "https://yt3.googleusercontent.com/OK1WrCB-Mv4iUly3zcdbhKbE6bwJ4gDVF70hRvLcc56UQlHQN77oRrXSPFnyO6pyIqI2f7_R8w=w2120-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj" || */}
              {/* || 'https://storage.googleapis.com/support-kms-prod/Ch5HG5RGzGnfHhvVSD93gdoEvWm5IPGUkOnS' */}
              {/* profile image */}
            </Skeleton>
          </div>
          <div className='mx-4 mt-4 b xl:mx-20 lg:mx-10'>
            <div className='flex gap-4'>
              <Skeleton loading={loadingProfileInfo}>
                <div className='md:size-40 size-20 sm:size-[120px] rounded-full'>
                  <img
                    src={data?.data?.avatar}
                    alt="profile image"
                    className='object-cover object-center w-full rounded-full aspect-square'
                  />
                </div>
              </Skeleton>
              <div className='flex flex-col justify-center gap-1 md:gap-2'>
                <Skeleton loading={loadingProfileInfo} className='h-6 sm:h-8'>
                  <Text as='p' className='text-2xl font-semibold sm:text-4xl'>
                    {data?.data?.fullName}
                  </Text>
                </Skeleton>
                <div className='flex flex-col gap-1 sm:flex-row'>
                  <Skeleton className='w-20' loading={loadingProfileInfo}>
                    <Text as='p' size={'1'} className='font-medium lg:text-sm'>
                      @{data?.data?.username}
                    </Text>
                  </Skeleton>
                  <Text as='p' size={'1'} color='gray' className='flex gap-1 lg:text-sm'>
                    <Skeleton loading={loadingProfileInfo}  >
                      <span className='hidden sm:block'>•</span>{data?.data?.subscribersCount} subscribers •
                    </Skeleton>
                    <Skeleton loading={loadingVideos}>
                      <span>
                        {videoData?.pages[0]?.data.totalDocs} videos
                      </span>
                    </Skeleton>
                  </Text>
                </div>
                {/* <AboutChannelDialog> */}
                <Skeleton loading={loadingVideos}>
                  <Flex title='Click to know more about this channel' onClick={() => setOpenDialog(true)} gap={'1'} className='text-xs cursor-pointer lg:text-sm'>
                    <Text as='span' color='gray'>More about this channel</Text>
                    <button className='font-medium'>
                      ...more
                    </button>
                  </Flex>
                </Skeleton>
                {openDialog &&
                  <AboutChannelDialog
                    isOpen={openDialog}
                    setOpenDialog={setOpenDialog}
                    joiningDate={data?.data.createdAt}
                    channelId={userId}
                  />
                }
                <Flex gap={'2'} className='hidden md:flex'>
                  {/* <Skeleton> */}
                  {isAuthenticated ? (
                    user?._id !== userId &&
                    <Skeleton loading={loadingProfileInfo}>
                      <SubscriptionButton
                        userId={userId}
                        subscribed={data?.data.isSubscribed}
                      />
                    </Skeleton>
                  ) : (
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

                  )}
                  {user?._id === userId &&
                    <>
                      <Skeleton loading={loadingProfileInfo}>
                        <Link to={'/settings'} className='rounded-full'>
                          <Button
                            variant='soft'
                            highContrast
                            radius='full'
                            className='flex-1'
                            tabIndex={-1}
                          >
                            Edit channel
                          </Button>
                        </Link>
                      </Skeleton>
                      <Skeleton loading={loadingProfileInfo}>
                        <Link to={'/dashboard'} className='rounded-full'>
                          <Button
                            variant='soft'
                            highContrast
                            radius='full'
                            className='flex-1'
                            tabIndex={-1}
                          >
                            Manage videos
                          </Button>

                        </Link>
                      </Skeleton>
                    </>
                  }
                </Flex>

              </div>
            </div>
            <Flex gap={'2'} mt={'4'} className='flex md:hidden'>
              {isAuthenticated ? (
                user?._id !== userId && <Skeleton loading={loadingProfileInfo}>
                  <SubscriptionButton
                    loading={loadingProfileInfo}
                    userId={userId}
                    subscribed={data?.data.isSubscribed}
                    className='w-1/2'
                  />
                </Skeleton>
              ) : (
                <Popover.Root >
                  <Skeleton loading={loadingProfileInfo}>
                    <Popover.Trigger>
                      <Button
                        color='blur'
                        highContrast
                        radius='full'
                        className='w-1/2'
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
              )}
              {user?._id === userId &&
                <>
                  <Skeleton loading={loadingProfileInfo}>
                    <Link to={'/settings'}
                      className='flex-1 rounded-full'
                    >
                      <Button
                        variant='soft'
                        highContrast
                        radius='full'
                        className='w-full'
                        tabIndex={-1}
                      >
                        Edit channel
                      </Button>
                    </Link>
                  </Skeleton>
                  <Skeleton loading={loadingProfileInfo}>
                    <Link to={'/dashboard'}
                      className='flex-1 rounded-full'
                    >
                      <Button
                        variant='soft'
                        highContrast
                        radius='full'
                        tabIndex={-1}
                        className='w-full'
                      >
                        Manage videos
                      </Button>
                    </Link>
                  </Skeleton>
                </>
              }
            </Flex>
          </div>
        </>
      }

      <div className=' grid grid-cols-3 sm:flex px-4 text-sm border-b border-[#484848] mt-2 border-t border-t-[#111113] xl:px-20 sticky top-[63px] z-30 bg-[#111113] lg:px-10 gap-x-1'>
        <NavLink
          preventScrollReset={true}
          to={`/channel/${userId}/videos`}
          className={() => `tabNav ${isVideosActive ? "tabNav_active" : "tabNav_inactive"}`}
        >
          Videos
        </NavLink>
        <NavLink
          preventScrollReset={true}
          to={`/channel/${userId}/playlists`}
          className={({ isActive }) => `tabNav ${isActive ? "tabNav_active" : "tabNav_inactive"} `}
        >
          Playlists
        </NavLink>
        <NavLink
          preventScrollReset={true}
          to={`/channel/${userId}/tweets`}
          className={({ isActive }) => `tabNav ${isActive ? "tabNav_active" : "tabNav_inactive"} `}
        >
          Tweets
        </NavLink>
      </div>
      <div
        style={{ minHeight: 'calc(100vh - 102px)' }}
        className='flex-1 py-4 mb-16 sm:mb-0 sm:px-4 lg:px-10 xl:px-20'>
        <Outlet
          context={{ userId }}
        />
      </div>
    </div >
  )
}

export default Channel


