import { useMutation, useQuery } from "@tanstack/react-query"
import { createTweet, deleteTweet, getUserTweets } from "../../api/tweetApi"
import { queryClient } from "../../main"


const useFetchUserTweets = (userId) => {
  return useQuery({
    queryKey: ['userTweets', userId],
    queryFn: () => getUserTweets(userId)
  })
}

const useCreateTweet = (user) => {
  return useMutation({
    mutationFn: (content) => createTweet(content),
    onSuccess: (tweet) => {
      queryClient.setQueryData(['userTweets', user._id], (prev) => {
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
      queryClient.invalidateQueries({ queryKey: ['userTweets', user._id] });
    }
  })
}

const useDeleteTweet = (user, tweetId) => {
  return useMutation({
    mutationFn: (tweetId) => deleteTweet(tweetId),
    onSuccess: () => {
      queryClient.setQueryData(['userTweets', user._id], (prev) => {
        return {
          ...prev,
          data: (prev.data.filter((tweet) => tweet._id !== tweetId))
        }
      })
    }
  })
}


export {
  useFetchUserTweets,
  useCreateTweet,
  useDeleteTweet
}