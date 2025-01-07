import { Separator, Text } from '@radix-ui/themes'
import React from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import trendingImg from '../assets/animatedTrending.webp'
import shoppingImg from '../assets/animatedShopping.webp'
import musicImg from '../assets/animatedMusic.jpg'
import moviesImg from '../assets/animatedMovies.webp'
import gamingImg from '../assets/animatedGaming.webp'
import sportsImg from '../assets/animatedSports.jpg'
import coursesImg from '../assets/animatedCourse.webp'
import fashionImg from '../assets/animatedFashion.webp'
import podcastImg from '../assets/animatedPodcast.webp'
import { useGetVideosByCategories } from '../lib/queries/videoQueries'
import VideoCard from '../components/VideoCard'
import Container from '../components/Container'
import no_content from '../assets/no_content.svg'


function CategoryPage() {
  const { category } = useParams()
  const [showMenu] = useOutletContext()

  const categories = {
    "trending": trendingImg,
    "shopping": shoppingImg,
    "music": musicImg,
    "movies": moviesImg,
    "gaming": gamingImg,
    "sports": sportsImg,
    "courses": coursesImg,
    "fashion": fashionImg,
    "podcasts": podcastImg
  }
  const { data, isFetching } = useGetVideosByCategories(category)

  return (
    <div className='w-full '>
      <div className='flex items-center gap-4 p-6'>
        {categories[category] &&
          <div className='size-[72px] rounded-full overflow-hidden border border-[#484848]'>
            <img
              src={categories[category]}
              alt="category"
              className='object-cover object-center w-full h-full rounded-full aspect-square'
            />
          </div>

        }
        <Text
          size={'8'}
          as='p'
          className='font-semibold capitalize'
        >
          {category}
        </Text>
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

export default CategoryPage
