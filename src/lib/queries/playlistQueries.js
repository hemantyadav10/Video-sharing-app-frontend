import { useQuery } from "@tanstack/react-query"
import { getPlaylistById, getUserPlaylists } from "../../api/playlistApi"

const useFetchUserPlaylists = (userId) => {
  return useQuery({
    queryKey: ['user_playlists', userId],
    queryFn: () => getUserPlaylists(userId)
  })
}

const useFetchPlaylistById = (playlistId) => {
  return useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: () => getPlaylistById(playlistId)
  })
}

export {
  useFetchUserPlaylists,
  useFetchPlaylistById
}