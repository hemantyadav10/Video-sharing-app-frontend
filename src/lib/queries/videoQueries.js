import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteVideo,
  fetchAllVideos,
  fetchVideoById,
  getRelatedVideos,
  getVideosByTag,
  publishVideo,
  togglePublishStatus,
  updateVideo,
} from "../../api/videoApi";
import { queryClient } from "../../main";

const useFetchVideos = (searchParams, limit = 10) => {
  const clonedParams = new URLSearchParams(searchParams);
  clonedParams.set("limit", limit);
  const queryString = clonedParams.toString();

  return useInfiniteQuery({
    queryKey: ['videos', queryString],
    queryFn: ({ pageParam = 1 }) => fetchAllVideos(`${queryString}&page=${pageParam}`),
    getNextPageParam: (lastPage) => lastPage?.data?.nextPage || null,
    keepPreviousData: true,
    enabled: !!searchParams.get('query') && searchParams.get('type') !== "channels",
  });
};


const useFetchAllVideos = (limit = 2) => {
  return useInfiniteQuery({
    queryKey: ['videos'],
    queryFn: ({ pageParam = 1 }) => fetchAllVideos(`limit=${limit}&page=${pageParam}`),
    getNextPageParam: (lastPage) => lastPage?.data?.nextPage || null,
  })
}

const useFetchVideoById = (videoId, userId, ownerId) => {
  return useQuery({
    queryKey: ['video', videoId, userId],
    queryFn: () => fetchVideoById(videoId),
    queryFn: async () => {
      const data = await fetchVideoById(videoId);
      // Invalidate the user history query
      queryClient.invalidateQueries({ queryKey: ['watch_history'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      return data;
    },
  })
}

const useTogglePublishStatus = (userId) => {
  return useMutation({
    mutationFn: (videoId) => togglePublishStatus(videoId),
    onSuccess: (response) => {
      console.log(response)
      queryClient.setQueryData(['channel_videos'], (prev) => {
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
      queryClient.invalidateQueries({ queryKey: ['stats', { "allVideos": false }] })
    }
  })
}

const useUpdateVideo = (userId) => {
  return useMutation({
    mutationFn: ({ videoId, formData }) => updateVideo(videoId, formData),
    onSuccess: (res) => {
      queryClient.setQueryData(['channel_videos'], prev => {
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
      queryClient.setQueryData(['channel_videos'], prev => {
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
      queryClient.setQueryData(['channel_videos'], prev => {
        return {
          ...prev,
          data: prev.data.filter(video => video._id !== videoId)
        }
      })
      queryClient.invalidateQueries()
    }
  })
}

const useGetVideosByCategories = (category) => {
  return useQuery({
    queryKey: ['videos', { category }],
    queryFn: () => fetchAllVideos(`category=${category}`)
  })
}

const useGetVideoByTag = (tag) => {
  return useQuery({
    queryKey: ['videos', { tag }],
    queryFn: () => getVideosByTag(tag)
  })
}

const useGetRelatedVideos = (videoId, limit = 10) => {
  return useInfiniteQuery({
    queryKey: ['videos', 'related_videos', { videoId }],
    queryFn: ({ pageParam = 1 }) => getRelatedVideos(videoId, pageParam, limit),
    getNextPageParam: (lastPage) => lastPage?.data?.nextPage || null,
    keepPreviousData: true,
  })
}


export {
  useDeleteVideo,
  useFetchAllVideos,
  useFetchVideoById,
  useFetchVideos,
  useGetVideoByTag,
  useGetVideosByCategories,
  usePublishVideo,
  useTogglePublishStatus,
  useUpdateVideo,
  useGetRelatedVideos
};
