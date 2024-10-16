import { BookmarkIcon, DotsVerticalIcon } from '@radix-ui/react-icons'
import { AspectRatio, Avatar, DropdownMenu, Flex, IconButton, Text } from '@radix-ui/themes'
import React from 'react'

function VideoCard() {
  return (
    <div className='flex flex-col gap-4 sm:mb-4 sm:rounded-xl'>
      <AspectRatio
        ratio={16 / 9}
        className='relative'>
        <img
          src="https://images.unsplash.com/photo-1479030160180-b1860951d696?&auto=format&fit=crop&w=1200&q=80"
          alt="A house in a forest"
          className='object-cover w-full h-full sm:rounded-xl'
        />
        <Text
          className='absolute bottom-2 right-2 p-[2px] px-1 text-xs bg-black/70 font-medium rounded-md'
          as='span'
        >
          19:21
        </Text>
      </AspectRatio>
      <Flex
        gapX='3'
        className='relative px-2 sm:px-0'
      >
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton
              variant='ghost'
              className='absolute rounded-full sm:right-0 top-1 right-3'
              highContrast
              color='gray'
            >
              <DotsVerticalIcon width="18" height="18" />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content variant='soft'>
            <DropdownMenu.Item>
              <BookmarkIcon /> Save to Playlist
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        <Avatar
          radius='full'
          size={'3'}
          src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
          fallback="A"
        />
        <Flex
          direction={'column'}
          gapY={'1'}
        >
          <Text
            as='p'
            weight={'medium'}
            size={'2'}
            className='pr-8 sm:pr-6 line-clamp-2'
          >
            Exploring the Hidden Gems of Paris: A Local's Guide
          </Text>
          <Text
            as='p'
            size={'2'}
            color='gray'
          >
            Jane Doe
          </Text>
          <Flex gap={'2'} align={'center'}>
            <Text as='span' color='gray' size={'1'} >151K views</Text>
            <Text as='span' color='gray' size={'1'} >•</Text>
            <Text as='span' color='gray' size={'1'} >1 year ago</Text>
          </Flex>
        </Flex>
      </Flex>
    </div>
  )
}

export default VideoCard
