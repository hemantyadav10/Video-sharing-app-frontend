import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../../api/tweetApi"

const useFetchUserTweets = (channelId, currentUserId, limit = null) => {
  return useQuery({
    queryKey: ['userTweets', channelId, currentUserId, limit],
    queryFn: () => getUserTweets(channelId, limit),
    enabled: !!channelId,
  })
}

const useCreateTweet = (user, channelId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (content) => createTweet(content),
    onSuccess: (response, content) => {
      queryClient.setQueryData(['userTweets', channelId, user._id, null], (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          data: [
            {
              _id: response?.data?._id || Date.now(),
              content: response?.data?.content || content,
              owner: user,
              createdAt: response?.data?.createdAt || new Date(),
              updatedAt: response?.data?.updatedAt || new Date(),
              likesCount: 0,
              isliked: false
            },
            ...prev.data
          ],
        }
      })
      // queryClient.invalidateQueries({ queryKey: ['userTweets', channelId] });
    }
  })
}

const useDeleteTweet = (tweetId, channelId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (tweetId) => deleteTweet(tweetId),
    onSuccess: () => {
      queryClient.setQueryData(['userTweets', channelId, channelId, null], (prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          data: (prev.data.filter((tweet) => tweet._id !== tweetId))
        }
      })

      // queryClient.invalidateQueries({ queryKey: ['userTweets', channelId] });

    }
  })
}

const useUpdateTweet = (tweetId, channelId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (content) => updateTweet(tweetId, content),
    onSuccess: (response, content) => {
      queryClient.setQueryData(['userTweets', channelId, channelId, null], (prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          data: prev.data.map((tweet) => {
            if (tweet._id === tweetId) {
              return {
                ...tweet,
                content: response?.data?.content || content,
                updatedAt: response?.data?.updatedAt || new Date()
              }
            }
            return tweet;
          })
        }
      })
      // queryClient.invalidateQueries({ queryKey: ['userTweets', channelId] })
    }
  })
}

export {
  useCreateTweet,
  useDeleteTweet, useFetchUserTweets, useUpdateTweet
}
