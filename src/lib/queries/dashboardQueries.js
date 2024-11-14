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

const useGetChannelStats = (userId) => {
  return useQuery({
    queryKey: ['stats', userId],
    queryFn: getChannelStats,
  })
}

export {
  useGetChannleVideos,
  useGetChannelStats
}