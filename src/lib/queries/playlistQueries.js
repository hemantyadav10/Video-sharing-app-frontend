import { useMutation, useQuery } from "@tanstack/react-query"
import { getPlaylistById, getUserPlaylists, updatePlaylist } from "../../api/playlistApi"
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

export {
  useFetchUserPlaylists,
  useFetchPlaylistById,
  useUpdatePlaylist
}