import apiClient from "./apiClient"

const getUserChannelInfo = async (userId) => {
  const response = await apiClient.get(`users/channel/${userId}`)
  return response.data;
}

const getUserVideos = async (userId, filters) => {
  const res = await apiClient.get(`videos?userId=${userId}&${filters}`)
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

const getUserWatchHistory = async () => {
  const res = await apiClient.get('/users/watch-history')
  return res.data
}

const changePassword = async (body) => {
  const res = await apiClient.post('/users/change-password', body)
  return res.data
}

const updateAccountDetails = async (details) => {
  const res = await apiClient.patch('/users/update-account', details)
  return res.data
}

export {
  getUserChannelInfo,
  getUserVideos,
  loginUser,
  logoutUser,
  getCurrentUser,
  getUserWatchHistory,
  changePassword,
  updateAccountDetails
}