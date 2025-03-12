import { useMutation, useQuery } from "@tanstack/react-query"
import { clearSearchHistory, deleteSearchItem, fetchUserSearchHistory, setSearchHistory } from "../../api/searchHistoryApi"
import { queryClient } from "../../main"
import toast from "react-hot-toast"

const useGetUserSearchHistory = (userId) => {
  return useQuery({
    queryKey: ['search_history'],
    queryFn: fetchUserSearchHistory,
    enabled: !!userId
  })
}

const useClearSearchHistory = () => {
  return useMutation({
    mutationFn: clearSearchHistory,
    onSuccess: () => {
      queryClient.setQueryData(["search_history"], (prev) => {
        if (!prev) return;

        return {
          ...prev,
          data: {
            ...prev.data,
            searches: []
          }
        }
      })
    },
    onError: (err) => {
      const errorMessage = err?.response?.data?.message || 'Something went wrong. Please try again later';
      toast.error(errorMessage);
    }
  })
}


const useDeleteSearchItem = () => {
  return useMutation({
    mutationFn: (searchTerm) => deleteSearchItem(searchTerm),
    onMutate: async (searchTerm) => {
      await queryClient.cancelQueries(["search_history"])

      const previousSearches = queryClient.getQueryData(["search_history"])

      queryClient.setQueryData(["search_history"], (prev) => {
        if (!prev) return previousSearches;
        return {
          ...prev,
          data: {
            ...prev.data,
            searches: prev.data.searches.filter(item => item.toLowerCase() !== searchTerm.toLowerCase())
          }
        }
      })

      return { previousSearches }
    },
    onError: (err, _searchTerm, context) => {
      if (context?.previousSearches) {
        queryClient.setQueryData(["search_history"], context.previousSearches)
      }
      const errorMessage = err?.response?.data?.message || 'Something went wrong. Please try again later';
      toast.error(errorMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["search_history"] })
    }
  })
}

const useSetSearchHistory = () => {
  return useMutation({
    mutationFn: (searchTerm) => setSearchHistory(searchTerm),
    onSuccess: (_data, searchTerm) => {
      queryClient.setQueryData(["search_history"], (prev) => {
        if (!prev) return previousSearches;
        return {
          ...prev,
          data: {
            ...prev.data,
            searches: [searchTerm, ...prev.data.searches.filter(item => item.toLowerCase() !== searchTerm.toLowerCase())]
          }
        }
      })
    }
  })
}

export {
  useGetUserSearchHistory,
  useClearSearchHistory,
  useDeleteSearchItem,
  useSetSearchHistory
}