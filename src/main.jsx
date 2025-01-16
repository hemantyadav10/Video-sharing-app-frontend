import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "@radix-ui/themes/styles.css";
import './index.css'
import { Theme } from '@radix-ui/themes';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Channel from './pages/channel/Channel.jsx';
import ChannelVideos from './pages/channel/ChannelVideos.jsx';
import ChannelPlaylists from './pages/channel/ChannelPlaylists.jsx';
import ChannelTweets from './pages/channel/ChannelTweets.jsx';
import ChangePassword from './pages/settings/ChangePassword.jsx'
import PersonalInfo from './pages/settings/PersonalInfo.jsx'
import Settings from './pages/settings/Settings.jsx';
import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import Playlist from './pages/Playlist.jsx';
import LikedVideos from './pages/LikedVideos.jsx';
import AllPlaylists from './pages/AllPlaylists.jsx';
import SubscriptionVideos from './pages/SubscriptionVideos.jsx';
import SubscribedChannels from './pages/SubscribedChannels.jsx';
import SearchResults from './pages/SearchResults.jsx';
import History from './pages/History.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import VideoPage from './pages/VideoPage.jsx';
import AuthProvider from './context/authContext.jsx';
import PublicRoute from './components/PublicRoute.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard.jsx';
import Privacy from './pages/Privacy.jsx';
import TermsOfService from './pages/TermsOfService.jsx';
import Help from './pages/Help.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import TagsPage from './pages/TagsPage.jsx';
import NotFound from './pages/NotFound.jsx';


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 2 * 1000,
      refetchOnReconnect: 'always',
      retry: 2
    },
  },
});

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path='/' element={<App />}>
        <Route index element={<Home />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route path='channel/:userId' element={<Channel />}>
          <Route index element={<ChannelVideos />} />
          <Route path='videos' element={<ChannelVideos />} />
          <Route path='playlists' element={<ChannelPlaylists />} />
          <Route path='tweets' element={<ChannelTweets />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path='settings' element={<Settings />}>
            <Route index element={<PersonalInfo />} />
            <Route path='change-password' element={<ChangePassword />} />
            <Route path='personalInfo' element={<PersonalInfo />} />
          </Route>
          <Route path='subscriptions/channels' element={<SubscribedChannels />} />
          <Route path='playlists' element={<AllPlaylists />} />
        </Route>
        <Route path='playlist/:playlistId' element={<Playlist />} />
        <Route path='liked-videos' element={<LikedVideos />} />
        <Route path='subscriptions' element={<SubscriptionVideos />} />
        <Route path='results' element={<SearchResults />} />
        <Route path='history' element={<History />} />
        <Route path='/watch/:videoId' element={<VideoPage />} />
        <Route path='/privacy' element={<Privacy />} />
        <Route path='/terms-of-services' element={<TermsOfService />} />
        <Route path='/help' element={<Help />} />
        <Route path='category/:category' element={<CategoryPage />} />
        <Route path='/hashtag/:tag' element={<TagsPage />} />
      </Route>
      <Route element={<PublicRoute />}>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Route>
      <Route path='*' element={<NotFound />} />
    </Route>
  )
)


createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Theme appearance='dark' accentColor='blue'>
        <RouterProvider router={router} />
        <Toaster
          position='bottom-left'
          toastOptions={{
            className: 'toast',
            error: { icon: false, className: "toast_error text-center flex justify-center" },
            success: { icon: false }
          }}
        />
        <ReactQueryDevtools initialIsOpen={false} />
      </Theme>
    </AuthProvider>
  </QueryClientProvider>
)
