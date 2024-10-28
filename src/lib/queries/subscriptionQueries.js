import { useMutation, useQuery } from "@tanstack/react-query"
import { getUserSubscribedChannels, getVideosFromSubscribedChannels, toggleSubscription } from "../../api/subscription"
import { queryClient } from "../../main"

const useFetchSubcribedChannels = (subscriberId) => {
  return useQuery({
    queryKey: ['videos', subscriberId],
    queryFn: () => getUserSubscribedChannels(subscriberId),
    enabled: !!subscriberId
  })
}

const useFetchSubscribedChannelVideos = (userId) => {
  return useQuery({
    queryKey: ['subscriptionVideos', userId],
    queryFn: getVideosFromSubscribedChannels,
    enabled: !!userId
  })
}

const useToggleSubscription = (channelId, userId) => {
  return useMutation({
    mutationFn: () => toggleSubscription(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', channelId, userId], 
      })
    }
  })
}

export {
  useFetchSubcribedChannels,
  useFetchSubscribedChannelVideos,
  useToggleSubscription
}