import React, { useEffect } from 'react'
import VideoCard from '../components/VideoCard'
import { Link, useOutletContext } from 'react-router-dom'
import Container from '../components/Container'
import { Button, Spinner, Text } from '@radix-ui/themes'
import { useFetchSubscribedChannelVideos } from '../lib/queries/subscriptionQueries'
import { useAuth } from '../context/authContext'
import SignInPrompt from '../components/SignInPrompt '
import SubscriptionIcon from '../assets/SubscriptionIcon'
import no_content from '../assets/no_content.svg'
import QueryErrorHandler from '../components/QueryErrorHandler'
import { useInView } from 'react-intersection-observer'


function SubscriptionVideos() {
  const [showMenu] = useOutletContext()
  const { isAuthenticated, user } = useAuth()
  const {
    data,
    isFetching,
    error,
    isError,
    refetch,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useFetchSubscribedChannelVideos(user?._id)
  
  const { ref, inView } = useInView({
    rootMargin: '350px'
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  return (
    <div className='w-full py-6 mb-16 sm:mb-0'>
      {!isAuthenticated && <>
        <SignInPrompt
          Icon={SubscriptionIcon}
          title="Don't miss new videos"
          description='Sign in to see updates from your favorite channels'
        />
      </>}
      {isAuthenticated && <>
        <div className='flex items-center justify-between px-4 md:px-6 lg:px-10'>
          <span className='text-xl font-semibold'>Latest</span>
          <Link to={'/subscriptions/channels'}>
            <Button size={'2'} radius='full' className='font-medium' variant='ghost'>Manage</Button>
          </Link>
        </div>
        {isError && (
          <QueryErrorHandler error={error} onRetry={refetch} />
        )}
        <Container showMenu={showMenu}>
        {isFetching && !isFetchingNextPage &&
          Array.from({ length: 12 }).fill(1).map((_, i) => (
            <VideoCard key={i} loading={isFetching && !isFetchingNextPage} />
          ))
        }
          {!isError && (
            data?.pages.map((page) => (
              page.data.docs.map(video =>
                <VideoCard
                  key={video._id}
                  videoData={video}
                  loading={isFetching && !isFetchingNextPage}
                />
              )
            ))
          )}
        </Container>
        {isFetchingNextPage && <Spinner className='mx-auto my-4 size-6' />}
        {(hasNextPage && !isFetchingNextPage) && <div ref={ref}></div>}
        {!isError && data?.pages[0]?.data?.totalDocs === 0 && (
          <section className='flex flex-col items-center justify-center flex-1'>
            <img
              src={no_content}
              alt="no content"
              className='size-52'
            />
            <Text color='gray' size={'2'}>
              No content available
            </Text>
          </section>
        )}
      </>}
    </div>
  )
}

export default SubscriptionVideos
