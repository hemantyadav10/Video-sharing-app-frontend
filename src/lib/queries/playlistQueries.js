import { useMutation, useQuery } from "@tanstack/react-query"
import {
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
        return {
          ...prev,
          data: {
            ...prev.data,
            name: res.data.name,
            description: res.data.description,
          }
        }
      })
      queryClient.invalidateQueries({ queryKey: ['playlist'] })
    }
  })
}

const useDeletePlaylist = (playlistId, userId) => {
  return useMutation({
    mutationFn: () => deletePlaylist(playlistId),
    onSuccess: () => {
      queryClient.setQueryData(['playlist', 'all', userId], (prev) => {
        return {
          ...prev,
          data: prev.data.filter((playlist) => {
            return playlist._id !== playlistId
          })
        }
      })

      queryClient.invalidateQueries({ queryKey: ['playlist', 'all', userId] })
      queryClient.removeQueries({ queryKey: ['playlist', playlistId] })
    }
  })
}

export {
  useFetchUserPlaylists,
  useFetchPlaylistById,
  useUpdatePlaylist,
  useDeletePlaylist
}