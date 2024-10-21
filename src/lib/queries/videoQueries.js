import { useQuery } from "@tanstack/react-query"
import { fetchAllVideos, fetchVideoById } from "../../api/videoApi"

const useFetchVideos = () => {
  return useQuery({
    queryKey: ['vidoes'],
    queryFn: fetchAllVideos
  })
}

const useFetchVideoById = (videoId) => {
  return useQuery({
    queryKey: ['video', videoId],
    queryFn: () => fetchVideoById(videoId),
  })
}

export {
  useFetchVideos,
  useFetchVideoById
}