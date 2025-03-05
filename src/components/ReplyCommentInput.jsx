import { Button, Flex, Text, TextArea } from '@radix-ui/themes'
import React, { useRef, useState } from 'react'
import { useAuth } from '../context/authContext'
import { useAutoResize } from '../hooks/useAutoResize'
import { useAddReply } from '../lib/queries/commentQueries'
import toast from 'react-hot-toast'

function ReplyCommentInput({
  closeInput,
  username,
  commentId,
  videoId,
  setReplyList,
  isReplyOfReply = false,
  sortBy,
}) {
  const { user } = useAuth()
  const textareaRef = useRef(null)
  const [content, setContent] = useState(isReplyOfReply ? `@${username} ` : "")
  const autoResizeTextArea = useAutoResize(content, textareaRef)
  const { mutate: addReply, isPending: isAddingReply } = useAddReply(videoId, commentId, user, sortBy)

  const handleAddReply = async () => {
    addReply(content, {
      onSuccess: ({ data: newReply }) => {
        setReplyList(prev => ([...prev, { ...newReply, owner: { ...user }, likesCount: 0, isliked: false }]))
        setContent('')
        closeInput()
      },
      onError: (error) => {
        const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again later';
        toast.error(errorMessage);
      }
    })
  }

  return (
    <div>
      <Text as='p' size={'1'} my={'2'} color='gray' className='pl-2 border-l-[3px] border-[--gray-a6]'>
        Replying to {" "}
        <Text as='span' highContrast>
          @{username}
        </Text>
      </Text>
      <Flex gapX={'4'}>
        <div className='w-10 '>
          <img
            src={user?.avatar}
            alt=""
            className='object-cover object-center rounded-full size-10'
          />
        </div>
        <div className='flex-1'>
          <TextArea
            ref={textareaRef}
            onFocus={(e) => e.target.setSelectionRange(content.length, content.length)}
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            resize={'vertical'}
            placeholder='Leave a reply...'
          />
          <div className='flex justify-end gap-2 mt-2 '>
            <Button
              onClick={() => {
                closeInput()
              }}
              radius='full'
              variant='surface'
              color='gray'
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddReply}
              disabled={!content?.trim() || isAddingReply}
              radius='full'
              highContrast
            >
              Reply
            </Button>
          </div>
        </div>
      </Flex>
    </div>
  )
}

export default React.memo(ReplyCommentInput)
