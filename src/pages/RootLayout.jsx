import { Outlet, ScrollRestoration } from "react-router-dom";
import TopLoadingBar from "../components/TopLoadingBar";
import ErrorBoundary from "../components/ErrorBoundary";

function RootLayout() {
  return (
    <ErrorBoundary>
      <ScrollRestoration />
      <TopLoadingBar />
      <Outlet />
    </ErrorBoundary>
  );
}

export default RootLayout;
