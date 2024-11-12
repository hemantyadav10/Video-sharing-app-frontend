import { useMutation, useQuery } from "@tanstack/react-query"
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  updatePlaylist
} from "../../api/playlistApi"
import { queryClient } from "../../main"

const useFetchUserPlaylists = (userId) => {
  return useQuery({
    queryKey: ['playlist', 'all', userId],
    queryFn: () => getUserPlaylists(userId)
  })
}

const useFetchPlaylistById = (playlistId) => {
  return useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: () => getPlaylistById(playlistId)
  })
}

const useUpdatePlaylist = (playlistId) => {
  return useMutation({
    mutationFn: (data) => updatePlaylist(playlistId, data),
    onSuccess: (res) => {
      queryClient.setQueryData(['playlist', playlistId], (prev) => {
        if (!prev) return;

        return {
          ...prev,
          data: {
            ...prev.data,
            name: res.data.name,
            description: res.data.description,
            updatedAt: new Date(),
          }
        }
      })

      queryClient.invalidateQueries({ queryKey: ['playlist', 'all'] })
    }
  })
}

const useDeletePlaylist = (playlistId, userId) => {
  return useMutation({
    mutationFn: () => deletePlaylist(playlistId),
    onSuccess: () => {
      queryClient.setQueryData(['playlist', 'all', userId], (prev) => {
        if (!prev) return;

        return {
          ...prev,
          data: prev.data.filter((playlist) => {
            return playlist._id !== playlistId
          })
        }
      })

      queryClient.removeQueries({ queryKey: ['playlist', playlistId] })
    }
  })
}

const useCreatePlaylist = (userId) => {
  return useMutation({
    mutationFn: (data) => createPlaylist(data),
    onSuccess: (playlist) => {

      //update the all playlists cache after successfull creation without refetching 
      queryClient.setQueryData(['playlist', 'all', userId], (prev) => {
        const newPlaylist = {
          ...playlist.data,
          totalVideos: 0
        }

        if (!prev) return;

        return {
          ...prev,
          data: [
            ...prev.data,
            newPlaylist
          ]
        }
      })
    }
  })
}

const useAddVideoToPlaylist = (video, userId) => {
  return useMutation({
    mutationFn: ({ videoId, playlistId }) => addVideoToPlaylist(videoId, playlistId),
    onSuccess: (res) => {

      queryClient.setQueryData(['playlist', res.data._id], (prev) => {
        if (!prev) return;
        return {
          ...prev,
          data: {
            ...prev.data,
            totalVideos: prev.data.totalVideos + 1,
            updatedAt: new Date(),
            videos: [
              ...prev.data.videos,
              video
            ]
          }
        }
      })

      queryClient.setQueryData(['playlist', 'all', userId], (prev) => {
        if (!prev) return;
        return {
          ...prev,
          data: prev.data.map((playlist) => {
            if (playlist._id === res.data._id) {
              return {
                ...playlist,
                totalVideos: (playlist.totalVideos || 0) + 1,
                thumbnail: playlist.thumbnail || video.thumbnail,
                updatedAt: new Date(),
                videos: [...playlist.videos, video._id]
              }
            }
            return playlist
          })
        }
      })
    }
  })
}

export {
  useFetchUserPlaylists,
  useFetchPlaylistById,
  useUpdatePlaylist,
  useDeletePlaylist,
  useCreatePlaylist,
  useAddVideoToPlaylist
}