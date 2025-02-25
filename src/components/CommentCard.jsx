import { DotsVerticalIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Button, DropdownMenu, IconButton, Spinner, Text, TextArea } from '@radix-ui/themes'
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import ThumbsUp from '../assets/ThumbsUpIcon'
import ThumbsUpSolidIcon from '../assets/ThumbsUpSolidIcon'
import { useAuth } from '../context/authContext'
import { useReadMore } from '../hooks/useReadMore'
import { useDeleteComment, useUpdateComment } from '../lib/queries/commentQueries'
import { useToggleCommentLike } from '../lib/queries/likeQueries'
import { timeAgo } from '../utils/formatTimeAgo'
import { useAutoResize } from '../hooks/useAutoResize'

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
  const {
    contentRef,
    isExpanded,
    isLongContent,
    toggleExpand,
    setIsExpanded,
    setIsLongContent
  } = useReadMore(content)
  const textareaRef = useRef(null)
  const autoResizeTextArea = useAutoResize(content, textareaRef)


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
        toast('Comment updated')
        setIsExpanded(true)
        setIsLongContent(false)
      },
      onError: (error) => {
        const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again later';
        toast.error(errorMessage);
      }
    })
  }

  useEffect(() => {
    if (isEditable && textareaRef.current) {
      autoResizeTextArea()
    }
  }, [isEditable])

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
            ref={textareaRef}
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
                      size={'3'}
                      disabled={deletingComment}
                    >
                      <DotsVerticalIcon width="18" height="18" />
                    </IconButton>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content
                    variant='soft'
                    className='w-48'
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
          <p
            ref={contentRef}
            className={`pr-4 break-words whitespace-pre-wrap ${isExpanded ? "" : "line-clamp-3"}`}
          >
            {comment?.content}
          </p>
          {isLongContent && <div className='flex items-center'>
            <Button
              variant='ghost'
              color='gray'
              radius='full'
              onClick={() => {
                toggleExpand()
              }}
              className='font-medium transition bg-transparent hover:text-[--gray-12] hover:underline'
            >
              {isExpanded ? "Show less" : "Read more"}
            </Button>
          </div>}
          <div className='flex items-center gap-1 mt-2 text-xs'>
            <IconButton
              onClick={handleToggleLike}
              variant='ghost'
              color='gray'
              highContrast
              radius='full'
              disabled={deletingComment || isToggleLikePending}
              className='text-[--gray-11]'
            >
              {isCommentLiked ?
                <ThumbsUpSolidIcon /> :
                <ThumbsUp />
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
