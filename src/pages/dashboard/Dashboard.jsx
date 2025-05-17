import { SymbolIcon } from '@radix-ui/react-icons'
import { Button, Dialog, Flex, Heading, IconButton, Separator, Skeleton, Text } from '@radix-ui/themes'
import { ListPlus, SquarePen, ThumbsUpIcon, Upload } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import no_content from '../../assets/no_content.svg'
import no_tweet from '../../assets/no_tweet.svg'
import CreatePlaylistDialog from '../../components/CreatePlaylistDialog'
import QueryErrorHandler from '../../components/QueryErrorHandler'
import SubscribersDialog from '../../components/SubscribersDialog'
import UploadVideoDialog from '../../components/UploadVideoDailog'
import { useAuth } from '../../context/authContext'
import { useGetChannelStats, useGetChannleVideos } from '../../lib/queries/dashboardQueries'
import { useGetSubscribers } from '../../lib/queries/subscriptionQueries'
import { useFetchUserTweets } from '../../lib/queries/tweetQueries'
import { usePaginationContext } from './DashboardLayout'

function Dashboard() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [openSubscriberDialog, setOpenSubscriberDialog] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const userId = user?._id
  const location = useLocation();
  const navigate = useNavigate()
  const showSidebar = useOutletContext()
  const [openCreatePlaylist, setOpenCreatePlaylist] = useState(false)
  const { limit, page, setPage, setLimit } = usePaginationContext()


  const {
    data: stats,
    isLoading: isLoadingChannelStats,
    error: channelStatsError,
    refetch: refetchChannelStats,
    isError: hasChannelStatsError, 
    isFetching: isFetchingChannelStats
  } = useGetChannelStats(userId);
  const channelStats = stats?.data;
  const { totalLikes = 0, totalSubscribers = 0, totalVideos = 0, totalViews = 0 } = channelStats || {}

  const {
    data,
    isLoading: isLoadingSubscribers,
    isFetching: isFetchinSubscribers,
    error: fetchSubscribersError,
    refetch: refetchSubscribers,
    isError: hasFetchSubscribersError
  } = useGetSubscribers(3)
  const subscriberData = data?.data
  const hasSubscribers = !!data?.data?.totalDocs;

  const {
    data: videosData,
    isLoading: isLoadingVideos,
    error: fetchVideosError,
    refetch: refetchVideos,
    isError: hasFetchVideosError, 
    isFetching: isFetchingVideos
  } = useGetChannleVideos(isAuthenticated, 3, 1, 'views')
  const channelVideos = videosData?.data?.docs
  const hasVideos = !!videosData?.data?.totalDocs

  const {
    data: tweetData,
    isLoading: isLoadingTweet,
    isError: hasFetchTweetError,
    error: fetchTweetError,
    refetch: refetchTweet
  } = useFetchUserTweets(user?._id, user?._id, 1)
  const latestTweet = tweetData?.data?.[0]
  const hasTweet = Boolean(tweetData?.data?.[0] ?? 0)


  useEffect(() => {
    if (location.state?.openDialog) {
      setDialogOpen(true); // Set dialog open first
    }

    if (location.state) {
      navigate(location.pathname, { replace: true }); // Clear state from history after using it
    }
  }, [location.state, navigate]);

  return (
    <div className='px-6 mx-auto max-w-screen-2xl'>
      {openSubscriberDialog && <SubscribersDialog
        open={openSubscriberDialog}
        setOpen={setOpenSubscriberDialog}
      />}
      <UploadVideoDialog
        isDialogOpen={isDialogOpen}
        setDialogOpen={setDialogOpen}
        limit={limit}
        page={page}
      />
      <Flex align={'center'} justify={'between'} wrap={'wrap'} gap={'2'}>
        <Text as='span' weight={'medium'} size={'6'}>
          Channel Dashboard
        </Text>
        <Flex as='div' gap={'2'}>

          <IconButton
            aria-label='upload videos'
            title='Upload videos'
            variant='outline'
            color='gray'
            radius='full'
            className='z-10'
            onClick={() => setDialogOpen(true)}
          >
            <Upload size={16} />
          </IconButton>


          <IconButton
            aria-label='create tweet'
            title='Create tweet'
            variant='outline'
            color='gray'
            radius='full'
            className='z-10'
            asChild
          >
            <Link to={`/channel/${user?._id}/tweets`}>
              <SquarePen size={16} />
            </Link>
          </IconButton>
          <IconButton
            aria-label='new playlist'
            title='New playlist'
            variant='outline'
            color='gray'
            radius='full'
            className='z-10'
            onClick={() => {
              setOpenCreatePlaylist(true)
            }}
          >
            <ListPlus size={16} />
          </IconButton>

          <CreatePlaylistDialog
            open={openCreatePlaylist}
            toggleOpen={setOpenCreatePlaylist}
          />
        </Flex>
      </Flex>
      <div className={`grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2 xl:grid-cols-3 ${showSidebar ? "" : "md:grid-cols-2 xl:grid-cols-3"}`}>
        <section className='p-6 col-span-1  border border-[--gray-a6]  rounded-3xl bg-gradient-to-b from-transparent from-60%  to-[--blue-a2] lg:h-[560px] bg-[--color-surface] shadow-lg '>
          <div className='flex flex-col items-center justify-center p-6 border border-[--gray-a6] py-12 rounded-lg border-dotted h-full'>
            <Heading mb={'1'} weight={"medium"} align={'center'}>
              Welcome back, {user?.fullName}
            </Heading>
            <Text
              as='p'
              weight={'light'}
              size={'2'}
              align={'center'}
            >
              Experience a smarter, faster way to manage your videos, designed to save time, enhance productivity, and deliver superior outcomes.
            </Text>

            <Button
              highContrast
              radius='full'
              className='z-10 mt-4'
              onClick={() => setDialogOpen(true)}
            >
              Upload videos
            </Button>

          </div>
        </section>


        <div className='col-span-1 border border-[--gray-a6]  rounded-3xl p-6 flex justify-center items-center h-fit bg-[--color-surface] shadow-lg '>
          <div className='w-full space-y-4 '>
            <Flex align={'center'} justify={'between'}>
              <Text as='p' size={'4'} className='font-medium'>
                Channel analytics
              </Text>
              <IconButton
                variant='ghost'
                radius='full'
                color='gray'
                onClick={refetchChannelStats}
                disabled={isFetchingChannelStats}
                title='Refresh stats'
              >
                <SymbolIcon className={`${isFetchingChannelStats ? "animate-spin" : ""}`} />
              </IconButton>
            </Flex>
            <Text as='p' size={'2'}>
              Current subscribers
            </Text>
            <Skeleton loading={isLoadingChannelStats} className='w-20'>
              <Text as='p' size={'8'} className='font-medium'>
                {totalSubscribers}
              </Text>
            </Skeleton>
            <Separator size={'4'} />
            <ChannelStats
              totalLikes={totalLikes}
              totalVideos={totalVideos}
              totalViews={totalViews}
              loading={isLoadingChannelStats}
            />
            <Separator size={'4'} />
            <Flex justify={'between'} align={'center'}>
              <Text as='div' >
                <Text as='p' size={'2'} weight={'medium'} mb={'1'}>
                  Top videos
                </Text>
                <Text as='p' size={'1'} color='gray'>
                  Lifetime · Views
                </Text>
              </Text>
              <IconButton
                variant='ghost'
                radius='full'
                color='gray'
                onClick={refetchVideos}
                disabled={isFetchingVideos}
                title='Refresh videos'
              >
                <SymbolIcon className={`${isFetchingVideos ? "animate-spin" : ""}`} />
              </IconButton>
            </Flex>
            <Flex direction={'column'} gap={"2"}>
              {isLoadingVideos ? (
                <Flex direction={'column'} gap={'2'}>
                  {Array.from({ length: 3 }).map((_, idx) => <Skeleton key={idx} className='h-4' />)}
                </Flex>
              ) : hasFetchVideosError ? (
                <QueryErrorHandler error={fetchVideosError} onRetry={refetchVideos} className='mb-4' />
              ) : hasVideos ? (
                channelVideos?.map(video => (
                  <Link
                    key={video._id}
                    to={`/watch/${video._id}`}
                    className='flex items-center justify-between gap-2'
                    title={video.title}
                  >
                    <Text as='p' size={'1'} className='line-clamp-1'>
                      {video.title}
                    </Text>
                    <Text as='span' size={'1'}>{video.views}</Text>
                  </Link>
                ))
              ) : (
                <section className="flex flex-col items-center justify-center">
                  <img src={no_content} alt="no content" className="size-36" />
                  <Text size="1" color='gray'>No content available</Text>
                </section>
              )}

              <div>
                <Button
                  color='gray'
                  radius='full'
                  variant='soft'
                  highContrast
                  className='w-full mt-4'
                  asChild
                >
                  <Link to={`content/videos`}>
                    See all videos
                  </Link>
                </Button>
              </div>
            </Flex>
          </div>

        </div>

        <Flex className={`${showSidebar ? "xl:col-span-2 xl:flex-row" : "md:flex-row md:col-span-2 xl:col-span-1 xl:flex xl:flex-col md:grid-cols-2 md:grid"} flex-col gap-6 h-max`}>

          <div className='flex-1 border border-[--gray-a6]  rounded-3xl p-6 space-y-2 bg-[--color-surface] flex flex-col justify-between shadow-lg '>
            <Flex direction={'column'} gap={'2'}>
              <Flex align={'center'} justify={'between'}>
                <Text as='p' size={'4'} className='font-medium'>
                  Recent subscribers
                </Text>
                <IconButton
                  variant='ghost'
                  radius='full'
                  color='gray'
                  onClick={refetchSubscribers}
                  disabled={isFetchinSubscribers}
                  title='Refresh Subscribers'
                >
                  <SymbolIcon className={`${isFetchinSubscribers ? "animate-spin" : ""}`} />
                </IconButton>
              </Flex>
              <Text as='p' size={'1'} color='gray'>
                Lifetime
              </Text>

              <Flex direction={'column'} gap={'5'} py={'3'}>
                {isLoadingSubscribers ? (
                  Array.from({ length: 3 }).map((_, idx) => < Subscribers key={idx} loading={isLoadingSubscribers} />)
                ) : hasFetchSubscribersError ? (
                  <QueryErrorHandler error={fetchSubscribersError} onRetry={refetchSubscribers} className='mb-4' />
                ) : hasSubscribers ? (
                  subscriberData?.docs.map(subscriber => <Subscribers details={subscriber} key={subscriber._id} />)
                ) : (
                  <section className="flex flex-col items-center justify-center">
                    <img src={no_content} alt="no content" className="size-36" />
                    <Text size="1" color='gray'>No subscribers found</Text>
                  </section>
                )}
              </Flex>
            </Flex>

            <Button
              color='gray'
              radius='full'
              variant='soft'
              highContrast
              className='w-full mt-full'
              onClick={() => setOpenSubscriberDialog(true)}
            >
              See all
            </Button>
          </div>
          <div className='flex-1 border border-[--gray-a6]  rounded-3xl p-6 flex flex-col justify-between bg-[--color-surface] shadow-lg '>
            <Flex direction={'column'} gap={'3'}>

              <Text as='p' size={'4'} className='font-medium'>
                Latest post
              </Text>
              {isLoadingTweet ? (
                <TweetSkeleton />
              ) : hasFetchTweetError ? (
                <QueryErrorHandler error={fetchTweetError} onRetry={refetchTweet} className='mb-4' />
              ) : hasTweet ? (
                <TweetCard tweet={latestTweet} user={user} />
              ) : (
                <section className="flex flex-col items-center justify-center">
                  <img src={no_tweet} alt="no content" className="size-36" />
                  <Text size="1" color='gray'>Create your first tweet to start </Text>
                </section>
              )}
            </Flex>
            <div className=''>
              <Button
                color='gray'
                radius='full'
                variant='soft'
                highContrast
                className='w-full mt-3'
                asChild
              >
                <Link to={`/channel/${user?._id}/tweets`}>
                  Go to Tweets tab
                </Link>
              </Button>
            </div>
          </div>
        </Flex>
      </div >
    </div >
  )
}

