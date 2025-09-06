import { createContext, useContext, useEffect, useState } from "react";
import { useGetCurrentUser, useLoginUser, useRegisterUser, userLogoutUser } from "../lib/queries/userQueries";
import toast from "react-hot-toast";

let authSetters = {
  setUser: () => { },
  setIsAuthenticated: () => { }
};

export const setAuthSetters = (setUserFn, setAuthenticationFn) => {
  authSetters.setUser = setUserFn;
  authSetters.setIsAuthenticated = setAuthenticationFn
};

export const getAuthSetters = () => authSetters;

const AuthContext = createContext({
  user: null,
  login: async () => { },
  register: async () => { },
  logout: async () => { },
  isLoading: false,
  isAuthenticated: false
})

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!user)

  const { data: currentUser, isLoading: loadingUserData } = useGetCurrentUser(user?._id)

  const { mutateAsync: loginMutation, isPending: loggingIn } = useLoginUser()
  const { mutateAsync: registerMutation, isPending: registeringUser } = useRegisterUser()
  const { mutateAsync: logoutMutation, isPending: loggingOut } = userLogoutUser()

  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);

  // Automatically update user state when `currentUser` changes
  useEffect(() => {
    if (currentUser?.data?.user) {
      setUser(currentUser.data.user);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(currentUser.data.user));
    }
  }, [currentUser]);

  useEffect(() => {
    setAuthSetters(setUser, setIsAuthenticated)
  }, [])

  const login = async (data) => {
    try {
      const res = await loginMutation(data)
      const { user, accessToken } = res.data

      setUser(user)
      setIsAuthenticated(true)
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('user', JSON.stringify(user))
    } catch (error) {
      throw error
    }
  }

  const register = async (formData) => {
    try {
      await registerMutation(formData)
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await logoutMutation()

      setIsAuthenticated(false)
      setUser(null)
      toast('Logged out successfully')

      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
    } catch (error) {
      console.log('Logout failed', error)
      toast.error('Logout unsuccessful. Please try again.')
    }
  }

  const data = {
    user: currentUser?.data?.user || user,
    setUser,
    login,
    register,
    logout,
    isAuthenticated,
    setIsAuthenticated,
    isLoading: loadingUserData || loggingIn || loggingOut || registeringUser,
    logoutLoading: loggingOut,
  }

  return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  )

}

export const useAuth = () => useContext(AuthContext)

export default AuthProvider