import apiClient from "./apiClient"

const getUserPlaylists = async (userId) => {
  const res = await apiClient.get(`/playlist/user/${userId}`)

  return res.data
}

const getPlaylistById = async (playlistId) => {
  const res = await apiClient.get(`/playlist/${playlistId}`)

  return res.data;
}

export {
  getUserPlaylists,
  getPlaylistById
}