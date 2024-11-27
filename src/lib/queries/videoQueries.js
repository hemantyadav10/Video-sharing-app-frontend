import { useMutation, useQuery } from "@tanstack/react-query"
import {
  fetchAllVideos,
  fetchRandomVideos,
  fetchVideoById,
  publishVideo,
  togglePublishStatus,
  updateVideo,
} from "../../api/videoApi"
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

const useUpdateVideo = (userId) => {
  return useMutation({
    mutationFn: ({ videoId, formData }) => updateVideo(videoId, formData),
    onSuccess: (res) => {
      queryClient.setQueryData(['channel_videos', userId], prev => {
        if (!prev) return;

        return {
          ...prev,
          data: prev.data.map(video => {
            return video._id === res.data._id
              ? { ...video, ...res.data }
              : video
          })
        }
      })

      queryClient.invalidateQueries({ queryKey: ['video', userId] })
    }
  })
}

const usePublishVideo = (userId) => {
  return useMutation({
    mutationFn: (formData) => publishVideo(formData),
    onSuccess: (res) => {
      queryClient.setQueryData(['channel_videos', userId], prev => {
        return {
          ...prev,
          data: [{ ...res.data, likes: 0 }, ...prev.data]
        }
      })
    }
  })
}


export {
  useFetchVideos,
  useFetchVideoById,
  useFetchRandomVideos,
  useTogglePublishStatus,
  useUpdateVideo,
  usePublishVideo
}