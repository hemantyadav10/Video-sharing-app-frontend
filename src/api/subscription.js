import { asyncHandler } from "../utils/asyncHandler";
import apiClient from "./apiClient";

const SUBSCRIPTIONS_BASE_URL = '/subscriptions'

// Fetches a list of channels the user is subscribed to
const getUserSubscribedChannels = (subscriberId) => asyncHandler(async () => {
  const res = await apiClient.get(`${SUBSCRIPTIONS_BASE_URL}/u/${subscriberId}`);
  return res.data;
});

// Fetches videos from the channels the user is subscribed to
const getVideosFromSubscribedChannels = () => asyncHandler(async () => {
  const res = await apiClient.get(`${SUBSCRIPTIONS_BASE_URL}/videos`);
  return res.data;
});

// Toggles subscription status for a specific channel
const toggleSubscription = (channelId) => asyncHandler(async () => {
  const res = await apiClient.post(`${SUBSCRIPTIONS_BASE_URL}/c/${channelId}`);
  return res.data;
});

export {
  getUserSubscribedChannels,
  getVideosFromSubscribedChannels,
  toggleSubscription
};
