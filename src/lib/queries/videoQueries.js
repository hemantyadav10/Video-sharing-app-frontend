import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

const useFetchVideos = (searchParams, limit = 10) => {
  const clonedParams = new URLSearchParams(searchParams);
  clonedParams.set("limit", limit);
  const queryString = clonedParams.toString();

  return useInfiniteQuery({
    queryKey: ['videos', queryString],
    queryFn: ({ pageParam = 1 }) => fetchAllVideos(`${queryString}&page=${pageParam}`),
    getNextPageParam: (lastPage) => lastPage?.data?.nextPage || null,
    placeholderData: prev => prev,
    enabled: !!searchParams.get('query') && searchParams.get('type') !== "channels",
  });
};


const useFetchAllVideos = (limit = 12) => {
  return useInfiniteQuery({
    queryKey: ['videos'],
    queryFn: ({ pageParam = 1 }) => fetchAllVideos(`limit=${limit}&page=${pageParam}`),
    getNextPageParam: (lastPage) => lastPage?.data?.nextPage || null,
  })
}

const useFetchVideoById = (videoId, userId, ownerId) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['video', videoId, userId],
    queryFn: async () => {
      const data = await fetchVideoById(videoId);
      // Invalidate the user history query
      queryClient.invalidateQueries({ queryKey: ['watch_history'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      return data;
    },
  })
}

const useTogglePublishStatus = ({ limit, page }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (videoId) => togglePublishStatus(videoId),
    onSuccess: (response) => {
      queryClient.setQueryData(['channel_videos', { limit, page }], (prev) => {
        if (!prev) return;
        return {
          ...prev,
          data: {
            ...prev.data,
            docs: prev.data.docs.map(video => {
              return video._id === response.data._id
                ? { ...video, isPublished: response.data.isPublished }
                : video
            }),
          }
        }
      })
      queryClient.invalidateQueries({ queryKey: ['videos'] })
      queryClient.invalidateQueries({ queryKey: ['video'] })
      queryClient.invalidateQueries({ queryKey: ['stats', { "allVideos": false }] })
    }
  })
}

const useUpdateVideo = ({ limit, page }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ videoId, formData }) => updateVideo(videoId, formData),
    onSuccess: (res) => {
      queryClient.setQueryData(['channel_videos', { limit, page }], prev => {
        if (!prev) return;

        return {
          ...prev,
          data: {
            ...prev.data,
            docs: prev.data.docs.map(video => {
              return video._id === res.data._id
                ? { ...video, ...res.data }
                : video
            })
          }
        }
      })

      const queries = queryClient.getQueryCache().getAll();

      queries.forEach(query => {
        if (!query.queryKey[0].startsWith('stats')) {
          queryClient.invalidateQueries({ queryKey: query.queryKey });
        }
      });
    }
  })
}

const usePublishVideo = (userId, { limit, page }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => publishVideo(formData),
    onSuccess: (res) => {
      queryClient.setQueryData(['channel_videos', { limit, page }], prev => {
        if (!prev) return;

        return {
          ...prev,
          data: {
            ...prev.data,
            docs: [{ ...res.data, likes: 0 }, ...prev.data.docs],
            totalDocs: prev.data.totalDocs + 1
          }
        }
      })
      queryClient.setQueryData(['stats', { channelId: userId, allVideos: true }], prev => {
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

const useDeleteVideo = ({ limit, page }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVideo,
    onSuccess: ({ data }) => {
      const videoId = data.videoId
      queryClient.setQueryData(['channel_videos', { limit, page }], prev => {
        if (!prev) return;

        return {
          ...prev,
          data: {
            ...prev.data,
            docs: prev.data.docs.filter(video => video._id !== videoId),
            totalDocs: prev.data.totalDocs - 1
          }
        }
      })

      const queries = queryClient.getQueryCache().getAll();

      queries.forEach(query => {
        if (!query.queryKey[0].startsWith('channel_videos')) {
          queryClient.invalidateQueries({ queryKey: query.queryKey });
        }
      });

    }
  })
}

const useGetVideosByCategories = (category, limit = 12) => {
  return useInfiniteQuery({
    queryKey: ['videos', { category }],
    queryFn: ({ pageParam = 1 }) => fetchAllVideos(`category=${category}&limit=${limit}&page=${pageParam}`),
    getNextPageParam: (lastPage) => lastPage?.data?.nextPage || null,
    keepPreviousData: true,
  })
}

const useGetVideoByTag = (tag, limit = 12) => {
  return useInfiniteQuery({
    queryKey: ['videos', { tag: tag.toLowerCase() }],
    queryFn: ({ pageParam = 1 }) => getVideosByTag(tag, limit, pageParam),
    getNextPageParam: (lastPage) => lastPage?.data?.nextPage || null,
    keepPreviousData: true,
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
  useFetchVideos, useGetRelatedVideos, useGetVideoByTag,
  useGetVideosByCategories,
  usePublishVideo,
  useTogglePublishStatus,
  useUpdateVideo
};

