import { useQuery } from "@tanstack/react-query"
import {
  getChannelStats,
  getChannelVideos
} from "../../api/dashboardApi"

const useGetChannleVideos = (userId) => {
  return useQuery({
    queryKey: ['channel_videos', userId],
    queryFn: getChannelVideos,
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