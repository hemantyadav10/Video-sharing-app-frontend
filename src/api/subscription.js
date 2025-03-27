import { asyncHandler } from "../utils/asyncHandler";
import apiClient from "./apiClient";

const SUBSCRIPTIONS_BASE_URL = '/subscriptions'

// Fetches a list of channels the user is subscribed to
const getUserSubscribedChannels = (subscriberId, limit = 6, page = 1) => asyncHandler(async () => {
  const res = await apiClient.get(`${SUBSCRIPTIONS_BASE_URL}/u/${subscriberId}?limit=${limit}&page=${page}`);
  return res.data;
});

// Fetches videos from the channels the user is subscribed to
const getVideosFromSubscribedChannels = (limit = 12, page = 1) => asyncHandler(async () => {
  const res = await apiClient.get(`${SUBSCRIPTIONS_BASE_URL}/videos?limit=${limit}&page=${page}`);
  return res.data;
});

// Toggles subscription status for a specific channel
const toggleSubscription = (channelId) => asyncHandler(async () => {
  const res = await apiClient.post(`${SUBSCRIPTIONS_BASE_URL}/c/${channelId}`);
  return res.data;
});

const getSubscribers = (limit = 3, page = 1, sortField = "createdAt", sortOrder = "desc") => asyncHandler(async () => {
  const { data } = await apiClient.get(`${SUBSCRIPTIONS_BASE_URL}?limit=${limit}&page=${page}&sortField=${sortField}&sortOrder=${sortOrder}`);
  return data;
});

export {
  getUserSubscribedChannels,
  getVideosFromSubscribedChannels,
  toggleSubscription,
  getSubscribers
};
