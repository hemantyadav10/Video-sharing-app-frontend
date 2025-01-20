import { useInfiniteQuery, useMutation } from "@tanstack/react-query"
import { addComment, deleteComment, fetchVideoComments, updateComment } from "../../api/commentApi"
import { queryClient } from "../../main"

const useGetVideoComments = (videoId, sortBy = 'newest', limit = 5, userId) => {
  return useInfiniteQuery({
    queryKey: ['comments', { videoId, sortBy, userId }],
    queryFn: ({ pageParam = 1 }) => fetchVideoComments(videoId, pageParam, limit, sortBy),
    getNextPageParam: (lastPage) => lastPage?.data?.nextPage || null,
    keepPreviousData: true,
  })
}

const useAddComment = (videoId, sortBy = 'newest', user) => {
  return useMutation({
    mutationFn: (content) => addComment(content, videoId),
    onSuccess: (newComment) => {
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
                  docs: [
                    {
                      ...newComment.data,
                      owner: user,
                      likesCount: 0,
                      isLiked: false,
                    },
                    ...page.data.docs,
                  ],
                  totalDocs: page.data.totalDocs + 1,
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
              docs: page.data.docs.map((comment) => {
                return comment._id === updatedComment._id
                  ? { ...updatedComment, owner: user } : comment
              }),
            },
          })),
        };
      });
    },
  });
};


const useDeleteComment = (videoId, sortBy = 'newest', commentId, userId) => {
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.setQueryData(['comments', { videoId, sortBy, userId: userId }], (prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          pages: prev.pages.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                data: {
                  ...page.data,
                  docs: page.data.docs.filter((comment) => comment._id !== commentId),
                  totalDocs: page.data.totalDocs - 1,
                },
              };
            }
            return page;
          }),
        };
      });

      // Optionally, invalidate queries for refetching latest data
      // queryClient.invalidateQueries({ queryKey: ['comments', { videoId, sortBy }] });
    },
  });
};

export {
  useAddComment,
  useDeleteComment, useGetVideoComments, useUpdateComment
}
