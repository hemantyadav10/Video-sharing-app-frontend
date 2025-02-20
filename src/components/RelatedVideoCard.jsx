import { PlayIcon } from '@radix-ui/react-icons'
import { Text } from '@radix-ui/themes'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { formatVideoDuration } from '../utils/formatVideoDuration'
import SaveToPlaylistButton from './SaveToPlaylistButton'

function RelatedVideoCard({ videoData }) {
  const { pathname } = useLocation()
  const currentPlayingVideo = pathname === `/watch/${videoData?._id}`

  return (
    <div className={`flex items-center p-1 transition-all pl-0 group ${currentPlayingVideo ? "bg-[--accent-a3]" : "hover:bg-[--gray-a3]"}`}>
      <div className={`px-1 ${currentPlayingVideo ? "" : "w-[23px]"}`} >
        <PlayIcon color='var(--accent-12)' className={`${currentPlayingVideo ? "" : "hidden"}`} />
      </div>
      <Link
        to={`/watch/${videoData?._id}`}
        className='flex items-start flex-1 gap-2'
      >
        <div className='w-[100px] aspect-video rounded-md relative'>
          <img
            src={videoData?.thumbnail}
            alt=""
            className='object-cover object-center w-full h-full rounded-md'
          />
          <Text
            className='absolute bottom-[2px] right-[2px] p-[2px] px-1 text-xs bg-black/70 text-white font-medium rounded-md'
            as='span'
          >
            {formatVideoDuration(videoData?.duration)}
          </Text>
        </div>
        <div className='flex-1'>
          <Text as='p' size={'2'} weight={'medium'} className='line-clamp-2'>
            {videoData?.title}
          </Text>
          <Text as='p' size={'1'} color='gray' mt={'1'}>
            {videoData?.owner?.fullName}
          </Text>
        </div>
      </Link>
      <div className='flex items-center justify-center invisible px-2 my-auto group-hover:visible'>
        <SaveToPlaylistButton videoData={videoData} />
      </div>
    </div>
  )
}

export default RelatedVideoCard