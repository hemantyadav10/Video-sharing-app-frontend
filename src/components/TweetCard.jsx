import { BookmarkIcon, DotsVerticalIcon, HeartFilledIcon, HeartIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Avatar, Button, DropdownMenu, IconButton, Text } from '@radix-ui/themes'
import React from 'react'

function TweetCard() {
  return (
    <div className='flex gap-3 pb-4 border-b border-[#484848]'>
      <Avatar
        radius='full'
        src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
        fallback="A"
      />
      <div className='w-full'>
        <div className='flex items-center justify-between '>
          <div>
            <Text as='span' size={'2'} mr={'3'}>John Doe</Text>
            <Text as='span' size={'1'} color='gray'>Just now</Text>
          </div>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <IconButton
                variant='ghost'
                highContrast
                color='gray'
                radius='full'
                size={'2'}
              >
                <DotsVerticalIcon  />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content variant='soft'>
              <DropdownMenu.Item>
                <Pencil1Icon /> Edit
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <TrashIcon /> Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>

        <Text as='p' size={'2'} className='pr-4 '>First tweet from this channel sdhfkhsdkjfhksjjk</Text>
        <Button variant='ghost' highContrast color='red' size={'1'} mt='2'>
          <HeartIcon /> 1.3K
        </Button>
      </div>

    </div>
  )
}

export default TweetCard
