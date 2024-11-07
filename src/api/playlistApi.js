import apiClient from "./apiClient"

const getUserPlaylists = async (userId) => {
  const res = await apiClient.get(`/playlist/user/${userId}`)

  return res.data
}

const getPlaylistById = async (playlistId) => {
  const res = await apiClient.get(`/playlist/${playlistId}`)

  return res.data;
}

const updatePlaylist = async (playlistId, data) => {
  const res = await apiClient.patch(`/playlist/${playlistId}`, data)
  return res.data
}

export {
  getUserPlaylists,
  getPlaylistById, 
  updatePlaylist
}