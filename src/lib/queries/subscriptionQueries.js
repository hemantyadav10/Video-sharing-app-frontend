import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { getUserSubscribedChannels, getVideosFromSubscribedChannels, toggleSubscription } from "../../api/subscription"
import { queryClient } from "../../main"

const useFetchSubcribedChannels = (subscriberId, limit = 6) => {
  return useInfiniteQuery({
    queryKey: ['subscriptionChannels', subscriberId],
    queryFn: ({ pageParam }) => getUserSubscribedChannels(subscriberId, limit, pageParam),
    getNextPageParam: (lastPage) => lastPage?.data?.nextPage || null,
    keepPreviousData: true,
    enabled: !!subscriberId,
  })
}

const useFetchSubscribedChannelVideos = (userId, limit = 12) => {
  return useInfiniteQuery({
    queryKey: ['videos', 'subscriptionVideos', userId],
    queryFn: ({ pageParam = 1 }) => getVideosFromSubscribedChannels(limit, pageParam),
    getNextPageParam: (lastPage) => lastPage?.data?.nextPage || null,
    keepPreviousData: true,
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