import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import PublicRoute from "../components/PublicRoute.jsx";
import Content from "../pages/dashboard/Content";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Root from "../pages/Root.jsx";
import RootLayout from "../pages/RootLayout.jsx";
import RouteErrorBoundary from "../components/RouteErrorBoundary.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />} ErrorBoundary={RouteErrorBoundary}>
      <Route path="/" element={<Root />}>
        {/* Home Page */}
        <Route
          index
          lazy={() =>
            import("../pages/Home.jsx").then(({ default: Home }) => ({
              Component: Home,
            }))
          }
        />

        {/* ========== Channel Routes ========== */}
        <Route
          path="channel/:userId"
          lazy={() =>
            import("../pages/channel/Channel.jsx").then(
              ({ default: Channel }) => ({ Component: Channel }),
            )
          }
        >
          <Route
            index
            lazy={() =>
              import("../pages/channel/ChannelVideos.jsx").then(
                ({ default: ChannelVideos }) => ({
                  Component: ChannelVideos,
                }),
              )
            }
          />
          <Route
            path="videos"
            lazy={() =>
              import("../pages/channel/ChannelVideos.jsx").then(
                ({ default: ChannelVideos }) => ({
                  Component: ChannelVideos,
                }),
              )
            }
          />
          <Route
            path="playlists"
            lazy={() =>
              import("../pages/channel/ChannelPlaylists.jsx").then(
                ({ default: ChannelPlaylists }) => ({
                  Component: ChannelPlaylists,
                }),
              )
            }
          />
          <Route
            path="tweets"
            lazy={() =>
              import("../pages/channel/ChannelTweets.jsx").then(
                ({ default: ChannelTweets }) => ({
                  Component: ChannelTweets,
                }),
              )
            }
          />
        </Route>

        {/* ========== Protected Routes (Require Authentication) ========== */}
        <Route element={<ProtectedRoute />}>
          {/* Settings Routes */}
          <Route
            path="settings"
            lazy={() =>
              import("../pages/settings/Settings.jsx").then(
                ({ default: Settings }) => ({
                  Component: Settings,
                }),
              )
            }
          >
            <Route
              index
              lazy={() =>
                import("../pages/settings/PersonalInfo.jsx").then(
                  ({ default: PersonalInfo }) => ({
                    Component: PersonalInfo,
                  }),
                )
              }
            />
            <Route
              path="personalInfo"
              lazy={() =>
                import("../pages/settings/PersonalInfo.jsx").then(
                  ({ default: PersonalInfo }) => ({
                    Component: PersonalInfo,
                  }),
                )
              }
            />
            <Route
              path="change-password"
              lazy={() =>
                import("../pages/settings/ChangePassword.jsx").then(
                  ({ default: ChangePassword }) => ({
                    Component: ChangePassword,
                  }),
                )
              }
            />
          </Route>

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route
              index
              lazy={() =>
                import("../pages/dashboard/Dashboard.jsx").then(
                  ({ default: Dashboard }) => ({
                    Component: Dashboard,
                  }),
                )
              }
            />
            <Route path="content" element={<Content />}>
              <Route
                index
                lazy={() =>
                  import("../pages/dashboard/VideosTab.jsx").then(
                    ({ default: VideosTab }) => ({
                      Component: VideosTab,
                    }),
                  )
                }
              />
              <Route
                path="videos"
                lazy={() =>
                  import("../pages/dashboard/VideosTab.jsx").then(
                    ({ default: VideosTab }) => ({
                      Component: VideosTab,
                    }),
                  )
                }
              />
              <Route
                path="playlists"
                lazy={() =>
                  import("../pages/dashboard/PlaylistsTab.jsx").then(
                    ({ default: PlaylistsTab }) => ({
                      Component: PlaylistsTab,
                    }),
                  )
                }
              />
              <Route
                path="tweets"
                lazy={() =>
                  import("../pages/dashboard/TweetsTab.jsx").then(
                    ({ default: TweetsTab }) => ({
                      Component: TweetsTab,
                    }),
                  )
                }
              />
            </Route>
          </Route>

          {/* Subscription & Playlist Routes */}
          <Route
            path="subscriptions/channels"
            lazy={() =>
              import("../pages/SubscribedChannels.jsx").then(
                ({ default: SubscribedChannels }) => ({
                  Component: SubscribedChannels,
                }),
              )
            }
          />
          <Route
            path="playlists"
            lazy={() =>
              import("../pages/AllPlaylists.jsx").then(
                ({ default: AllPlaylists }) => ({
                  Component: AllPlaylists,
                }),
              )
            }
          />
        </Route>
        {/* ========== Video & Content Routes ========== */}
        <Route
          path="playlist/:playlistId"
          lazy={() =>
            import("../pages/Playlist.jsx").then(({ default: Playlist }) => ({
              Component: Playlist,
            }))
          }
        />
        <Route
          path="liked-videos"
          lazy={() =>
            import("../pages/LikedVideos.jsx").then(
              ({ default: LikedVideos }) => ({
                Component: LikedVideos,
              }),
            )
          }
        />
        <Route
          path="subscriptions"
          lazy={() =>
            import("../pages/SubscriptionVideos.jsx").then(
              ({ default: SubscriptionVideos }) => ({
                Component: SubscriptionVideos,
              }),
            )
          }
        />
        <Route
          path="results"
          lazy={() =>
            import("../pages/SearchResults.jsx").then(
              ({ default: SearchResults }) => ({
                Component: SearchResults,
              }),
            )
          }
        />
        <Route
          path="history"
          lazy={() =>
            import("../pages/History.jsx").then(({ default: History }) => ({
              Component: History,
            }))
          }
        />
        <Route
          path="/watch/:videoId"
          lazy={() =>
            import("../pages/VideoPage.jsx").then(({ default: VideoPage }) => ({
              Component: VideoPage,
            }))
          }
        />

        {/* ========== Static/Info Pages ========== */}
        <Route
          path="/privacy"
          lazy={() =>
            import("../pages/Privacy.jsx").then(({ default: Privacy }) => ({
              Component: Privacy,
            }))
          }
        />
        <Route
          path="/terms-of-services"
          lazy={() =>
            import("../pages/TermsOfService.jsx").then(
              ({ default: TermsOfService }) => ({
                Component: TermsOfService,
              }),
            )
          }
        />
        <Route
          path="/help"
          lazy={() =>
            import("../pages/Help.jsx").then(({ default: Help }) => ({
              Component: Help,
            }))
          }
        />

        {/* ========== Category & Tag Routes ========== */}
        <Route
          path="category/:category"
          lazy={() =>
            import("../pages/CategoryPage.jsx").then(
              ({ default: CategoryPage }) => ({
                Component: CategoryPage,
              }),
            )
          }
        />
        <Route
          path="/hashtag/:tag"
          lazy={() =>
            import("../pages/TagsPage.jsx").then(({ default: TagsPage }) => ({
              Component: TagsPage,
            }))
          }
        />
      </Route>

      {/* ========== Public Routes (Login/Signup) ========== */}
      <Route element={<PublicRoute />}>
        <Route
          path="/login"
          lazy={() =>
            import("../pages/auth/Login.jsx").then(({ default: Login }) => ({
              Component: Login,
            }))
          }
        />
        <Route
          path="/signup"
          lazy={() =>
            import("../pages/auth/Signup.jsx").then(({ default: Signup }) => ({
              Component: Signup,
            }))
          }
        />
      </Route>

      {/* ========== 404 Not Found ========== */}
      <Route
        path="*"
        lazy={() =>
          import("../pages/NotFound.jsx").then(({ default: NotFound }) => ({
            Component: NotFound,
          }))
        }
      />
    </Route>,
  ),
);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
