import { FaceIcon } from '@radix-ui/react-icons'
import { Button, DropdownMenu, IconButton, Spinner, TextArea } from '@radix-ui/themes'
import React from 'react'
import SortIcon from '../assets/SortIcon'
import CommentCard from './CommentCard'
import { useGetVideoComments } from '../lib/queries/commentQueries'

function CommentSection({ videoId }) {

  const { data: comments, isLoading: loadingComments } = useGetVideoComments(videoId)

  if (loadingComments) return <div className='max-w-4xl p-3'><Spinner className='h-6 mx-auto' /></div> 

  return (
    <div className='flex flex-col max-w-4xl gap-6 p-3 '>
      <div className='flex items-center font-medium '>
        {comments?.data.totalDocs} Comments
        <DropdownMenu.Root >
          <DropdownMenu.Trigger>
            <Button
              ml={'4'}
              variant='ghost'
              aria-label="More options"
              radius='full'
              highContrast
              color='gray'
              className='font-medium'
            >
              <SortIcon /> Sort by
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content variant='soft'>
            <DropdownMenu.Item>
              Top comments
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              Newest first
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <div>
        <TextArea placeholder='Add a comment...' />
        <div className='flex items-center justify-between'>
          <IconButton
            variant='ghost'
            radius='full'
            size={'3'}
            color='gray'
          >
            <FaceIcon height={'20px'} width={'20px'} />
          </IconButton>
          <div className='flex gap-2 mt-2 '>
            <Button variant='soft' color='gray' highContrast>
              Cancel
            </Button>
            <Button variant='soft' highContrast>
              Send
            </Button>
          </div>
        </div>

      </div>
      <div className='flex flex-col gap-6 mt-2'>
        {comments?.data?.docs.map((comment) => (
          <CommentCard
            key={comment._id}
            comment={comment}
          />
        ))}
      </div>
    </div>
  )
}

export default CommentSection
