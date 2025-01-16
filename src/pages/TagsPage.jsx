import { Separator, Skeleton, Text } from '@radix-ui/themes'
import React from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import no_content from '../assets/no_content.svg'
import Container from '../components/Container'
import QueryErrorHandler from '../components/QueryErrorHandler'
import VideoCard from '../components/VideoCard'
import { useGetVideoByTag } from '../lib/queries/videoQueries'


function TagsPage() {
  const { tag } = useParams()
  const { data, isFetching, isError, error, refetch } = useGetVideoByTag(tag)
  const [showMenu] = useOutletContext()

  return (
    <div className='w-full'>
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
          className='capitalize'
        >
          {tag?.split('-').join(' ')}
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

      {isError && <QueryErrorHandler error={error} onRetry={refetch} />}

      <Container showMenu={showMenu}>
        {isFetching &&
          Array.from({ length: 12 }).fill(1).map((_, i) => (
            <VideoCard key={i} loading={isFetching} />
          ))
        }
        {data?.data?.docs.length > 0 &&
          data?.data?.docs?.map(video =>
            <VideoCard
              key={video._id}
              videoData={video}
              loading={isFetching}
            />
          )
        }
      </Container>
      {
        data?.data?.docs.length === 0 && (
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
