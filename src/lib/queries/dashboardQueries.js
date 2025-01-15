import { useQuery } from "@tanstack/react-query"
import {
  getChannelStats,
  getChannelVideos
} from "../../api/dashboardApi"

const useGetChannleVideos = (isAuthenticated) => {
  return useQuery({
    queryKey: ['channel_videos'],
    queryFn: getChannelVideos,
    enabled: isAuthenticated, 
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