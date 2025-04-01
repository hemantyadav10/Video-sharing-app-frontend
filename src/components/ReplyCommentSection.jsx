import { Button, Flex, Spinner } from '@radix-ui/themes'
import { CornerDownRightIcon } from 'lucide-react'
import React, { useLayoutEffect } from 'react'
import { useAuth } from '../context/authContext'
import { useGetCommentReplies } from '../lib/queries/commentQueries'
import ReplyCommentCard from './ReplyCommentCard'
import QueryErrorHandler from './QueryErrorHandler'

function ReplyCommentSection({ commentId, ownerId, setReplyList, sendHasNextPage, videoId, replyList, sortBy }) {
  const { user } = useAuth()
  const {
    data,
    isLoading,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    error,
    isError,
    refetch
  } = useGetCommentReplies(commentId, 3)


  useLayoutEffect(() => {
    sendHasNextPage(hasNextPage);
  }, [hasNextPage, sendHasNextPage]);

  if (isLoading) return <Flex justify={'center'}><Spinner className='size-6' /></Flex>

  if (isError) return (
    <div className='border rounded-xl border-[--gray-a6] p-6 pt-0'>
      <QueryErrorHandler error={error} onRetry={refetch} className='mt-0' />
    </div>
  )

  return (
    <Flex direction={'column'} gapY={'4'} mt={'4'}>
      {data?.pages.map((replies) => (
        replies.data.docs.map((reply =>
          <ReplyCommentCard
            key={reply._id}
            reply={reply}
            videoOwnerId={ownerId}
            commentId={commentId}
            setReplyList={setReplyList}
            videoId={videoId}
            replyList={replyList}
            sortBy={sortBy}
          />

        ))
      ))}
      {
        isFetchingNextPage &&
        <div className='mx-auto'>
          <Spinner size={"3"} />
        </div>
      }
      {
        (hasNextPage && !isFetchingNextPage) &&
        <Button
          variant='ghost'
          radius='full'
          className='text-sm font-medium w-max'
          onClick={() => fetchNextPage()}
        >
          <CornerDownRightIcon size={18} strokeWidth={1.25} /> Show more replies
        </Button>
      }
    </Flex>
  )
}

export default ReplyCommentSection
