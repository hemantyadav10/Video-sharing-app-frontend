import { DotsVerticalIcon, TrashIcon } from '@radix-ui/react-icons'
import {  DropdownMenu, IconButton } from '@radix-ui/themes'
import React from 'react'
import { Link } from 'react-router-dom'

function VideoCard2({ videoNumber = 0 }) {
  return (
    <Link className='flex flex-col w-full gap-2 p-4 hover:bg-[#ddeaf814] rounded-2xl sm:flex-row sm:py-2   active:bg-[#ddeaf81a]'>
      <div className='items-center justify-center hidden text-sm transition-all sm:flex'>
        {videoNumber}
      </div>
      <div className='w-full aspect-video rounded-xl sm:w-48'>
        <img src="https://i.ytimg.com/vi/3BEn2E9PvBM/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBbjWwa0C3myxevI-Q5otqO8wcWxQ" alt="" className='object-cover object-center w-full rounded-xl' />
      </div>
      <div className='flex flex-1 gap-1'>
        <div className='flex-1 '>
          <p title='NextJs auth project series launch video 1 ' className='mb-2 text-base font-medium line-clamp-2 lg:text-sm xl:text-base'>
            NextJs auth project series launch video 1
          </p>
          <p className='text-xs text-[#f1f7feb5]'>
            Chai aur Code • 51K views • 6 months ago
          </p>
        </div>
        <div className='flex items-center justify-center'>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <IconButton radius='full' color='gray' variant='ghost' highContrast >
                <DotsVerticalIcon />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item><TrashIcon /> Remove from playlist</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
    </Link>
  )
}

export default VideoCard2
