import apiClient from "./apiClient"

const getUserPlaylists = async (userId) => {
  const res = await apiClient.get(`/playlist/user/${userId}`)

  return res.data
}

export {
  getUserPlaylists 
}