export default Dashboard

export function TweetSkeleton() {
  return (
    <div className='space-y-3'>
      <Flex align={'center'} gap={'2'}>
        <Skeleton className='rounded-full size-7' />
        <Skeleton className='w-3/4 h-4' />
      </Flex>
      <Flex direction={'column'} gap={'2'}>
        <Skeleton className='h-5' />
        <Skeleton className='w-3/4 h-5' />
      </Flex>
      <Skeleton className='w-10 h-4' />
    </div>
  )
}

export function TweetCard({ user, tweet }) {
  return (
    <div className='space-y-3'>
      <Flex align={'center'} gap={'2'}>
        <img src={user?.avatar} alt="" className='object-cover object-center rounded-full size-7 aspect-square' />
        <Flex wrap={'wrap'} gapX={'2'}>
          <Text as='span' color='gray' size={'1'}>
            {user?.fullName}
          </Text>
          <Text as='span' color='gray' size={'1'}>
            Mar 21, 2025
          </Text>
        </Flex>
      </Flex>
      <Text as='p' size={'2'} className='break-words whitespace-pre-wrap line-clamp-4'>
        {tweet?.content}
      </Text>
      <Text
        as='span'
        className='flex items-center gap-1'
        size={'1'}
      >
        <ThumbsUpIcon size={16} strokeWidth={1.25} /> {tweet?.likesCount}
      </Text>
    </div>
  )
}

