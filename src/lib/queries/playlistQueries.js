import { useQuery } from "@tanstack/react-query"
import { getUserPlaylists } from "../../api/playlistApi"

const useFetchUserPlaylists = (userId) => {
  return useQuery({
    queryKey: ['user_playlists', userId],
    queryFn: () => getUserPlaylists(userId)
  })
}

export {
  useFetchUserPlaylists
}