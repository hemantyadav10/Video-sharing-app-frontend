import { asyncHandler } from "../utils/asyncHandler";
import apiClient from "./apiClient";

const VIDEO_BASE_URL = '/videos'

// Fetches all videos with an optional query string for filtering
const fetchAllVideos = (queryString = '') => asyncHandler(async () => {
  const url = `${VIDEO_BASE_URL}?${queryString}`;
  const response = await apiClient.get(url);
  return response.data;
});

// Fetches a specific video by its ID
const fetchVideoById = (videoId) => asyncHandler(async () => {
  const res = await apiClient.get(`${VIDEO_BASE_URL}/${videoId}`);
  return res.data;
});

// Toggles the publish status of a video
const togglePublishStatus = (videoId) => asyncHandler(async () => {
  const res = await apiClient.patch(`${VIDEO_BASE_URL}/toggle/publish/${videoId}`);
  return res.data;
});

// Updates video details with the provided form data
const updateVideo = (videoId, formData) => asyncHandler(async () => {
  const res = await apiClient.patch(`${VIDEO_BASE_URL}/${videoId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
});

// Publishes a new video with the provided form data
const publishVideo = (formData) => asyncHandler(async () => {
  const res = await apiClient.post(VIDEO_BASE_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
});

// Deletes a video by its ID
const deleteVideo = (videoId) => asyncHandler(async () => {
  const res = await apiClient.delete(`${VIDEO_BASE_URL}/${videoId}`);
  return res.data;
});

// Fetches videos with a specific tag
const getVideosByTag = (tag) => asyncHandler(async () => {
  const res = await apiClient.get(`${VIDEO_BASE_URL}/tags/${tag}`);
  return res.data;
});

// Fetches related videos based on a specific video ID with pagination
const getRelatedVideos = (videoId, page = 1, limit = 10) => asyncHandler(async () => {
  const res = await apiClient.get(`${VIDEO_BASE_URL}/related/${videoId}?page=${page}&limit=${limit}`);
  return res.data;
});


export {
  fetchAllVideos,
  fetchVideoById,
  togglePublishStatus,
  updateVideo,
  publishVideo,
  deleteVideo,
  getVideosByTag,
  getRelatedVideos
}