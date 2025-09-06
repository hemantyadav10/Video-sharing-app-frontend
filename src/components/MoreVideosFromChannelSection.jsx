import { ScrollArea, Separator, Text } from '@radix-ui/themes'
import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import Loader from './Loader'
import RelatedVideoCard from './RelatedVideoCard'

function MoreVideosFromChannelSection({ channelName, videoData, isFetchingNextPage, hasNextPage, fetchNextPage }) {
  const { inView, ref } = useInView({
    threshold: 1
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  return (
    <div>
      <section className='border-y sm:border lg:w-[384px] xl:w-[408px] sm:rounded-xl border-[--gray-a6] overflow-hidden'>
        <div className='bg-[--gray-a3] p-4 sm:rounded-t-xl border-b border-[--gray-a6]'>
          <Text size={'5'} weight={'medium'} className='line-clamp-1'>
            More from {channelName}
          </Text>
        </div>
        <ScrollArea type="hover" scrollbars="vertical" style={{ maxHeight:388 }} >
          <div>
            {videoData?.pages?.length > 0 && (
              videoData?.pages.map((page, pageIndex) => (
                <React.Fragment key={pageIndex}>
                  {page.data.totalDocs > 0 && (
                    page.data.docs.map((video) => (
                      <RelatedVideoCard
                        key={video._id}
                        videoData={video}
                      />
                    ))
                  )}
                </React.Fragment>
              ))
            )}
            {isFetchingNextPage && <div className='my-2'><Loader center className='my-4' /></div>}
            {(hasNextPage && !isFetchingNextPage) && <div className='h-6 ' ref={ref}></div>}
          </div>

        </ScrollArea>
      </section>
      <Separator size={'4'} mt={'5'} className='hidden sm:block' />
    </div>
  )
}

export default MoreVideosFromChannelSection
