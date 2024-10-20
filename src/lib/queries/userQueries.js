import { useQuery } from "@tanstack/react-query"
import { getUserChannelInfo, getUserVideos } from "../../api/userApi"

const useFetchUserChannelInfo = (userId) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserChannelInfo(userId)
  })
}

const useFetchUserVideos = (userId) => {
  return useQuery({
    queryKey: ['video', userId],
    queryFn: () => getUserVideos(userId),
  })
}

export {
  useFetchUserChannelInfo,
  useFetchUserVideos
}