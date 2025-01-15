import { asyncHandler } from "../utils/asyncHandler";
import apiClient from "./apiClient";

const TWEETS_BASE_URL = '/tweets'

// Fetches tweets from a specific user
const getUserTweets = (userId) => asyncHandler(async () => {
  const res = await apiClient.get(`${TWEETS_BASE_URL}/user/${userId}`);
  return res.data;
});

// Creates a new tweet with the given content
const createTweet = (content) => asyncHandler(async () => {
  const res = await apiClient.post(TWEETS_BASE_URL, { content: content });
  return res.data;
});

// Deletes a specific tweet by its ID
const deleteTweet = (tweetId) => asyncHandler(async () => {
  const res = await apiClient.delete(`${TWEETS_BASE_URL}/${tweetId}`);
  return res.data;
});

// Updates a specific tweet with new content
const updateTweet = (tweetId, content) => asyncHandler(async () => {
  const res = await apiClient.patch(`${TWEETS_BASE_URL}/${tweetId}`, { content: content });
  return res.data;
});

export {
  getUserTweets,
  createTweet,
  deleteTweet,
  updateTweet
};
