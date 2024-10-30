import { useMutation, useQuery } from "@tanstack/react-query"
import { addComment, fetchVideoComments } from "../../api/commentApi"
import { queryClient } from "../../main"

const useGetVideoComments = (videoId, userId) => {
  return useQuery({
    queryKey: ['comments', videoId, userId],
    queryFn: () => fetchVideoComments(videoId)
  })
}

const useAddComment = (videoId, user) => {
  return useMutation({
    mutationFn: (content) => addComment(content, videoId),
    onSuccess: (newComment) => {
      queryClient.setQueryData(['comments', videoId, user._id], (prev) => {
        return {
          ...prev,
          data: {
            ...prev.data,
            docs: [
              {
                _id: Date.now(),
                content: newComment.data.content,
                owner: {
                  _id: user._id,
                  username: user.username,
                  fullName: user.fullName,
                  avatar: user.avatar
                },
                createdAt: Date.now(),
                updatedAt: Date.now(),
                likesCount: 0,
                isliked: false
              },
              ...prev.data.docs
            ],
            totalDocs: prev.data.totalDocs + 1
          }
        }

      }
      )
      queryClient.invalidateQueries({ queryKey: ['comments', videoId] });
    }
  })
}


export {
  useGetVideoComments,
  useAddComment
}