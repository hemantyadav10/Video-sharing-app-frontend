import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import {
  deleteVideo,
  fetchAllVideos,
  fetchRandomVideos,
  fetchVideoById,
  publishVideo,
  togglePublishStatus,
  updateVideo,
} from "../../api/videoApi"
import { queryClient } from "../../main"

const useFetchVideos = (searchParams, limit = 10) => {
  const clonedParams = new URLSearchParams(searchParams);
  clonedParams.set("limit", limit);
  const queryString = clonedParams.toString();

  return useInfiniteQuery({
    queryKey: ['videos', queryString],
    queryFn: ({ pageParam = 1 }) => fetchAllVideos(`${queryString}&page=${pageParam}`),
    getNextPageParam: (lastPage) => lastPage?.data?.nextPage || null,
    enabled: !!searchParams.get('query')
  });
};


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
      queryClient.invalidateQueries({ queryKey: ['videos'] })
      queryClient.invalidateQueries({ queryKey: ['video'] })
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
      queryClient.setQueryData(['stats', userId], prev => {
        if (!prev) return;
        return {
          ...prev,
          data: {
            ...prev.data, totalVideos: prev.data.totalVideos + 1
          }
        }
      })
    }
  })
}

const useDeleteVideo = (userId) => {
  return useMutation({
    mutationFn: deleteVideo,
    onSuccess: ({ data }) => {
      const videoId = data.videoId
      console.log(data)
      queryClient.setQueryData(['channel_videos', userId], prev => {
        return {
          ...prev,
          data: prev.data.filter(video => video._id !== videoId)
        }
      })
      queryClient.invalidateQueries()
    }
  })
}


export {
  useFetchVideos,
  useFetchVideoById,
  useFetchRandomVideos,
  useTogglePublishStatus,
  useUpdateVideo,
  usePublishVideo,
  useDeleteVideo
}