export function Subscribers({ details, loading = false }) {
  const { subscriber = {} } = details || {};
  const { avatar = '', fullName = '', subscribersCount = 0 } = subscriber;

  return (
    <Flex gap={'3'}>
      <Skeleton loading={loading}>
        <Link title={fullName} to={`/channel/${subscriber?._id}`} className='rounded-full size-10 aspect-square'>
          <img src={avatar} alt="" className='object-cover object-center w-full h-full rounded-full' />
        </Link>
      </Skeleton>
      <Flex direction={'column'} className='flex-1'>
        <Skeleton loading={loading} className='w-24 h-5 mb-1'>
          <Link title={fullName} to={`/channel/${subscriber?._id}`} className='text-sm line-clamp-1'>
            {fullName}
          </Link>
        </Skeleton>
        <Skeleton loading={loading} className='w-20 h-4'>
          <Text asChild size={'1'} color='gray'>
            <Link title={fullName} to={`/channel/${subscriber?._id}`}>
              {subscribersCount} subscribers
            </Link>
          </Text>
        </Skeleton>
      </Flex>
    </Flex>
  )
}

function ChannelStats({
  totalLikes,
  totalVideos,
  totalViews,
  loading
}) {
  const stats = {
    Views: totalViews,
    Likes: totalLikes,
    Videos: totalVideos
  };

  return (
    <Flex direction={'column'} gap={'4'}>
      <Text as='div' >
        <Text as='p' size={'2'} weight={'medium'} mb={'1'}>
          Summary
        </Text>
        <Text as='p' size={'1'} color='gray'>
          Lifetime
        </Text>
      </Text>
      {["Views", "Likes", "Videos"].map(item => (
        <Text key={item} as='p' size={'2'} className='flex items-center justify-between'>
          {item}
          <Skeleton width={'40px'} loading={loading}>
            <span>{stats[item]}</span>
          </Skeleton>
        </Text>
      ))}
    </Flex>
  )
}

function Modal({
  open,
  setOpen
}) {
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Edit profile</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Make changes to your profile.
        </Dialog.Description>
        hello
      </Dialog.Content>
    </Dialog.Root>
  )
}