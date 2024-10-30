import { DotsVerticalIcon, HeartIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { DropdownMenu, IconButton } from '@radix-ui/themes'
import React, { useEffect, useState } from 'react'
import { timeAgo } from '../utils/formatTimeAgo'
import { useAuth } from '../context/authContext'
import ThumbsUpSolidIcon from '../assets/ThumbsUpSolidIcon'
import ThumbsUp from '../assets/ThumbsUpIcon'
import { useToggleCommentLike } from '../lib/queries/likeQueries'
import { useNavigate } from 'react-router-dom'
import { useDeleteComment } from '../lib/queries/commentQueries'
import toast from 'react-hot-toast'

function CommentCard({
  comment,
  videoId,
}) {
  const { user, isAuthenticated } = useAuth()
  const [commentLikesCount, setCommentLikesCount] = useState(comment?.likesCount || 0)
  const [isCommentLiked, setIsCommentLiked] = useState(comment?.isLiked || false)
  const navigate = useNavigate();

  const { mutate: toggleLike } = useToggleCommentLike(comment?._id, videoId)
  const { mutate: deleteComment } = useDeleteComment(videoId, user, comment?._id)



  useEffect(() => {
    if (comment?.isLiked !== undefined) {
      setIsCommentLiked(comment?.isLiked);
    }
  }, [comment?.isLiked]);


  const handleToggleLike = async () => {

    if (isAuthenticated) {

      setIsCommentLiked(prev => !prev)
      setCommentLikesCount(prev => {
        return isCommentLiked ? prev - 1 : prev + 1
      })
      toggleLike(comment?._id, {
        onError: () => {
          // Revert the optimistic update in case of an error
          setIsCommentLiked((prev) => !prev);
          setCommentLikesCount((prev) => !prev);
          toast.error('Something went wrong. Please try again.');
        }
      })
    } else {
      navigate('/login')
    }
  }

  const handleDeleteComment = async () => {
    deleteComment(comment?._id, {
      onSuccess: () => {
        console.log('comment deleted')
        return toast('Comment deleted')
      },
      onError: () => {
        return toast.err('Some error occured. Please try again.')
      }
    })
  }

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
          {isAuthenticated &&
            (user?._id === comment?.owner._id &&
              < DropdownMenu.Root >
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
                <DropdownMenu.Content
                  variant='soft'
                  className='w-36'
                >
                  <DropdownMenu.Item>
                    <Pencil1Icon /> Edit
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={handleDeleteComment}>
                    <TrashIcon /> Delete
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            )
          }
        </div>
        <p className='break-words whitespace-pre-wrap'>
          {comment?.content}
        </p>
        <div className='flex items-center gap-1 mt-2 text-xs'>
          <IconButton
            onClick={handleToggleLike}
            variant='ghost'
            color='gray'
            highContrast
            radius='full'
          >
            {isCommentLiked ?
              <ThumbsUpSolidIcon height='20' width='20' /> :
              <ThumbsUp height='20' width='20' />
            }
          </IconButton>
          {commentLikesCount}
        </div>
      </div>
    </div >
  )
}

export default CommentCard
