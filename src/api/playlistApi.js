import { asyncHandler } from "../utils/asyncHandler";
import apiClient from "./apiClient";

const PLAYLIST_BASE_URL = '/playlist';

// Retrieves all playlists created by a specific user
const getUserPlaylists = (userId) => asyncHandler(async () => {
  const res = await apiClient.get(`${PLAYLIST_BASE_URL}/user/${userId}`);
  return res.data;
});

// Retrieves a specific playlist's details by its ID
const getPlaylistById = (playlistId) => asyncHandler(async () => {
  const res = await apiClient.get(`${PLAYLIST_BASE_URL}/${playlistId}`);
  return res.data;
});

// Updates a playlist's information based on provided data
const updatePlaylist = (playlistId, data) => asyncHandler(async () => {
  const res = await apiClient.patch(`${PLAYLIST_BASE_URL}/${playlistId}`, data);
  return res.data;
});

// Deletes a playlist by ID and returns the confirmation response
const deletePlaylist = (playlistId) => asyncHandler(async () => {
  const res = await apiClient.delete(`${PLAYLIST_BASE_URL}/${playlistId}`);
  return res.data;
});

// Creates a new playlist with given data
const createPlaylist = (data) => asyncHandler(async () => {
  const res = await apiClient.post(PLAYLIST_BASE_URL, data);
  return res.data;
});

// Adds a video to a specified playlist by their IDs
const addVideoToPlaylist = (videoId, playlistId) => asyncHandler(async () => {
  const res = await apiClient.patch(`/playlist/add/${videoId}/${playlistId}`);
  return res.data;
});

// Removes a video from a playlist by video and playlist IDs
const removeVideoFromPlaylist = (videoId, playlistId) => asyncHandler(async () => {
  const res = await apiClient.patch(`${PLAYLIST_BASE_URL}/remove/${videoId}/${playlistId}`);
  return res.data;
});

export {
  getUserPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  createPlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
};
