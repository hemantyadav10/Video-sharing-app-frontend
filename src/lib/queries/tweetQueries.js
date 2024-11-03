import { useMutation, useQuery } from "@tanstack/react-query"
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../../api/tweetApi"
import { queryClient } from "../../main"

const useFetchUserTweets = (channelId, currentUserId) => {
  return useQuery({
    queryKey: ['userTweets', channelId, currentUserId],
    queryFn: () => getUserTweets(channelId)
  })
}

const useCreateTweet = (user, channelId) => {
  return useMutation({
    mutationFn: (content) => createTweet(content),
    onSuccess: (tweet) => {
      queryClient.setQueryData(['userTweets', channelId, user._id], (prev) => {
        return {
          ...prev,
          data: [
            {
              _id: Date.now(),
              content: tweet.data.content,
              owner: {
                _id: user._id,
                username: user.username,
                fullName: user.fullName,
                avatar: user.avatar
              },
              createdAt: new Date(),
              updatedAt: new Date(),
              likesCount: 0,
              isliked: false
            },
            ...prev.data
          ],
        }
      })
      queryClient.invalidateQueries({ queryKey: ['userTweets', channelId] });
    }
  })
}

const useDeleteTweet = (tweetId, channelId) => {
  return useMutation({
    mutationFn: (tweetId) => deleteTweet(tweetId),
    onSuccess: () => {
      queryClient.setQueryData(['userTweets', channelId, channelId], (prev) => {
        console.log(prev, channelId)
        return {
          ...prev,
          data: (prev.data.filter((tweet) => tweet._id !== tweetId))
        }
      })
      queryClient.invalidateQueries({ queryKey: ['userTweets', channelId] });

    }
  })
}

const useUpdateTweet = (tweetId, channelId) => {
  return useMutation({
    mutationFn: (content) => updateTweet(tweetId, content),
    onSuccess: (updatedTweet) => {
      queryClient.setQueryData(['userTweets', channelId, channelId], (prev) => {
        return {
          ...prev,
          data: prev.data.map((tweet) => {
            if (tweet._id === tweetId) {
              return {
                ...tweet,
                content: updatedTweet.data.content,
                updatedAt: new Date()
              }
            }
            return tweet
          })
        }
      })
      queryClient.invalidateQueries({ queryKey: ['userTweets', channelId] })
    }
  })
}

export {
  useFetchUserTweets,
  useCreateTweet,
  useDeleteTweet,
  useUpdateTweet
}