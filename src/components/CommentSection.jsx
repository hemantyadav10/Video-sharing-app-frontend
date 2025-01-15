import { FaceIcon } from '@radix-ui/react-icons'
import { Button, DropdownMenu, IconButton, Popover, Separator, Skeleton, Spinner, TextArea } from '@radix-ui/themes'
import React, { useEffect, useState } from 'react'
import SortIcon from '../assets/SortIcon'
import CommentCard from './CommentCard'
import { useAddComment, useGetVideoComments } from '../lib/queries/commentQueries'
import { useAuth } from '../context/authContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import EmojiPicker from 'emoji-picker-react';
import { queryClient } from '../main'
// import { useInView } from 'react-intersection-observer'

function CommentSection({ videoId }) {
  const { user, isAuthenticated } = useAuth()
  const [sortBy, setSortBy] = useState('newest')
  const limit = 5
  const { mutate: addComment, isPending: addingComment } = useAddComment(videoId, sortBy, user)
  // const { ref, inView } = useInView({
  //   rootMargin: '100px'
  // })

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: loadingComments,
    isError,
    isFetching,
  } = useGetVideoComments(videoId, sortBy, limit)
  const totalComments = data?.pages[0].data.totalDocs

  const [commentText, setCommentText] = useState('')
  const navigate = useNavigate()

  const handleAddComment = async () => {
    addComment(commentText, {
      onSuccess: () => {
        setCommentText('')
      },
      onError: (err) => {
        console.log(err)
        toast.error(err.message)
      }
    })
  }

  // useEffect(() => {
  //   if (inView && fetchNextPage) {
  //     fetchNextPage();
  //   }
  // }, [inView, fetchNextPage]);

  const handleSortChange = (type) => {
    setSortBy(type);
    queryClient.invalidateQueries({ queryKey: ['comments', { videoId, sortBy: type }] })
  }

  if (loadingComments) return (
    <div className='p-3'>
      <Spinner className='h-6 mx-auto' size={'3'} />
    </div>
  )

  return (
    <div className='flex flex-col gap-6 p-3 sm:border rounded-xl border-[#484848] sm:p-6 sm:mt-4 '>
      <div className='flex items-center font-medium '>
        <span>
          <Skeleton loading={isFetching}>
            {totalComments} Comments
          </Skeleton>
        </span>
        <DropdownMenu.Root >
          <DropdownMenu.Trigger disabled={totalComments < 2}>
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
          <DropdownMenu.Content variant='soft' className='w-40'>
            <DropdownMenu.Item
              className={`${sortBy === 'newest' && 'bg-[#0077ff3a]'}`}
              onClick={() => handleSortChange('newest')}
            >
              Newest first
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className={`${sortBy !== 'newest' && 'bg-[#0077ff3a]'}`}
              onClick={() => handleSortChange('oldest')}
            >
              Oldest first
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

          disabled={addingComment}
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
              radius='full'
              disabled={addingComment}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddComment}
              disabled={!commentText?.trim()}
              loading={addingComment}
              highContrast
              radius='full'
            >
              Comment
            </Button>
          </div>
        </div>
      </div>
      <div className='relative'>
        {(isFetching && !isFetchingNextPage) && <div className='absolute inset-0 flex justify-center mt-20'>
          <Spinner size={'3'} />
        </div>}
        <div className={` flex flex-col gap-6 mt-2 ${(isFetching && !isFetchingNextPage) && 'opacity-30'} `}>
          {data?.pages.map((comments) => (
            comments.data.docs.map((comment =>
              <CommentCard
                key={comment._id}
                comment={comment}
                videoId={videoId}
                sortBy={sortBy}
              />

            ))
          ))}
          {/* Show loader when more comments are being fetched */}
          {
            isFetchingNextPage &&
            <div className='mx-auto'>
              <Spinner size={'3'} />
            </div>
          }
          {/* Show load more button if there are more comments and no more comment are being loaded */}
          {
            (hasNextPage && !isFetchingNextPage) &&
            // <div ref={ref}></div>
            <Button
              variant='ghost'
              radius='full'
              className='mx-auto font-medium w-max'
              onClick={() => fetchNextPage()}
            >
              Load more
            </Button>
          }
        </div>
      </div>
    </div>
  )
}

export default CommentSection
