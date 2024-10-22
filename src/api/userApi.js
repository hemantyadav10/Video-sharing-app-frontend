import apiClient from "./apiClient"

const getUserChannelInfo = async (userId) => {
  const response = await apiClient.get(`users/channel/${userId}`)
  return response.data;
}

const getUserVideos = async (userId) => {
  const res = await apiClient.get(`videos?userId=${userId}`)
  return res.data
}

const loginUser = async (data) => {
  const res = await apiClient.post('/users/login', data)
  return res.data
}

const logoutUser = async () => {
  const res = await apiClient.post('users/logout')
  return res.data
}

const getCurrentUser = async () => {
  const res = await apiClient.get('/users/current-user');
  return res.data;
}

export {
  getUserChannelInfo,
  getUserVideos,
  loginUser,
  logoutUser,
  getCurrentUser
}