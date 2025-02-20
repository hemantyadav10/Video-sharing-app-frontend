import { Spinner, Text } from '@radix-ui/themes'
import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import no_content from '../assets/no_content.svg'
import QueryErrorHandler from '../components/QueryErrorHandler'
import SubscribedChannelCard from '../components/SubscribedChannelCard'
import { useAuth } from '../context/authContext'
import { useFetchSubcribedChannels } from '../lib/queries/subscriptionQueries'


function SubscribedChannels() {
  const { user, isAuthenticated } = useAuth()
  const {
    data,
    isFetching,
    isError,
    refetch,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useFetchSubcribedChannels(user?._id)
  const { ref, inView } = useInView({
    rootMargin: '200px'
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  return (
    <div className='w-full p-8 space-y-10'>
      <h1 className='max-w-3xl mx-auto text-3xl font-semibold '>All subscriptions</h1>
      <div className='flex flex-col gap-8 '>
        {isError && (
          <QueryErrorHandler error={error} onRetry={refetch} />
        )}
        {isFetching && !isFetchingNextPage &&
          Array.from({ length: 3 }).fill(1).map((_, i) => (
            <SubscribedChannelCard
              key={i}
              loading={isFetching && !isFetchingNextPage}
            />
          ))
        }
        {!isError && !isFetching && (data?.pages[0]?.data?.totalDocs > 0
          ? (
            data?.pages.map(page => (
              page.data.docs.map(subscription => (
                <SubscribedChannelCard
                  key={subscription.channel._id}
                  channel={subscription.channel}
                  loading={isFetching && !isFetchingNextPage}
                />
              ))
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <img
                src={no_content}
                alt="No Subscriptions"
                className="w-48 h-48 mb-6"
              />
              <Text as='p' size={'4'}>
                You're not subscribed to any channels yet!
              </Text>
              <Text as='p' mt={'2'} size={'1'} color='gray'>
                Explore amazing content and subscribe to your favorite channels.
              </Text>
            </div>
          )
        )
        }
        {isFetchingNextPage && <Spinner className='mx-auto my-4 size-6' />}
        {(hasNextPage && !isFetchingNextPage) && <div ref={ref}></div>}

      </div>
    </div>
  )
}

export default SubscribedChannels
