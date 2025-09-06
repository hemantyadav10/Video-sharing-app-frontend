import { Button, Flex, Popover, Skeleton, Text } from '@radix-ui/themes'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useInView } from 'react-intersection-observer'
import { Link, useParams } from 'react-router-dom'
import ThumbsUp from '../assets/ThumbsUpIcon'
import ThumbsUpSolidIcon from '../assets/ThumbsUpSolidIcon'
import CommentSection from '../components/CommentSection'
import Loader from '../components/Loader'
import MoreVideosFromChannelSection from '../components/MoreVideosFromChannelSection'
import QueryErrorHandler from '../components/QueryErrorHandler'
import RelatedVideoSection from '../components/RelatedVideoSection'
import SaveToPlaylistButton from '../components/SaveToPlaylistButton'
import SubscriptionButton from '../components/SubscriptionButton'
import { useAuth } from '../context/authContext'
import { useReadMore } from '../hooks/useReadMore'
import { useToggleVideoLike } from '../lib/queries/likeQueries'
import { useFetchUserChannelInfo, useFetchUserVideos } from '../lib/queries/userQueries'
import { useFetchVideoById } from '../lib/queries/videoQueries'

function VideoPage() {
  const { videoId } = useParams()
  const { isAuthenticated, user } = useAuth()
  const { data: video, isLoading, isError, error, refetch } = useFetchVideoById(videoId, user?._id)
  const { data: channelInfo, isLoading: loadingProfileInfo, refetch: refetchUserInfo } = useFetchUserChannelInfo(video?.data?.owner._id, user?._id, !!video?.data?._id)

  const { mutate: toggleLike, isPending } = useToggleVideoLike(videoId, user?._id)
  const [loadCommentSection, setLoadCommentSection] = useState(false)
  const { inView, ref } = useInView({
    rootMargin: '50px',
    triggerOnce: true
  })
  const { data: videoData, isLoading: loadingVideos, isFetchingNextPage, hasNextPage, fetchNextPage } = useFetchUserVideos(video?.data?.owner._id, '', 7);
  const {
    contentRef,
    isExpanded,
    isLongContent,
    toggleExpand,
  } = useReadMore(video?.data.description)

  useEffect(() => {
    if (inView) {
      setLoadCommentSection(true)
    }
  }, [inView])


  const handleToggleLike = async () => {
    if (isAuthenticated) {
      toggleLike(video?.data, {
        onError: (error) => {
          const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again later';
          toast.error(errorMessage);
        }
      })
    }
  }

  return (
    <div className='flex flex-col w-full gap-4 mb-32 lg:gap-6 sm:p-6 md:px-8 xl:px-16 2xl:px-24 lg:flex-row lg:justify-center lg:items-start'>
      <div className='flex-1 max-w-screen-2xl'>
        {isError && (
          <div className='w-full border aspect-video border-[--gray-a6] rounded-xl flex items-center justify-center'>
            <QueryErrorHandler onRetry={refetch} error={error} />
          </div>
        )}
        {!isError && <div >
          <Skeleton loading={isLoading}>
            <div className='w-full overflow-hidden sm:rounded-xl aspect-video'>
              <video key={video?.data._id} controls className='object-contain object-center w-full h-full'>
                <source src={video?.data.videoFile} />
              </video>
            </div>
          </Skeleton>
          <div className='w-full p-3 sm:p-6 sm:mt-4 space-y-3 sm:border rounded-xl border-[--gray-a6]'>
            <Skeleton loading={isLoading} height={'28px'} className='w-3/4'>
              <p className='font-semibold sm:text-xl'>
                {video?.data.title}
              </p>
            </Skeleton>
            <div className='flex flex-col gap-3 sm:flex-row sm:justify-between'>
              <div className='flex items-center justify-between gap-6'>
                <div
                  to={`/channel/${channelInfo?.data?._id}`}
                  className='flex items-center gap-3'
                >
                  <Skeleton
                    loading={isLoading || loadingProfileInfo}
                    className='rounded-full'>
                    <Link
                      to={`/channel/${channelInfo?.data?._id}`}
                    >
                      <img
                        src={channelInfo?.data?.avatar}
                        alt=""
                        className='object-cover object-center rounded-full size-10'
                      />
                    </Link>
                  </Skeleton>
                  <div>
                    <Text as='p' >
                      <Skeleton loading={isLoading || loadingProfileInfo} mb={'1'} className='h-4 min-w-28'>
                        <Link
                          to={`/channel/${channelInfo?.data?._id}`}
                          className='text-sm font-medium sm:text-base'
                        >
                          {channelInfo?.data?.username}
                        </Link>
                      </Skeleton>
                    </Text>
                    <Text as='p' color='gray' size={'1'}>
                      <Skeleton loading={isLoading || loadingProfileInfo}>
                        {channelInfo?.data?.subscribersCount} subscribers
                      </Skeleton>
                    </Text>
                  </div>
                </div>
                {isAuthenticated ?
                  (user?._id === video?.data.owner._id ?
                    <Button
                      radius='full'
                      variant='soft'
                      highContrast
                      asChild
                    >
                      <Link
                        to={'/dashboard'}
                      >
                        Edit video
                      </Link>
                    </Button> :
                    <Skeleton loading={isLoading || loadingProfileInfo}>
                      <SubscriptionButton
                        userId={channelInfo?.data?._id}
                        subscribed={channelInfo?.data?.isSubscribed}
                      />
                    </Skeleton>
                  ) :
                  <Popover.Root >
                    <Skeleton loading={isLoading || loadingProfileInfo}>
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

              </div>
              <div className='flex items-center gap-3 rounded-full '>
                <Skeleton loading={isLoading}>
                  <Button
                    onClick={handleToggleLike}
                    variant='soft'
                    color='gray'
                    highContrast
                    radius='full'
                    disabled={isPending}
                    className='group tabular-nums text-[--gray-12]'
                  >
                    {video?.data.isLiked
                      ? <ThumbsUpSolidIcon className='size-[20px]' />
                      : <span className='transition-all group-active:scale-125 group-active:-rotate-[15deg]'><ThumbsUp className='size-[20px]' /></span>
                    } {video?.data.likesCount || 0}
                  </Button>
                </Skeleton>
                {/* menu button - save to playlist */}
                <div className='ml-auto sm:ml-0'>
                  {!isLoading && video && <SaveToPlaylistButton
                    videoData={video?.data}
                  />}
                </div>
              </div>
            </div>
            <Skeleton loading={isLoading}>
              <div className='p-3 text-sm  rounded-xl bg-[--gray-a3] space-y-1 min-h-12'>
                <div className='flex gap-2 font-medium'>
                  <p>
                    {video?.data.views} views
                  </p>
                  {new Date(video?.data.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                  <Link to={`/category/${video?.data.category}`}>
                    <Text
                      color='gray'
                      className='font-semibold capitalize hover:underline'
                    >
                      {video?.data.category}
                    </Text>
                  </Link>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {video?.data.tags && video?.data.tags.length > 0 && video.data.tags.map((tag, i) => (
                    <Link
                      to={`/hashtag/${tag}`}
                      key={i}
                    >
                      <Text
                        color='blue'
                        size={'2'}
                        className='hover:underline'
                      >
                        #{tag}
                      </Text>
                    </Link>
                  ))}
                </div>
                <p
                  ref={contentRef}
                  className={`break-words whitespace-pre-wrap  ${isExpanded ? "" : "line-clamp-2"}`}
                >
                  {video?.data.description}
                </p>
                {isLongContent &&
                  <Button
                    variant='ghost'
                    color='blue'
                    className='font-medium'
                    radius='full'
                    onClick={() => toggleExpand()}
                  >
                    {isExpanded ? "Show less" : "Show more"}
                  </Button>
                }
              </div>
            </Skeleton>
          </div>

        </div >}
        <div ref={ref}>
          {loadCommentSection &&
            < CommentSection hidden videoId={videoId} ownerId={video?.data?.owner._id} />
          }
        </div>

      </div>
      <div className='space-y-6'>
        {
          !video?.data.owner._id
            ? <div className='lg:w-full lg:max-w-sm xl:max-w-[408px]'></div>
            : loadingVideos
              ?
              <div className='lg:w-full lg:max-w-sm xl:max-w-[408px]'>
                <Loader center/>
              </div>
              : videoData?.pages[0]?.data.totalDocs > 1
              && <MoreVideosFromChannelSection
                channelName={video?.data.owner.fullName}
                videoData={videoData}
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
              />
        }
        <RelatedVideoSection videoId={videoId} />
      </div>
    </div >
  )
}

export default VideoPage
