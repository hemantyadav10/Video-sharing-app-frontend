import { asyncHandler } from "../utils/asyncHandler";
import apiClient from "./apiClient";

const DASHBOARD_BASE_URL = '/dashboard';

// Fetches videos for the channel
const getChannelVideos = () => asyncHandler(async () => {
  const res = await apiClient.get(`${DASHBOARD_BASE_URL}/videos`);
  return res.data;
});

// Fetches statistics for a specific channel
const getChannelStats = (channelId, allVideos = true) => asyncHandler(async () => {
  const res = await apiClient.get(`${DASHBOARD_BASE_URL}/stats/${channelId}?allVideos=${allVideos}`);
  return res.data;
});

export {
  getChannelVideos,
  getChannelStats,
};
