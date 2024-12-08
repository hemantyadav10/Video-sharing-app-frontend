import { Avatar, Skeleton, Spinner, Text } from '@radix-ui/themes'
import React from 'react'
import VideoCard2 from '../components/VideoCard2'
import { useGetUserLikedVideos, useToggleVideoLike } from '../lib/queries/likeQueries'
import { timeAgo } from '../utils/formatTimeAgo'
import { useAuth } from '../context/authContext'
import { PlayIcon } from '@radix-ui/react-icons'
import VideoIcon from '../assets/VideoIcon'
import NoContent from '../components/NoContent'

function LikedVideos() {
  const { user, isAuthenticated } = useAuth()
  const { data, isLoading } = useGetUserLikedVideos(user?._id)
  console.log(data)

  // if (!data?.data.length) return <>No videos</>

  return (
    <div className="flex flex-col w-full mb-16 lg:flex-row lg:p-6">
      {isAuthenticated && <>
        <Skeleton loading={isLoading}>
          <div className="relative  p-6 overflow-hidden lg:rounded-t-2xl lg:h-[calc(100vh-122px)] lg:sticky lg:top-[88px] md:px-6"
            style={{
              backgroundImage: `url(${data?.data[0]?.video.thumbnail || ''})`,
              backgroundPosition: "center",
              backgroundRepeat: 'no-repeat',
              backgroundSize: "cover",
            }}>
            <div className=" absolute inset-0 z-0 bg-gradient-to-b from-white/20 to-[#111113] backdrop-blur-xl"></div>
            <div className="relative z-10 flex flex-col w-full gap-6 text-xs md:flex-row md:items-center lg:flex-col lg:w-80">
              {
                data?.data.length > 0 &&
                <div className='flex items-center justify-center w-full '>
                  <img

                    src={data?.data[0]?.video.thumbnail || ''}
                    alt=""
                    className="object-cover object-center w-full max-w-sm rounded-xl aspect-video"
                  />
                </div>
              }

              <div className='flex flex-col w-full gap-6 text-white '>
                <p className='text-2xl font-bold '>
                  Liked Videos
                </p>
                <div className='space-y-2'>
                  <p className='text-sm font-medium capitalize'>{user?.fullName}</p>
                  <p className=''>
                    {data?.data.length} videos {data?.data.length > 0 ? `• Updated ${timeAgo(data?.data[0]?.createdAt)}` : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Skeleton>
        <div className='flex flex-col flex-1 py-4 sm:px-2 lg:py-0'>
          {data?.data.length === 0 && <NoContent />}
          <Spinner loading={isLoading} className='h-6 mx-auto' />
          {data?.data.map((likedVideo, i) => (
            <VideoCard2
              key={i}
              videoNumber={i + 1}
              video={likedVideo.video}
              playlistOwnerId={user?._id}
              removeType={'like'}
              removeContent='Remove from Liked videos'
            />
          ))}
          <hr hidden={data?.data.length === 0 || isLoading} className="border-t border-[#484848]" />

        </div>
      </>
      }
    </div>
  )

}

export default LikedVideos
