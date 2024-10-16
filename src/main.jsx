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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index element={<Home />} />
      <Route path='/channel/:username' element={<Channel />}>
        <Route index element={<ChannelVideos />} />
        <Route path='videos' element={<ChannelVideos />} />
        <Route path='playlists' element={<ChannelPlaylists />} />
        <Route path='tweets' element={<ChannelTweets />} />
      </Route>
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
