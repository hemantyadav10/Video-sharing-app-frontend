import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist
} from "../../api/playlistApi"

// Fetches all playlists for a specific user by their ID
const useFetchUserPlaylists = (userId, fetch) => {
  return useQuery({
    queryKey: ['playlist', 'all', userId],
    queryFn: () => getUserPlaylists(userId),
    enabled: !!(userId && fetch)
  })
}

// Fetches a single playlist by its ID
const useFetchPlaylistById = (playlistId) => {
  return useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: () => getPlaylistById(playlistId)
  })
}

// Updates a playlist's details (name, description) and refreshes cache
const useUpdatePlaylist = (playlistId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => updatePlaylist(playlistId, data),
    onSuccess: (res) => {
      queryClient.setQueryData(['playlist', playlistId], (prev) => {
        if (!prev) return;

        return {
          ...prev,
          data: {
            ...prev.data,
            name: res.data.name,
            description: res.data.description,
            updatedAt: new Date(),
          }
        }
      })

      // Invalidate the 'all playlists' query to ensure up-to-date data
      queryClient.invalidateQueries({ queryKey: ['playlist', 'all'] })
    }
  })
}

// Deletes a playlist by its ID and removes it from the user’s playlist cache
const useDeletePlaylist = (playlistId, userId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deletePlaylist(playlistId),
    onSuccess: () => {
      queryClient.setQueryData(['playlist', 'all', userId], (prev) => {
        if (!prev) return;

        return {
          ...prev,
          data: prev.data.filter((playlist) => {
            return playlist._id !== playlistId
          })
        }
      })

      // Remove the specific playlist from cache
      queryClient.removeQueries({ queryKey: ['playlist', playlistId] })
    }
  })
}

// Creates a new playlist and adds it to the 'all playlists' cache for the user
const useCreatePlaylist = (userId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => createPlaylist(data),
    onSuccess: (playlist) => {

      //update the all playlists cache after successfull creation without refetching 
      queryClient.setQueryData(['playlist', 'all', userId], (prev) => {
        const newPlaylist = {
          ...playlist.data,
          totalVideos: 0
        }

        if (!prev) return;

        return {
          ...prev,
          data: [
            ...prev.data,
            newPlaylist
          ]
        }
      })
    }
  })
}

// Adds a video to a specific playlist and updates the relevant caches
const useAddVideoToPlaylist = (video, userId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ videoId, playlistId }) => addVideoToPlaylist(videoId, playlistId),
    onSuccess: (res) => {

      queryClient.setQueryData(['playlist', res.data._id], (prev) => {
        if (!prev) return;

        return {
          ...prev,
          data: {
            ...prev.data,
            totalVideos: prev.data.totalVideos + 1,
            updatedAt: new Date(),
            videos: [
              ...prev.data.videos,
              video
            ]
          }
        }
      })

      // Update the user’s 'all playlists' cache to reflect the new video in the playlist
      queryClient.setQueryData(['playlist', 'all', userId], (prev) => {
        if (!prev) return;

        return {
          ...prev,
          data: prev.data.map((playlist) => {
            if (playlist._id === res.data._id) {
              return {
                ...playlist,
                totalVideos: (playlist.totalVideos || 0) + 1,
                thumbnail: playlist.thumbnail || video.thumbnail,
                updatedAt: new Date(),
                videos: [...playlist.videos, video._id]
              }
            }
            return playlist
          })
        }
      })
    }
  })
}

// Removes a video from a playlist and updates the cache accordingly
const useRemoveVideoFromPlaylist = (video, userId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ videoId, playlistId }) => removeVideoFromPlaylist(videoId, playlistId),
    onSuccess: (res) => {
      console.log(res)
      // Update the playlist cache with the removed video
      queryClient.setQueryData(['playlist', res.data._id], (prev) => {
        if (!prev) return;

        // Filter out the removed video from the playlist's videos list
        return {
          ...prev,
          data: {
            ...prev.data,
            totalVideos: prev.data.totalVideos - 1,
            updatedAt: new Date(),
            videos: prev.data.videos.filter((v) => v._id !== video._id)
          }
        };
      });

      // Update the 'all playlists' cache to reflect the removal of the video
      queryClient.setQueryData(['playlist', 'all', userId], (prev) => {
        if (!prev) return;

        return {
          ...prev,
          data: prev.data.map((playlist) => {
            if (playlist._id === res.data._id) {
              return {
                ...playlist,
                totalVideos: playlist.totalVideos - 1,
                updatedAt: new Date(),
                videos: playlist.videos.filter((id) => id !== video._id),
                thumbnail: playlist.totalVideos === 1 ? null : playlist.thumbnail
              };
            }
            return playlist;
          })
        };
      });
    },
  });
};

export {
  useAddVideoToPlaylist, useCreatePlaylist, useDeletePlaylist, useFetchPlaylistById, useFetchUserPlaylists, useRemoveVideoFromPlaylist, useUpdatePlaylist
}
