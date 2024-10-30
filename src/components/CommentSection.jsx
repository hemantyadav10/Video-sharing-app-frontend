import { FaceIcon } from '@radix-ui/react-icons'
import { Button, DropdownMenu, IconButton, Popover, Spinner, TextArea } from '@radix-ui/themes'
import React, { useState } from 'react'
import SortIcon from '../assets/SortIcon'
import CommentCard from './CommentCard'
import { useAddComment, useGetVideoComments } from '../lib/queries/commentQueries'
import { useAuth } from '../context/authContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import EmojiPicker from 'emoji-picker-react';

function CommentSection({ videoId }) {
  const { user, isAuthenticated } = useAuth()
  const { mutate: addComment, isPending: addingComment } = useAddComment(videoId, user)

  const { data: comments, isLoading: loadingComments } = useGetVideoComments(videoId, user?._id)

  const [commentText, setCommentText] = useState('')
  const navigate = useNavigate()

  const handleAddComment = async () => {
    addComment(commentText, {
      onSuccess: () => {
        setCommentText('')
      },
      onError: (err) => {
        console.log(err)
        toast.error(err.stack)
      }
    })
  }



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
        <TextArea
          value={commentText}
          placeholder='Add a comment...'
          onChange={e => setCommentText(e.target.value)}
          onFocus={() => {
            if (!isAuthenticated) {
              return navigate('/login')
            }
          }}
        />
        <div className='relative flex items-center justify-between'>
          <Popover.Root>
            <Popover.Trigger hidden={!isAuthenticated}>
              <IconButton
                variant='ghost'
                radius='full'
                size={'3'}
                color='gray'
              >
                <FaceIcon height={'20px'} width={'20px'} />
              </IconButton>
            </Popover.Trigger>
            <Popover.Content maxHeight={'200'} className='p-0'>
              <EmojiPicker
                theme='dark'
                height={300}
                searchDisabled
                onEmojiClick={(e) => setCommentText(prev => prev + e.emoji)}
              />
            </Popover.Content>
          </Popover.Root>

          <div className='flex gap-2 mt-2 ml-auto'>
            <Button
              onClick={() => {
                setCommentText('')
              }}
              hidden={!commentText?.trim()}
              variant='soft'
              color='gray'
              highContrast
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddComment}
              disabled={!commentText?.trim()}
              loading={addingComment}
              variant='soft'
              highContrast
            >
              Comment
            </Button>
          </div>
        </div>

      </div>
      <div className='flex flex-col gap-6 mt-2'>
        {comments?.data?.docs.map((comment) => (
          <CommentCard
            key={comment._id}
            comment={comment}
            videoId={videoId}
          />
        ))}
      </div>
    </div>
  )
}

export default CommentSection
