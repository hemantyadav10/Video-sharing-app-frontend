import { DotsVerticalIcon } from '@radix-ui/react-icons'
import { IconButton, Text } from '@radix-ui/themes'
import React from 'react'
import { Link } from 'react-router-dom'
import { formatVideoDuration } from '../utils/formatVideoDuration'
import { timeAgo } from '../utils/formatTimeAgo'
import SaveToPlaylistButton from './SaveToPlaylistButton'

function SimilarVideosCard({ video }) {
  return (
    <div className='flex rounded-xl'>
      <Link to={`/watch/${video?._id}`} className='flex gap-2'>
        <div className='relative'>
          <img
            src={video?.thumbnail}
            alt=""
            className='object-cover object-center w-40 rounded-lg aspect-video'
          />
          <Text
            className='absolute bottom-[2px] right-[2px] p-[2px] px-1 text-xs bg-black/70 font-medium rounded-md'
            as='span'
          >
            {formatVideoDuration(video?.duration)}
          </Text>
        </div>

        <div className='flex-1'>
          <Text
            as='p'
            weight={'medium'}
            size={'2'}
            mb={'1'}
            className='line-clamp-2'
            title={video?.title}
          >
            {video?.title}
          </Text>
          <Text
            as='p'
            size={'1'}
            color='gray'
            title={video?.owner.fullName}
          >
            {video?.owner.fullName}
          </Text>
          <Text
            size={'1'}
            color='gray'
            as='p'
            className='mt-[2px]'
          >
            {video?.views} views • {timeAgo(video?.createdAt)}
          </Text>
        </div>

      </Link>
      <div className='pl-1'>
        <SaveToPlaylistButton videoData={video} />
      </div>
    </div>
  )
}

export default SimilarVideosCard
