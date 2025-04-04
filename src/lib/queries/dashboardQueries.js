import { useQuery } from "@tanstack/react-query"
import {
  getChannelStats,
  getChannelVideos
} from "../../api/dashboardApi"

const useGetChannleVideos = (isAuthenticated, limit = 5, page = 1, sortBy = 'createdAt', sortOrder = 'desc') => {
  return useQuery({
    queryKey: ['channel_videos', { limit, page }],
    queryFn: () => getChannelVideos(limit, page, sortBy, sortOrder),
    enabled: isAuthenticated,
    keepPreviousData: true,
    placeholderData: (previousData) => previousData
  })
}

const useGetChannelStats = (channelId, allVideos = true) => {
  return useQuery({
    queryKey: ['stats', { channelId, allVideos }],
    queryFn: () => getChannelStats(channelId, allVideos),
  })
}

export {
  useGetChannleVideos,
  useGetChannelStats
}