import { HomeIcon, PlusCircledIcon, VideoIcon } from '@radix-ui/react-icons'
import { Avatar, IconButton } from '@radix-ui/themes'
import React from 'react'

function BottomBar() {

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-[#0c0c0d]/80 grid grid-cols-4 py-2 justify-between items-center backdrop-blur-md border-t border-[#484848] sm:hidden h-16 z-50'>
      <div className='flex flex-col items-center gap-1 text-center cols-span-1'>
        <IconButton variant='ghost' color='gray' radius='full' highContrast>
          <HomeIcon height='20' width='20' />
        </IconButton>
        <span className='text-xs'>Home</span>
      </div>
      <div className='flex flex-col items-center gap-1 text-center cols-span-1'>
        <IconButton variant='ghost' color='gray' radius='full' highContrast>
          <PlusCircledIcon height='20' width='20' />
        </IconButton>
        <span className='text-xs'>Create</span>
      </div>
      <div className='flex flex-col items-center gap-1 text-center cols-span-1'>
        <IconButton variant='ghost' color='gray' radius='full' highContrast>
          <VideoIcon height='20' width='20' />
        </IconButton>
        <span className='text-xs'>Subscriptions</span>
      </div>
      <div className='flex flex-col items-center gap-1 text-center cols-span-1'>
        <IconButton variant='ghost' color='gray' radius='full'>
          <Avatar
            src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
            fallback="A"
            size={'1'}
          />
        </IconButton>
        <span className='text-xs'>You</span>
      </div>
    </div>
  )
}

export default BottomBar
