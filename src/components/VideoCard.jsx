import { BookmarkIcon, CropIcon, Cross1Icon, DotsVerticalIcon } from '@radix-ui/react-icons'
import { Avatar, DropdownMenu, Flex, IconButton, Text, Tooltip } from '@radix-ui/themes'
import React from 'react'

function VideoCard({ hideAvatar = false, list = false, moreOptionsButton = true, removeFromHistoryButton = false }) {
  return (
    <div className={`flex  gap-4 sm:mb-4 rounded-xl ${list ? 'sm:grid sm:grid-cols-12 flex-col max-w-6xl ' : 'flex-col '}  line-clamp-1`}>
      <div
        className={`relative  aspect-video  ${list ? "sm:col-span-5" : ""}`}>
        <img
          src="https://images.unsplash.com/photo-1479030160180-b1860951d696?&auto=format&fit=crop&w=1200&q=80"
          alt="A house in a forest"
          className={`object-cover object-center  rounded-xl aspect-video `}
        />
        <Text
          className='absolute bottom-2 right-2 p-[2px] px-1 text-xs bg-black/70 font-medium rounded-md'
          as='span'
        >
          19:21
        </Text>
      </div>
      <Flex
        gapX='3'
        className={`relative ${list ? "sm:col-span-7" : ""}`}
      >
        {removeFromHistoryButton &&
          <Tooltip width={'100px'} content='Remove from watch history'>
            <IconButton
              variant='ghost'
              className='absolute rounded-full sm:right-[6px] top-1 right-2'
              highContrast
              color='gray'
            >
              <Cross1Icon height={'20'} width={'20'} />
            </IconButton>
          </Tooltip>
        }
        {moreOptionsButton && <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton
              variant='ghost'
              className='absolute rounded-full sm:right-[6px] top-1 right-3'
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
        </DropdownMenu.Root>}
        {!hideAvatar && <Avatar
          radius='full'
          size={'3'}
          src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
          fallback="A"
          className={`${list && " sm:hidden"}`}
        />}
        <Flex
          direction={'column'}
          gapY={'2'}
        >
          <Text
            as='p'
            weight={'medium'}
            size={'2'}
            className={`pr-8  line-clamp-2 ${list ? "md:text-base lg:text-lg" : ""}`}
          >
            Exploring the Hidden Gems of Paris: A Local's Guide This approach will avoid any issue with query parameters not being immediately reflected in the URL.
          </Text>
          <Text
            as='p'
            size={'1'}
            color='gray'
            className={`${list && "sm:order-2 flex items-center gap-3"} `}
          >
            {list && <img src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop" alt="" className='hidden rounded-full size-6 sm:block' />}
            Jane Doe
          </Text>
          <Flex gap={'2'} align={'center'} className={`${list && "sm:order-1"}`}>
            <Text as='span' color='gray' size={'1'} >151K views</Text>
            <Text as='span' color='gray' size={'1'} >•</Text>
            <Text as='span' color='gray' size={'1'} >1 year ago</Text>
          </Flex>
          {list && <div className={`${list && "hidden sm:block sm:order-3"}`}>
            <Text
              as='p'
              size={'1'}
              color='gray'
              className='line-clamp-1'
            >
              Any unauthorised use of the beats, including commercial use of tagged beats as well as unauthorised reselling, is considered a direct violation of the Copyright law and is infringing upon the copyrights of the works of FlipTunesMusic. Under the fullest extent of the law, FlipTunesMusic reserves the right to take legal action or pursue financial compensation as a result of any breach or violation of the Licensing Policy.
            </Text>

          </div>}
        </Flex>
      </Flex>
    </div>
  )
}

export default VideoCard
