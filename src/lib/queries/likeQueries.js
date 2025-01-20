import { useMutation, useQuery } from "@tanstack/react-query"
import { getUserLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../../api/likeApi"
import { queryClient } from "../../main"

const useGetUserLikedVideos = (user) => {
  return useQuery({
    queryKey: ['liked_videos', user],
    queryFn: getUserLikedVideos,
    enabled: !!user
  })
}

const useToggleVideoLike = (videoId, userId) => {
  return useMutation({
    mutationFn: (video) => toggleVideoLike(video._id || videoId),
    onMutate: (data) => {
      const videoData = queryClient.getQueryData(['video', videoId, userId])
      const likedVideos = queryClient.getQueryData(['liked_videos', userId])


      queryClient.setQueryData(['video', videoId, userId], prev => {
        if (!prev) return prev;
        return {
          ...prev,
          data: {
            ...prev.data,
            likesCount: prev.data.isLiked
              ? prev.data.likesCount - 1
              : prev.data.likesCount + 1,
            isLiked: !prev.data.isLiked,
          }
        }
      })

      queryClient.setQueryData(['liked_videos', userId], prev => {
        if (!prev) return prev;
        if (data?.isLiked) {
          return {
            ...prev,
            data: prev.data.filter(data => data?.video?._id !== videoId)
          }
        } else if (!data?.isLiked) {
          return {
            ...prev,
            data: [
              {
                video: {
                  ...videoData?.data,
                  isLiked: true,
                  views: data.views + 1
                },
                createdAt: new Date()
              },
              ...prev.data,
            ]
          }
        }
      })

      return { videoData, likedVideos }
    },
    onError: (error, _variables, context) => {
      queryClient.setQueryData(['video', videoId, userId], context.videoData)
      queryClient.setQueryData(['liked_videos', userId], context.likedVideos)
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['liked_videos']
      })
      queryClient.invalidateQueries({
        queryKey: ['stats']
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

const useToggleTweetLike = (tweetId, channelId, userId) => {
  return useMutation({
    mutationFn: () => toggleTweetLike(tweetId),
    onMutate: () => {
      const tweetData = queryClient.getQueryData(['userTweets', channelId, userId])
      console.log(tweetData)

      queryClient.setQueryData(['userTweets', channelId, userId], prev => {
        if (!prev) return prev;

        return {
          ...prev,
          data: prev.data.map(tweet => {
            if (tweet._id === tweetId) {
              return {
                ...tweet,
                likesCount: tweet.isLiked
                  ? tweet.likesCount - 1
                  : tweet.likesCount + 1,
                isLiked: !tweet.isLiked,
              }
            }
            return tweet;
          })
        }
      })


      return {
        tweetData
      }
    },
    onError: (error, _variables, context) => {
      queryClient.setQueryData(['userTweets', channelId, userId], context.tweetData)
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['userTweets']
      })
    }
  })
}


export {
  useGetUserLikedVideos,
  useToggleVideoLike,
  useToggleCommentLike,
  useToggleTweetLike
}