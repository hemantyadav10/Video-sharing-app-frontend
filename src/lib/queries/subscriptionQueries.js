import { useMutation, useQuery } from "@tanstack/react-query"
import { getUserSubscribedChannels, getVideosFromSubscribedChannels, toggleSubscription } from "../../api/subscription"
import { queryClient } from "../../main"

const useFetchSubcribedChannels = (subscriberId) => {
  return useQuery({
    queryKey: ['subscriptionChannels', subscriberId],
    queryFn: () => getUserSubscribedChannels(subscriberId),
    enabled: !!subscriberId
  })
}

const useFetchSubscribedChannelVideos = (userId) => {
  return useQuery({
    queryKey: ['videos', 'subscriptionVideos', userId],
    queryFn: getVideosFromSubscribedChannels,
    enabled: !!userId
  })
}

const useToggleSubscription = (channelId, userId) => {
  return useMutation({
    mutationFn: () => toggleSubscription(channelId),
    onSuccess: () => {
      queryClient.setQueryData(['user', channelId, userId], prev => {
        if (!prev) return prev;
        return {
          ...prev,
          data: {
            ...prev.data,
            subscribersCount: prev.data.isSubscribed
              ? prev.data.subscribersCount - 1
              : prev.data.subscribersCount + 1,
            isSubscribed: !prev.data.isSubscribed,
          }
        }
      })

      queryClient.invalidateQueries({
        queryKey: ['user', channelId, userId],
      })
      queryClient.invalidateQueries({
        queryKey: ['subscriptionChannels', userId],
      })
      queryClient.invalidateQueries({
        queryKey: ['videos', 'subscriptionVideos', userId],
      })
      queryClient.invalidateQueries({
        queryKey: ['search'],
      })
    }
  })
}

export {
  useFetchSubcribedChannels,
  useFetchSubscribedChannelVideos,
  useToggleSubscription
}