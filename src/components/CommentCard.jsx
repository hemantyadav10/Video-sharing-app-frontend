import { DotsVerticalIcon, HeartIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Button, DropdownMenu, IconButton, Spinner, Text, TextArea } from '@radix-ui/themes'
import React, { useEffect, useState } from 'react'
import { timeAgo } from '../utils/formatTimeAgo'
import { useAuth } from '../context/authContext'
import ThumbsUpSolidIcon from '../assets/ThumbsUpSolidIcon'
import ThumbsUp from '../assets/ThumbsUpIcon'
import { useToggleCommentLike } from '../lib/queries/likeQueries'
import { Link, useNavigate } from 'react-router-dom'
import { useDeleteComment, useUpdateComment } from '../lib/queries/commentQueries'
import toast from 'react-hot-toast'

function CommentCard({
  comment,
  videoId,
  sortBy
}) {
  const { user, isAuthenticated } = useAuth()
  const [commentLikesCount, setCommentLikesCount] = useState(comment?.likesCount || 0)
  const [isCommentLiked, setIsCommentLiked] = useState(comment?.isLiked || false)
  const navigate = useNavigate();

  const { mutate: toggleLike, isPending: isToggleLikePending } = useToggleCommentLike(comment?._id, videoId)
  const { mutate: deleteComment, isPending: deletingComment } = useDeleteComment(videoId, sortBy, comment?._id, user?._id)
  const [isEditable, setIsEditable] = useState(false);
  const [content, setContent] = useState(comment?.content || '')
  const { mutate: updateComment, isPending: updatingComment } = useUpdateComment(videoId, sortBy, user)

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
          setCommentLikesCount(comment?.likesCount)
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
        return toast('Comment deleted')
      },
      onError: (error) => {
        const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again later';
        toast.error(errorMessage);
      }
    })
  }

  const handleUpdateComment = async () => {
    updateComment({ commentId: comment?._id, content }, {
      onSuccess: () => {
        setIsEditable(false)
        return toast('Comment updated')
      },
      onError: (error) => {
        const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again later';
        toast.error(errorMessage);
      }
    })
  }


  return (
    <div className='relative'>
      {deletingComment && (
        <div className='absolute inset-0 z-10 flex items-center justify-center'>
          <Spinner size={'3'} />
        </div>
      )}
      <div className={`flex gap-4  ${deletingComment ? 'opacity-30' : ''}`}>
        <div className='w-10 '>
          <img
            src={comment?.owner.avatar}
            alt=""
            className='object-cover object-center rounded-full size-10'
          />
        </div>
        {isEditable && <div className='flex-1'>
          <TextArea
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={updatingComment}
            resize={'vertical'}
          />
          <div className='flex justify-end gap-2 mt-2 '>
            <Button
              onClick={() => {
                setIsEditable(false)
                setContent(comment?.content)
              }}
              radius='full'
              variant='surface'
              color='gray'
              highContrast
              hidden={updatingComment}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateComment}
              disabled={!content?.trim() || content?.trim() === comment?.content || updatingComment}
              radius='full'
              highContrast
            >
              <Spinner loading={updatingComment} /> {updatingComment ? "Saving" : "Save"}
            </Button>
          </div>
        </div>}
        {!isEditable && <div className='flex flex-col flex-1 gap-1 text-sm'>
          <div className='flex items-center justify-between gap-1 text-sm '>
            <div className='flex items-center gap-1 text-sm '>
              <Link
                to={`/channel/${comment?.owner._id}`}
                className='font-medium'
              >
                @{comment?.owner.username}
              </Link>
              <Text as='span' color='gray' size={'1'}>
                {timeAgo(comment?.createdAt)}
                {comment?.createdAt !== comment?.updatedAt && ' (edited)'}
              </Text>
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
                      disabled={deletingComment}
                    >
                      <DotsVerticalIcon />
                    </IconButton>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content
                    variant='soft'
                    className='w-36'
                  >
                    <DropdownMenu.Item onClick={() => setIsEditable(true)}>
                      <Pencil1Icon /> Edit
                    </DropdownMenu.Item>
                    <DropdownMenu.Item color='red' onClick={handleDeleteComment}>
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
              disabled={deletingComment || isToggleLikePending}
            >
              {isCommentLiked ?
                <ThumbsUpSolidIcon height='20' width='20' /> :
                <ThumbsUp height='20' width='20' />
              }
            </IconButton>
            <Text as='span' color='gray' size={'1'}>
              {commentLikesCount}
            </Text>
          </div>
        </div>}
      </div>
    </div >
  )
}

export default React.memo(CommentCard)
