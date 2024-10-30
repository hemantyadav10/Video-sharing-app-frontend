import { useMutation, useQuery } from "@tanstack/react-query"
import { getUserLikedVideos, toggleCommentLike, toggleVideoLike } from "../../api/likeApi"
import { queryClient } from "../../main"

const useGetUserLikedVideos = (user) => {
  return useQuery({
    queryKey: ['liked_videos', user],
    queryFn: getUserLikedVideos,
    enabled: !!user
  })
}

const useToggleVideoLike = (videoId) => {
  return useMutation({
    mutationFn: () => toggleVideoLike(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['video', videoId]
      })
      queryClient.invalidateQueries({
        queryKey: ['liked_videos']
      })
    }
  })
}

const useToggleCommentLike = (commentId, videoId) => {
  return useMutation({
    mutationFn: () => toggleCommentLike(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', videoId]
      })
    }
  })
}


export {
  useGetUserLikedVideos,
  useToggleVideoLike,
  useToggleCommentLike
}