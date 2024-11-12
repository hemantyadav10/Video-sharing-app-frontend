import { AspectRatio, Skeleton, Text } from '@radix-ui/themes'
import React from 'react'
import PlaylistIcon from '../assets/PlaylistIcon'
import { Link } from 'react-router-dom'
import noThumbnail from '../assets/noThumbnail.webp'
import { timeAgo } from '../utils/formatTimeAgo'

function PlaylistCard({
  playlistData,
  loading
}) {
  return (
    <Skeleton loading={loading} className='border rounded-xl'>
      <Link to={`/playlist/${playlistData?._id}`} className='space-y-2 '>
        <div className='relative aspect-video' title={playlistData?.name || ''}>
          <AspectRatio
            ratio={16 / 9}
            className='z-[3]'>
            <img
              src={playlistData?.thumbnail || noThumbnail}
              alt="A house in a forest"
              className='object-cover object-center w-full h-full border-t border-[#111113] rounded-xl'
            />
          </ AspectRatio>
          <div className='absolute bottom-0 z-[2] left-2 right-2 h-[calc(100%+4px)] bg-gray-400 border rounded-xl border-[#111113]'></div>
          <div className='absolute bottom-0 z-[1] left-4 right-4 bg-gray-600 h-[calc(100%+8px)] rounded-xl border border-[#111113]'></div>
          <span className='absolute bottom-2 text-xs font-medium bg-black/70 z-[4] right-2 px-1 py-[2px] rounded-sm flex gap-[2px] items-center'> <PlaylistIcon />{playlistData?.totalVideos} videos</span>
        </div>
        <p className='text-sm font-medium line-clamp-2'>
          {playlistData?.name}
        </p>
        <Text size={'1'} color='gray'>
          {`Updated ${timeAgo(playlistData?.updatedAt)}`}
        </Text>
      </Link>
    </Skeleton>
  )
}

export default PlaylistCard
