import { useMutation, useQuery } from "@tanstack/react-query"
import { fetchAllVideos, fetchRandomVideos, fetchVideoById, togglePublishStatus } from "../../api/videoApi"
import { queryClient } from "../../main"

const useFetchVideos = () => {
  return useQuery({
    queryKey: ['vidoes'],
    queryFn: fetchAllVideos
  })
}

const useFetchRandomVideos = () => {
  return useQuery({
    queryKey: ['videos'],
    queryFn: fetchRandomVideos
  })
}

const useFetchVideoById = (videoId, userId) => {
  return useQuery({
    queryKey: ['video', videoId, userId],
    queryFn: () => fetchVideoById(videoId),
  })
}

const useTogglePublishStatus = (userId) => {
  return useMutation({
    mutationFn: (videoId) => togglePublishStatus(videoId),
    onSuccess: (response) => {
      console.log(response)
      queryClient.setQueryData(['channel_videos', userId], (prev) => {
        return {
          ...prev,
          data: prev.data.map(video => (
            video._id === response.data._id
              ? { ...video, isPublished: !video.isPublished }
              : video
          ))
        }
      })
    }
  })
}

export {
  useFetchVideos,
  useFetchVideoById,
  useFetchRandomVideos,
  useTogglePublishStatus
}