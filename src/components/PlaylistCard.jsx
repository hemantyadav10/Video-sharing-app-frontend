import { AspectRatio, Text } from '@radix-ui/themes'
import React from 'react'
import PlaylistIcon from '../assets/PlaylistIcon'
import { Link } from 'react-router-dom'

function PlaylistCard() {
  return (
    <div className='space-y-3'>
      <Link to={'/playlist/123'} className='relative aspect-video'>
        <AspectRatio
          ratio={16 / 9}
          className='z-[3]'>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSunHvubl49m22PUEi0E3zIQLxTKR7bReibzQ&s"
            alt="A house in a forest"
            className='object-cover w-full h-full border-t border-[#111113] rounded-xl'
          />
        </ AspectRatio>
        <div className='absolute bottom-0 z-[2] left-2 right-2 h-[calc(100%+4px)] bg-gray-400 border rounded-xl border-[#111113]'></div>
        <div className='absolute bottom-0 z-[1] left-4 right-4 bg-gray-600 h-[calc(100%+8px)] rounded-xl border border-[#111113]'></div>
        <span className='absolute bottom-2 text-xs font-medium bg-black/70 z-[4] right-2 px-1 py-[2px] rounded-sm flex gap-[2px] items-center'> <PlaylistIcon />74 videos</span>
      </Link>
      <p className='text-sm font-medium'>Playlist Name</p>
    </div>
  )
}

export default PlaylistCard
