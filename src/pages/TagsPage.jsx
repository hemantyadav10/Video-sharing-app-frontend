import { Separator, Skeleton, Spinner, Text } from '@radix-ui/themes'
import React, { useEffect } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import no_content from '../assets/no_content.svg'
import Container from '../components/Container'
import QueryErrorHandler from '../components/QueryErrorHandler'
import VideoCard from '../components/VideoCard'
import { useGetVideoByTag } from '../lib/queries/videoQueries'
import { useInView } from 'react-intersection-observer'


function TagsPage() {
  const { tag } = useParams()
  const {
    data,
    isFetching,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetVideoByTag(tag)
  const [showMenu] = useOutletContext()
  const { ref, inView } = useInView({
    rootMargin: '350px'
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);



  return (
    <div className='w-full mb-16 sm:mb-0'>
      <div className='p-6 px-4 sm:px-6 lg:px-10 bg-gradient-to-t from-[#111111] from-40%  to-[rgba(0,119,255,0.1)]'>
        <Text
          weight={'medium'}
          color='gray'
          as='span'
          size={'4'}
        >
          TAG
        </Text>
        <Text
          size={'8'}
          as='p'
          weight={'bold'}
        >
          {tag}
        </Text>
        <Text
          weight={'medium'}
          color='blue'
          as='span'
          my={'2'}
          size={'4'}
          className='flex items-center justify-between gap-3 py-1 pr-2 pl-3 text-sm  rounded bg-[#388bfd1a] transition w-max hover:bg-[#3e63dd] hover:text-white'
        >
          #{tag}
        </Text>
        <Skeleton loading={isFetching}>
          <Text
            color='gray'
            size={'2'}
          >
            {data?.data?.totalDocs} videos
          </Text>
        </Skeleton>
      </div>
      <Separator size={'4'} />

      {isError && (
        <div className='border rounded-xl border-[#484848] p-6 pt-0 m-6'>
          <QueryErrorHandler error={error} onRetry={refetch} />
        </div>
      )}

      <Container showMenu={showMenu}>
        {isFetching && !isFetchingNextPage &&
          Array.from({ length: 12 }).fill(1).map((_, i) => (
            <VideoCard key={i} loading={isFetching && !isFetchingNextPage} />
          ))
        }
        {!isError && data?.pages[0]?.data?.totalDocs > 0 &&
          data?.pages.map((page) => (
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

      {!isError && data?.pages[0]?.data?.totalDocs === 0 && (
        <>
          <section className='flex flex-col items-center justify-center'>
            <img
              src={no_content}
              alt="no content"
              className='size-52'
            />
            <Text color='gray' size={'2'}>
              No content available
            </Text>
          </section>
        </>
      )
      }

    </div>
  )
}

export default TagsPage
