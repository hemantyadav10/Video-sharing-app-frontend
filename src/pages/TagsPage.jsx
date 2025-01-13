import { Separator, Skeleton, Text } from '@radix-ui/themes'
import { Hash } from 'lucide-react'
import React from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import { useGetVideoByTag } from '../lib/queries/videoQueries'
import no_content from '../assets/no_content.svg'
import VideoCard from '../components/VideoCard'
import Container from '../components/Container'


function TagsPage() {
  const { tag } = useParams()
  const { data, isFetching } = useGetVideoByTag(tag)
  const [showMenu] = useOutletContext()

  console.log(data)


  return (
    <div className='w-full'>
      <div className='p-6'>
        <Text
          size={'8'}
          as='p'
          className='flex items-center font-semibold'
        >
          <Hash size={'32px'} />{tag}
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
