import { asyncHandler } from "../utils/asyncHandler";
import apiClient from "./apiClient";

const BASE_URL = '/searchHistory'

const fetchUserSearchHistory = () => asyncHandler(async () => {
  const { data } = await apiClient.get(BASE_URL);
  return data;
});

const clearSearchHistory = () => asyncHandler(async () => {
  const { data } = await apiClient.delete(BASE_URL);
  return data;
});

const deleteSearchItem = (searchTerm) => asyncHandler(async () => {
  const { data } = await apiClient.patch(BASE_URL, { searchTerm });
  return data;
});

const setSearchHistory = (searchTerm) => asyncHandler(async () => {
  const { data } = await apiClient.post(BASE_URL, { searchTerm });
  return data;
});

export {
  fetchUserSearchHistory,
  clearSearchHistory,
  deleteSearchItem,
  setSearchHistory
}