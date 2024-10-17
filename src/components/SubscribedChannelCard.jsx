import { Button } from '@radix-ui/themes'
import React from 'react'
import { Link } from 'react-router-dom'

function SubscribedChannelCard() {
  return (
    <div className='flex items-center justify-between w-full max-w-3xl gap-4 mx-auto '>
      <Link to={'/channel/hemant'} className='flex items-center flex-1 gap-4 group' >
        <div className='transition-all max-w-32 min-w-16 group-hover:brightness-75 group-active:brightness-100'>
          <img src="https://yt3.googleusercontent.com/ytc/AIdro_m05oPc8I5nhz_ej6JdKoxA6vglaI76AMqtDELBj1s2o0o=s176-c-k-c0x00ffffff-no-rj-mo" alt="" className='w-full rounded-full aspect-square' />
        </div>
        <div className='flex-1 space-y-2'>
          <p className='text-lg font-medium break-words line-clamp-2'>CodeWithHarry</p>
          <p className='text-xs text-[#f1f7feb5]'>@CodeWithHarry • 6.77M subscribers</p>
        </div>
      </Link>
      <div className='hidden sm:block'>
        <Button radius='full' highContrast  variant='soft'>
          Subscribed
        </Button>
      </div>
    </div>
  )
}

export default SubscribedChannelCard
