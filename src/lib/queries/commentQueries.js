import { useInfiniteQuery, useMutation } from "@tanstack/react-query"
import {
  addComment,
  addReply,
  deleteComment,
  fetchCommentReplies,
  fetchVideoComments,
  updateComment,
} from "../../api/commentApi"
import { queryClient } from "../../main"

const useGetVideoComments = (videoId, sortBy = 'newest', limit = 5, userId) => {
  return useInfiniteQuery({
    queryKey: ['comments', { videoId, sortBy, userId }],
    queryFn: ({ pageParam = 1 }) => fetchVideoComments(videoId, pageParam, limit, sortBy),
    getNextPageParam: (lastPage) => lastPage?.data?.comments?.nextPage || null,
    keepPreviousData: true,
    placeholderData: prevData => prevData
  })
}

const useGetCommentReplies = (commentId, limit = 5) => {
  return useInfiniteQuery({
    queryKey: ['comments', 'replies', { commentId }],
    queryFn: ({ pageParam = 1 }) => fetchCommentReplies(commentId, pageParam, limit),
    getNextPageParam: (lastPage) => lastPage?.data?.nextPage || null,
    keepPreviousData: true,
  })
}

const useAddComment = (videoId, sortBy = 'newest', user) => {
  return useMutation({
    mutationFn: (content) => addComment(content, videoId),
    onSuccess: ({ data: newComment }) => {
      queryClient.setQueryData(['comments', { videoId, sortBy, userId: user?._id }], (prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          pages: prev.pages.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                data: {
                  comments: {
                    ...page.data.comments,
                    docs: [
                      {
                        ...newComment,
                        owner: user,
                        likesCount: 0,
                        isLiked: false,
                      },
                      ...page.data.comments.docs,
                    ],
                    totalDocs: (page.data.comments.totalDocs || 0) + 1,
                  },
                  totalCommentsCount: (page.data.totalCommentsCount || 0) + 1
                },
              };
            }
            return page;
          }),
        };
      });

      // Optionally, invalidate the query to refetch the latest data
      // queryClient.invalidateQueries({ queryKey: ['comments', { videoId, sortBy, limit }] });
    },
  });
};

const useAddReply = (videoId, commentId, user, sortBy) => {
  return useMutation({
    mutationFn: (content) => addReply(content, videoId, commentId),
    onSuccess: ({ data: newReply }) => {

      queryClient.setQueryData(['comments', 'replies', { commentId }], (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          pages: prev.pages.map((page, index) => {
            if (index + 1 === prev.pages[0].data.totalPages) {
              return {
                ...page,
                data: {
                  ...page.data,
                  docs: [
                    ...page.data.docs,
                    {
                      ...newReply,
                      owner: user,
                      likesCount: 0,
                      isLiked: false,
                    },
                  ],
                  totalDocs: page.data.totalDocs + 1,
                },
              };
            }
            return page;
          }),
        };
      });


      queryClient.setQueryData(['comments', { videoId, sortBy, userId: user?._id }], (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          pages: prev.pages.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                data: {
                  ...page.data,
                  comments: {
                    ...page.data.comments,
                    docs: page.data.comments.docs.map(doc => {
                      return doc._id === commentId ? { ...doc, repliesCount: doc.repliesCount + 1 } : doc
                    })
                  },
                  totalCommentsCount: page.data.totalCommentsCount + 1
                },
              };
            }
            return page;
          }),
        };


      });

    },
  });

}

const useUpdateComment = (videoId, sortBy = 'newest', user) => {
  return useMutation({
    mutationFn: ({ commentId, content }) => updateComment(commentId, content),
    onSuccess: ({ data: updatedComment }) => {
      queryClient.setQueryData(['comments', { videoId, sortBy, userId: user?._id }], (prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          pages: prev.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              comments: {
                ...page.data.comments,
                docs: page.data.comments.docs.map((comment) => {
                  return comment._id === updatedComment._id
                    ? { ...comment, ...updatedComment, owner: user }
                    : comment
                }),
              }
            },
          })),
        };
      });
    },
  });
};

const useUpdateReplyComment = (commentId, user) => {
  return useMutation({
    mutationFn: ({ replyId, content }) => updateComment(replyId, content),
    onSuccess: ({ data: updatedReply }) => {
      queryClient.setQueryData(['comments', 'replies', { commentId }], prev => {
        if (!prev) return;

        return {
          ...prev,
          pages: prev.pages.map(page => ({
            ...page,
            data: {
              ...page.data,
              docs: page.data.docs.map((reply) => {
                return reply._id === updatedReply._id
                  ? { ...reply, ...updatedReply, owner: user }
                  : reply
              })
            }
          }))
        }
      })

    }
  })
}

const useDeleteComment = (videoId, sortBy = 'newest', commentId, userId) => {
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.setQueryData(['comments', { videoId, sortBy, userId: userId }], (prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          pages: prev.pages.map((page, index) => {
            return {
              ...page,
              data: {
                ...page.data,
                comments: {
                  ...page.data.comments,
                  docs: page.data.comments.docs.filter((comment) => comment._id !== commentId),
                },
                totalCommentsCount: page.data.totalCommentsCount - 1
              },
            };
          }),
        };
      });

      queryClient.invalidateQueries({ queryKey: ['comments', { videoId, sortBy, userId: userId }] })
      queryClient.removeQueries({ queryKey: ['comments', 'replies', { commentId }] })
    },
  });
};

const useDeleteReply = (commentId, replyId, sortBy, user, videoId) => {
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.setQueryData(['comments', 'replies', { commentId }], (prev) => {

        if (!prev) return prev;

        return {
          ...prev,
          pages: prev.pages.map((page, index) => {
            return {
              ...page,
              data: {
                ...page.data,
                docs: page.data.docs.filter((reply) => reply._id !== replyId),
                totalDocs: page.data.totalDocs - 1,
              },
            };
          }),
        };
      });


      queryClient.setQueryData(['comments', { videoId, sortBy, userId: user?._id }], (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          pages: prev.pages.map((page, index) => {
            return {
              ...page,
              data: {
                ...page.data,
                comments: {
                  ...page.data.comments,
                  docs: page.data.comments.docs.map(doc => {
                    return doc._id === commentId ? { ...doc, repliesCount: doc.repliesCount - 1 } : doc
                  })
                },
                totalCommentsCount: page.data.totalCommentsCount - 1
              },
            };
          }),
        };


      });

      queryClient.invalidateQueries({ queryKey: ['comments', 'replies', { commentId }] })
    },
  });
}

export {
  useAddComment,
  useDeleteComment,
  useGetVideoComments,
  useUpdateComment,
  useGetCommentReplies,
  useUpdateReplyComment,
  useDeleteReply,
  useAddReply
}
