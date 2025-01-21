import { asyncHandler } from "../utils/asyncHandler"
import apiClient from "./apiClient"

const USER_BASE_URL = '/users'

// Fetches user channel information based on user ID
const getUserChannelInfo = (userId) => asyncHandler(async () => {
  const response = await apiClient.get(`${USER_BASE_URL}/channel/${userId}`)
  return response.data;
})

// Fetches videos of a user with applied filters
const getUserVideos = (userId, filters) => asyncHandler(async () => {
  const res = await apiClient.get(`videos?userId=${userId}&${filters}`)
  return res.data
})

// Logs in the user with provided data
const loginUser = (data) => asyncHandler(async () => {
  const res = await apiClient.post(`${USER_BASE_URL}/login`, data)
  return res.data
})

// Registers a new user with the provided form data
const registerUser = (formData) => asyncHandler(async () => {
  const res = await apiClient.post(`${USER_BASE_URL}/register`, formData, {
    headers: { "Content-Type": 'multipart/form-data' }
  })
  return res.data
})

// Logs out the current user
const logoutUser = () => asyncHandler(async () => {
  const res = await apiClient.post(`${USER_BASE_URL}/logout`)
  return res.data
})

// Fetches current logged-in user information
const getCurrentUser = () => asyncHandler(async () => {
  const res = await apiClient.get(`${USER_BASE_URL}/current-user`);
  return res.data;
})

// Fetches user's watch history with pagination
const getUserWatchHistory = (limit = 3, page = 1) => asyncHandler(async () => {
  const res = await apiClient.get(`${USER_BASE_URL}/watch-history?limit=${limit}&page=${page}`)
  return res.data
})

// Changes user's password with the provided data
const changePassword = (body) => asyncHandler(async () => {
  const res = await apiClient.post(`${USER_BASE_URL}/change-password`, body)
  return res.data
})

// Updates user account details with new information
const updateAccountDetails = (details) => asyncHandler(async () => {
  const res = await apiClient.patch(`${USER_BASE_URL}/update-account`, details)
  return res.data
})

// Clears user's watch history
const clearWatchHistory = () => asyncHandler(async () => {
  const res = await apiClient.delete(`${USER_BASE_URL}/watch-history`);
  return res.data
})

// Updates user's avatar with the provided file
const updateAvatar = (avatar) => asyncHandler(async () => {
  const res = await apiClient.patch(`${USER_BASE_URL}/avatar`, avatar,
    { headers: { "Content-Type": 'multipart/form-data' } }
  )
  return res.data
})

// Updates user's cover image with the provided file
const updateCoverImage = (coverImage) => asyncHandler(async () => {
  const res = await apiClient.patch(`${USER_BASE_URL}/cover-image`, coverImage,
    { headers: { "Content-Type": 'multipart/form-data' } }
  )
  return res.data
})

const searchUser = (query) => asyncHandler(async () => {
  const res = await apiClient.get(`${USER_BASE_URL}/search?query=${query}`)
  return res.data;
})

export {
  getUserChannelInfo,
  getUserVideos,
  loginUser,
  logoutUser,
  getCurrentUser,
  getUserWatchHistory,
  changePassword,
  updateAccountDetails,
  clearWatchHistory,
  registerUser,
  updateAvatar,
  updateCoverImage,
  searchUser
}