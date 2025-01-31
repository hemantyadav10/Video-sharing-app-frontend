import { ScrollArea, Separator, Spinner, Text } from '@radix-ui/themes'
import React, { useEffect } from 'react'
import RelatedVideoCard from './RelatedVideoCard'
import { useInView } from 'react-intersection-observer'

function MoreVideosFromChannelSection({ channelName, videoData, isFetchingNextPage, hasNextPage, fetchNextPage }) {
  const { inView, ref } = useInView({
    rootMargin: '50px',
    triggerOnce: true
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  return (
    <div>
      <section className='border-y sm:border lg:w-[384px] xl:w-[408px] sm:rounded-xl border-[#484848] overflow-hidden'>
        <div className='bg-[#ddeaf814] p-4 sm:rounded-t-xl border-b border-[#484848]'>
          <Text size={'5'} weight={'medium'} className='line-clamp-1'>
            More from {channelName}
          </Text>
        </div>
        <ScrollArea type="hover" scrollbars="vertical" style={{ maxHeight: 408 }} size={'2'} >
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
            {isFetchingNextPage && <div className='my-2'><Spinner className='h-6 mx-auto' /></div>}
            {(hasNextPage) && <div ref={ref}></div>}
          </div>

        </ScrollArea>
      </section>
      <Separator size={'4'} mt={'5'} className='hidden sm:block'/>
    </div>
  )
}

export default MoreVideosFromChannelSection
