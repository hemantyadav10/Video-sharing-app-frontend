import { Spinner, Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import TopLoadingBar from "./components/TopLoadingBar";
import AuthProvider from "./context/authContext";
import AppRouter from "./providers/RouterProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 2 * 1000,
      refetchOnReconnect: "always",
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const toastStyles = {
  backgroundColor: "#09090b",
  minWidth: "240px",
  fontSize: "14px",
  color: "#fafafa",
  border: "1px solid #484848",
  padding: "12px",
  boxShadow:
    "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
};

const toastErrorStyles = {
  backgroundColor: "#7f1d1d",
  border: "1px solid #7f1d1d",
};

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider
            attribute={"class"}
            disableTransitionOnChange
            defaultTheme="dark"
          >
            <Theme accentColor="blue">
              <AppRouter />
              <Toaster
                position="bottom-left"
                toastOptions={{
                  style: toastStyles,
                  error: {
                    icon: false,
                    style: toastErrorStyles,
                  },
                  success: { icon: false },
                  loading: { icon: <Spinner size={"3"} /> },
                }}
              />
              <ReactQueryDevtools initialIsOpen={false} />
            </Theme>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
