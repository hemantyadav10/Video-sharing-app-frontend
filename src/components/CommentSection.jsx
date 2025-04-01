import { FaceIcon } from '@radix-ui/react-icons'
import { Button, DropdownMenu, IconButton, Popover, Skeleton, Spinner, Text, TextArea } from '@radix-ui/themes'
import EmojiPicker from 'emoji-picker-react'
import { ListFilter } from 'lucide-react'
import { useTheme } from 'next-themes'
import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { useAutoResize } from '../hooks/useAutoResize'
import { useAddComment, useGetVideoComments } from '../lib/queries/commentQueries'
import { queryClient } from '../main'
import CommentCard from './CommentCard'
import QueryErrorHandler from './QueryErrorHandler'
// import { useInView } from 'react-intersection-observer'

function CommentSection({ videoId, ownerId }) {
  const { user, isAuthenticated } = useAuth()
  const [sortBy, setSortBy] = useState('newest')
  const limit = 5
  const { mutate: addComment, isPending: addingComment } = useAddComment(videoId, sortBy, user)
  const { theme } = useTheme()
  const textareaRef = useRef(null)

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
    error,
    refetch
  } = useGetVideoComments(videoId, sortBy, limit, user?._id)
  const totalComments = data?.pages[0].data.totalCommentsCount

  const [commentText, setCommentText] = useState('')
  useAutoResize(commentText, textareaRef)
  const navigate = useNavigate()

  const handleAddComment = async () => {
    addComment(commentText, {
      onSuccess: () => {
        setCommentText('')
        toast.success("Comment added")
      },
      onError: (error) => {
        const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again later';
        toast.error(errorMessage);
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
    <div className='flex flex-col gap-6 p-3 sm:border rounded-xl border-[--gray-a6] sm:p-6 sm:mt-4 '>
      <div className='flex items-center font-medium '>
        <span>
          {totalComments} Comments
        </span>
        <DropdownMenu.Root>
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
              <ListFilter size={18} /> Sort by
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content variant='soft' className='w-40'>
            <DropdownMenu.Item
              className={`${sortBy === 'newest' && 'bg-[--accent-a3]'}`}
              onClick={() => handleSortChange('newest')}
            >
              Newest first
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className={`${sortBy !== 'newest' && 'bg-[--accent-a3]'}`}
              onClick={() => handleSortChange('oldest')}
            >
              Oldest first
            </DropdownMenu.Item>

          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <div>
        <TextArea
          ref={textareaRef}
          value={commentText}
          placeholder='Add a comment...'
          onChange={e => setCommentText(e.target.value)}
          onFocus={() => {
            if (!isAuthenticated) {
              return navigate('/login')
            }
          }}
          resize={'vertical'}
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
                theme={theme}
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
              variant='surface'
              color='gray'
              radius='full'
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddComment}
              disabled={!commentText?.trim() || addingComment}
              highContrast
              radius='full'
            >
              Comment
            </Button>
          </div>
        </div>
      </div>
      {isError && (
        <div className='border rounded-xl border-[--gray-a6] p-6 pt-0'>
          <QueryErrorHandler error={error} onRetry={refetch} className='mt-0' />
        </div>
      )}
      {!!totalComments && totalComments > 0 && <div className='relative'>
        {!isError && <div className={` flex flex-col gap-6 mt-2`}>
          {data?.pages.map((comments) => (
            comments.data.comments.docs.map((comment =>
              <CommentCard
                key={comment._id}
                comment={comment}
                videoId={videoId}
                sortBy={sortBy}
                ownerId={ownerId}
                loading={false}
              />

            ))
          ))}
          {/* Show loader when more comments are being fetched */}
          {
            isFetchingNextPage &&
            <div className='mx-auto'>
              <Spinner size={"3"} />
            </div>
          }
          {/* Show load more button if there are more comments and no more comment are being loaded */}
          {
            (hasNextPage && !isFetchingNextPage) &&
            // <div ref={ref}></div>
            <Button
              variant='ghost'
              color='gray'
              highContrast
              className='mx-auto font-medium w-max'
              onClick={fetchNextPage}
            >
              Load more
            </Button>
          }
          {!hasNextPage && <Text as='p' size={'1'} align={'center'} color='gray'>You have reached the end of the list</Text>}
        </div>}
      </div>}
    </div>
  )
}

export default React.memo(CommentSection)
