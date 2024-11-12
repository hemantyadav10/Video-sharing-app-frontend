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

const deletePlaylist = async (playlistId) => {
  const res = await apiClient.delete(`/playlist/${playlistId}`)
  return res.data
}

const createPlaylist = async (data) => {
  const res = await apiClient.post('/playlist', data)
  return res.data
}

const addVideoToPlaylist = async (videoId, playlistId) => {
  const res = await apiClient.patch(`/playlist/add/${videoId}/${playlistId}`)

  return res.data
}

export {
  getUserPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  createPlaylist,
  addVideoToPlaylist
}