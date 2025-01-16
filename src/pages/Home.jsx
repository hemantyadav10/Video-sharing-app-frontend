import { Spinner } from '@radix-ui/themes'
import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useOutletContext } from 'react-router-dom'
import Container from '../components/Container'
import QueryErrorHandler from '../components/QueryErrorHandler'
import VideoCard from '../components/VideoCard'
import { useFetchAllVideos } from '../lib/queries/videoQueries'

function Home() {
  const [showMenu] = useOutletContext()
  const { data, isFetching, error, fetchNextPage, hasNextPage, isFetchingNextPage, isError, refetch } = useFetchAllVideos(12)
  const { ref, inView } = useInView({
    rootMargin: '50px'
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  if (isError) {
    return <QueryErrorHandler error={error} onRetry={refetch} />;
  }

  return (
    <div className='flex-1 mb-16 sm:mb-16'>
      <Container showMenu={showMenu}>
        {isFetching && !isFetchingNextPage &&
          Array.from({ length: 12 }).fill(1).map((_, i) => (
            <VideoCard key={i} loading={isFetching && !isFetchingNextPage} />
          ))
        }
        {
          data?.pages.map((page, pageIndex) => (
            page.data.docs.map(video =>
              <VideoCard
                key={video._id}
                videoData={video}
                loading={isFetching && !isFetchingNextPage}
              />
            )
          ))
        }
      </Container>
      {isFetchingNextPage && <Spinner className='mx-auto my-4 size-6' />}
      {(hasNextPage && !isFetchingNextPage) && <div ref={ref}></div>}
    </div>
  )
}

export default Home
