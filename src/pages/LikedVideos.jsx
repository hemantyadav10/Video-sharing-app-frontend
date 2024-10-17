import { Avatar } from '@radix-ui/themes'
import React from 'react'
import VideoCard2 from '../components/VideoCard2'

function LikedVideos() {
  return (
    <div className="flex flex-col w-full mb-16 lg:flex-row lg:p-6">
      <div className="relative bg-cover bg-center bg-[url('https://i.ytimg.com/vi/trnim5UtK10/hqdefault.jpg?sqp=-oaymwEcCPYBEIoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCdckLy-raXNyXX0wmQcUf6YsFcBg')] p-6 overflow-hidden lg:rounded-t-2xl lg:h-[calc(100vh-122px)] lg:sticky lg:top-[88px]  md:px-6" >
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/20 to-[#111113] backdrop-blur-xl"></div>
        <div className="relative z-10 flex flex-col w-full gap-6 text-xs md:flex-row md:items-center lg:flex-col lg:w-80">
          <div className='flex items-center justify-center w-full '>
            <img
              src="https://i.ytimg.com/vi/trnim5UtK10/hqdefault.jpg?sqp=-oaymwEcCPYBEIoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCdckLy-raXNyXX0wmQcUf6YsFcBg"
              alt=""
              className="object-cover object-center w-full max-w-sm rounded-xl aspect-video"
            />
          </div>
          <div className='flex flex-col w-full gap-6 text-white '>
            <p className='text-2xl font-bold '>
              Liked Videos
            </p>
            <div className='space-y-2'>
              <p className='text-sm font-medium'>Hemant Yadav</p>
              <p className=''>
                444 videos • Updated today
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col flex-1 py-4 sm:px-2 lg:py-0'>

        {Array.from({ length: 10 }).fill(1).map((_, i) => (
          <VideoCard2 key={i} videoNumber={i + 1} />
        ))}
        <hr class="border-t border-[#484848]" />

      </div>
    </div>
  )

}

export default LikedVideos
