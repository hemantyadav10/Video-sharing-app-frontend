import { ChatBubbleIcon, DotsVerticalIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Button, DropdownMenu, Flex, IconButton, Spinner, Text, TextArea } from '@radix-ui/themes'
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import ThumbsUp from '../assets/ThumbsUpIcon'
import ThumbsUpSolidIcon from '../assets/ThumbsUpSolidIcon'
import { useAuth } from '../context/authContext'
import { useAutoResize } from '../hooks/useAutoResize'
import { useReadMore } from '../hooks/useReadMore'
import { useDeleteReply, useUpdateReplyComment } from '../lib/queries/commentQueries'
import { useToggleReplyLike } from '../lib/queries/likeQueries'
import { timeAgo } from '../utils/formatTimeAgo'
import ConfirmationDialog from './ConfirmationDialog'
import ReplyCommentInput from './ReplyCommentInput'


export default function ReplyCommentCard({
  reply,
  videoOwnerId,
  commentId,
  videoId,
  setReplyList,
  replyList = [],
  sortBy,
}) {
  const { user, isAuthenticated } = useAuth()
  const [isEditable, setIsEditable] = useState(false)
  const navigate = useNavigate();

  const [content, setContent] = useState(reply?.content || '')
  const textareaRef = useRef(null)
  const autoResizeTextArea = useAutoResize(content, textareaRef)
  const {
    contentRef,
    isExpanded,
    isLongContent,
    toggleExpand,
    setIsExpanded,
    setIsLongContent
  } = useReadMore(content)

  const { mutate: updateReply, isPending: isUpdatingReply, } = useUpdateReplyComment(commentId, user)
  const { mutate: deleteReply, isPending: isDeletingReply } = useDeleteReply(commentId, reply?._id, sortBy, user, videoId)

  const [open, setOpen] = useState(false)
  const [openReplyInput, setOpenReplyInput] = useState(false)

  const [likesCount, setLikesCount] = useState(reply?.likesCount || 0)
  const [isReplyLiked, setIsReplyLiked] = useState(reply?.isLiked || false)
  const { mutate: toggleLike, isPending: isToggleLikePending } = useToggleReplyLike(commentId, reply?._id)


  const handleToggleLike = async () => {

    if (isAuthenticated) {
      let updatedList;

      if (replyList.length > 0) {
        updatedList = replyList.map(comment => {
          return comment._id === reply?._id
            ? {
              ...comment,
              likesCount: comment.isLiked
                ? comment.likesCount - 1
                : comment.likesCount + 1,
              isLiked: !comment.isLiked,
            }
            : comment
        })
      }

      setReplyList(updatedList)

      setIsReplyLiked(prev => !prev)
      setLikesCount(prev => {
        return isReplyLiked ? prev - 1 : prev + 1
      })
      toggleLike(reply?._id, {
        onError: () => {
          // Revert the optimistic update in case of an error
          setIsReplyLiked((prev) => !prev);
          setLikesCount(reply?.likesCount)
          toast.error('Something went wrong. Please try again.');
        }
      })
    } else {
      navigate('/login')
    }
  }


  useEffect(() => {
    if (isEditable && textareaRef.current) {
      autoResizeTextArea()
    }
  }, [isEditable])

  const handleUpdateReply = async () => {
    updateReply({ replyId: reply?._id, content }, {
      onSuccess: ({ data: updatedReply }) => {
        let updatedList;

        if (replyList.length > 0) {
          updatedList = replyList.map(comment => {
            return comment._id === reply?._id ? { ...updatedReply, owner: { ...user }, likesCount: 0, isliked: false } : comment
          })
        }

        setReplyList(updatedList)

        setIsEditable(false)
        setIsExpanded(true)
        setIsLongContent(false)
        return toast('Reply updated')
      },
      onError: (error) => {
        const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again later';
        toast.error(errorMessage);
      }
    })
  }

  const handleDeleteReply = async () => {
    deleteReply(reply?._id, {
      onSuccess: () => {
        let filteredList;
        if (replyList.length > 0) {
          filteredList = replyList.filter(comment => comment._id !== reply?._id);
          setReplyList(filteredList)
        }

        return toast('Reply deleted')
      },
      onError: (error) => {
        const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again later';
        toast.error(errorMessage);
      }
    })
  }

  if (isUpdatingReply || isDeletingReply) return <Flex justify={'center'}><Spinner className='size-6' /></Flex>

  return (
    <Flex className=''>
      <Link
        to={`/channel/${reply?.owner._id}`}
        className='mr-4 size-6 aspect-square'
      >
        <img
          src={reply?.owner?.avatar}
          alt=""
          className='object-cover object-center w-full h-full rounded-full'
        />
      </Link>
      {isEditable && (
        <div className='flex-1'>
          <TextArea
            ref={textareaRef}
            autoFocus
            value={content}
            onFocus={(e) => e.target.setSelectionRange(content.length, content.length)}
            onChange={(e) => setContent(e.target.value)}
            resize={'vertical'}
            placeholder='Leave a reply...'
          />
          <div className='flex justify-end gap-2 mt-2 '>
            <Button
              onClick={() => {
                setIsEditable(false)
                setContent(reply?.content)
              }}
              radius='full'
              variant='surface'
              color='gray'
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateReply}
              disabled={!content?.trim() || content?.trim() === reply?.content}
              radius='full'
              highContrast
            >
              Save
            </Button>
          </div>
        </div>
      )}
      {!isEditable && (
        <>
          <Flex gap={'1'} direction={'column'} flexGrow={'1'}>
            <div className={`flex items-center gap-1 text-sm`}>
              <Link
                to={`/channel/${reply?.owner._id}`}
                className={`font-medium ${reply?.owner._id === videoOwnerId ? "bg-[--gray-a12] px-1 rounded text-[--gray-1]" : ""}`}
              >
                @{reply?.owner.username}
              </Link>
              <Text as='span' color='gray' size={'1'}>
                {timeAgo(reply?.createdAt)}
                {reply?.createdAt !== reply?.updatedAt && ' (edited)'}
              </Text>
            </div>
            <p
              ref={contentRef}
              className={`pr-4 break-words text-sm whitespace-pre-wrap ${isExpanded ? "" : "line-clamp-3"}`}
            >
              {renderContentWithLinksAndMentions(reply?.content)}
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
                disabled={isToggleLikePending}
                className='text-[--gray-12]'
              >
                {isReplyLiked ?
                  <ThumbsUpSolidIcon /> :
                  <ThumbsUp />
                }
              </IconButton>
              <Text as='span' color='gray' size={'1'}>
                {likesCount}
              </Text>
              <Button
                color='gray'
                variant='ghost'
                className='text-xs font-medium'
                highContrast
                radius='full'
                size={'3'}
                ml={'4'}
                onClick={() => {
                  if (!isAuthenticated) {
                    return navigate('/login')
                  }
                  setOpenReplyInput(true)
                }}
              >
                <ChatBubbleIcon height={16} width={16} /> Reply
              </Button>
            </div>
            {openReplyInput &&
              <ReplyCommentInput
                closeInput={() => setOpenReplyInput(false)}
                username={reply?.owner.username}
                commentId={commentId}
                videoId={videoId}
                setReplyList={setReplyList}
                isReplyOfReply={true}
                sortBy={sortBy}
              />
            }
          </Flex>
          <div>
            {isAuthenticated &&
              (user?._id === reply?.owner._id &&
                <>
                  < DropdownMenu.Root >
                    <DropdownMenu.Trigger>
                      <IconButton
                        variant='ghost'
                        highContrast
                        color='gray'
                        radius='full'
                        size={'3'}
                      >
                        <DotsVerticalIcon width="18" height="18" />
                      </IconButton>

                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content
                      variant='soft'
                      className='w-48'
                    >
                      <DropdownMenu.Item
                        onClick={() => setIsEditable(true)}
                      >
                        <Pencil1Icon /> Edit
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onClick={() => setOpen(true)}
                        color='red'
                      >
                        <TrashIcon /> Delete
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                  {setOpen && (
                    <ConfirmationDialog
                      open={open}
                      setOpen={setOpen}
                      action={handleDeleteReply}
                      title='Delete reply'
                      descripion='Delete your reply permanently?'
                    />
                  )}
                </>
              )
            }
          </div>
        </>
      )}
    </Flex>
  )
}


const urlRegex = /(https?:\/\/[^\s]+)/g;
const mentionRegex = /(@\w+)/g;

const renderContentWithLinksAndMentions = (text) => {
  text = text.replace(mentionRegex, (match) => {
    return `<span class="text-[--accent-a11]">${match}</span>`;
  });

  text = text.replace(urlRegex, (match) => {
    return `<a href="${match}" target="_blank" rel="noopener noreferrer" class="text-[--accent-a11] hover:underline">${match}</a>`;
  });

  return <span dangerouslySetInnerHTML={{ __html: text }} />;
};
