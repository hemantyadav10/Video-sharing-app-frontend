import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import {
  useGetCurrentUser,
  useLoginUser,
  useLogoutUser,
  useRegisterUser,
} from "../lib/queries/userQueries";

let authSetters = {
  setUser: () => {},
};

export const setAuthSetters = (setUserFn) => {
  authSetters.setUser = setUserFn;
};

export const getAuthSetters = () => authSetters;

const AuthContext = createContext({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  isLoading: false,
  isAuthenticated: false,
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const hasAccessToken = Boolean(localStorage.getItem("accessToken"));

  const { data: currentUser, isLoading: loadingUserData } = useGetCurrentUser({
    enabled: !!user?._id && hasAccessToken,
  });


  const { mutateAsync: loginMutation, isPending: loggingIn } = useLoginUser();
  const { mutateAsync: registerMutation, isPending: registeringUser } =
    useRegisterUser();
  const { mutateAsync: logoutMutation, isPending: loggingOut } =
    useLogoutUser();

  const isAuthenticated = Boolean(currentUser?.data || user);
  const isLoading =
    loadingUserData || loggingIn || loggingOut || registeringUser;

  // const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);

  // Automatically update user state when `currentUser` changes
  useEffect(() => {
    if (currentUser?.data) {
      setUser(currentUser.data);
      localStorage.setItem("user", JSON.stringify(currentUser.data));
    } else if (!currentUser && !user?._id) {
      localStorage.removeItem("user");
      setUser(null);
    }
  }, [currentUser]);

  useEffect(() => {
    setAuthSetters(setUser);
  }, []);

  const login = useCallback(
    async (data) => {
      const res = await loginMutation(data);
      const { user, accessToken } = res.data;

      setUser(user);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      return res;
    },
    [loginMutation],
  );

  const register = useCallback(
    async (formData) => {
      await registerMutation(formData);
    },
    [registerMutation],
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  }, [logoutMutation]);

  const data = {
    user: currentUser?.data || user,
    setUser,
    login,
    register,
    logout,
    isAuthenticated,
    isLoading,
    logoutLoading: loggingOut,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export default AuthProvider;
