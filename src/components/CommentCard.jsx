import { DotsVerticalIcon, HeartIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { DropdownMenu, IconButton } from '@radix-ui/themes'
import React from 'react'
import { timeAgo } from '../utils/formatTimeAgo'

function CommentCard({ comment }) {

  console.log(comment)
  return (
    <div className='flex gap-4 '>
      <div className='w-10 '>
        <img
          src={comment?.owner.avatar}
          alt=""
          className='object-cover object-center rounded-full size-10'
        />
      </div>
      <div className='flex flex-col flex-1 gap-1 text-sm'>
        <div className='flex items-center justify-between gap-1 text-sm '>
          <div className='flex items-center gap-1 text-sm '>
            <span className='font-medium'>
              @{comment?.owner.username}
            </span>
            <span className='text-xs'>
              {timeAgo(comment?.createdAt)}
            </span>
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
                <DotsVerticalIcon />
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
        <p>
          {comment?.content}
        </p>
        <div className='flex items-center gap-1 mt-2 text-xs'>
          <IconButton
            variant='ghost'
            color='gray'
            highContrast
            radius='full'
          >
            <HeartIcon height={'18'} width={'18'} />
          </IconButton>
          {comment?.likesCount}
        </div>
      </div>
    </div>
  )
}

export default CommentCard
