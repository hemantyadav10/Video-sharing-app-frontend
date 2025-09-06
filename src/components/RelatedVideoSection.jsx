import { Text } from '@radix-ui/themes'
import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useGetRelatedVideos } from '../lib/queries/videoQueries'
import Loader from './Loader'
import QueryErrorHandler from './QueryErrorHandler'
import SimilarVideosCard from './SimilarVideosCard'

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
      {isLoading && <Loader center />}
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
      {isFetchingNextPage && <div className='my-2'><Loader center /></div>}
      {(hasNextPage) && <div ref={ref}></div>}
    </div >
  )
}

export default RelatedVideoSection
