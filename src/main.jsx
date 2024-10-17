import { StrictMode } from 'react'
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path='/' element={<App />}>
        <Route index element={<Home />} />
        <Route path='channel/:username' element={<Channel />}>
          <Route index element={<ChannelVideos />} />
          <Route path='videos' element={<ChannelVideos />} />
          <Route path='playlists' element={<ChannelPlaylists />} />
          <Route path='tweets' element={<ChannelTweets />} />
        </Route>
        <Route path='settings' element={<Settings />}>
          <Route index element={<PersonalInfo />} />
          <Route path='change-password' element={<ChangePassword />} />
          <Route path='personalInfo' element={<PersonalInfo />} />
        </Route>
        <Route path='playlist/:playlistId' element={<Playlist />} />
      </Route>
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
    </Route>
  )
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Theme appearance='dark'>
      <RouterProvider router={router} />
    </Theme>
  </StrictMode>,
)
