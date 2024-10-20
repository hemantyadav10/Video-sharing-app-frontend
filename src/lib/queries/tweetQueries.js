import { useQuery } from "@tanstack/react-query"
import { getUserTweets } from "../../api/tweetApi"

const useFetchUserTweets = (userId) => {
  return useQuery({
    queryKey: ['userTweets', userId],
    queryFn: () => getUserTweets(userId)
  })
}

export {
  useFetchUserTweets
}