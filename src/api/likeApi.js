import { asyncHandler } from "../utils/asyncHandler";
import apiClient from "./apiClient";

const LIKES_BASE_URL = '/likes';

// Fetches a list of videos liked by the user
const getUserLikedVideos = () => asyncHandler(async () => {
  const res = await apiClient.get(`${LIKES_BASE_URL}/videos`);
  return res.data;
});

// Toggles like status for a specific video
const toggleVideoLike = (videoId) => asyncHandler(async () => {
  const res = await apiClient.post(`${LIKES_BASE_URL}/toggle/v/${videoId}`);
  return res.data;
});

// Toggles like status for a specific comment
const toggleCommentLike = (commentId) => asyncHandler(async () => {
  const res = await apiClient.post(`${LIKES_BASE_URL}/toggle/c/${commentId}`);
  return res.data;
});

// Toggles like status for a specific tweet
const toggleTweetLike = (tweetId) => asyncHandler(async () => {
  const res = await apiClient.post(`${LIKES_BASE_URL}/toggle/t/${tweetId}`);
  return res.data;
});

export {
  getUserLikedVideos,
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike
};
