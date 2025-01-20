import React, { useEffect } from 'react'
import SimilarVideosCard from './SimilarVideosCard'
import { useGetRelatedVideos } from '../lib/queries/videoQueries'
import { Spinner, Text } from '@radix-ui/themes'
import { useInView } from 'react-intersection-observer'
import QueryErrorHandler from './QueryErrorHandler'

function RelatedVideoSection({ videoId }) {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, isError, error, refetch } = useGetRelatedVideos(videoId)

  const { inView, ref } = useInView()

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);


  return (
    <div className='lg:w-[384px] xl:w-[408px] space-y-4 px-4 sm:px-0'>
      <Spinner loading={isLoading} className='h-6 mx-auto' />
      {isError &&
        < QueryErrorHandler error={error} onRetry={refetch} />
      }
      {!isLoading && !isError && data?.pages?.length > 0 && (
        data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.data.totalDocs > 0
              ? (
                page.data.docs.map((video) => (
                  <SimilarVideosCard video={video} key={video?._id} />
                ))
              )
              : <Text as='p' size={'2'} align={'center'} >No related videos found.</Text>
            }
          </React.Fragment>
        ))
      )
      }
      {isFetchingNextPage && <div className='my-2'><Spinner className='h-6 mx-auto' /></div>}
      {(hasNextPage) && <div ref={ref}></div>}
    </div >
  )
}

export default RelatedVideoSection
