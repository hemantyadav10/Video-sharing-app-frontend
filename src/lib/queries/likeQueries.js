import { useQuery } from "@tanstack/react-query"
import { getUserLikedVideos } from "../../api/likeApi"

const useGetUserLikedVideos = (user) => {
  return useQuery({
    queryKey: ['liked_videos', user],
    queryFn: getUserLikedVideos,
    enabled: !!user
  })
}

export {
  useGetUserLikedVideos
}