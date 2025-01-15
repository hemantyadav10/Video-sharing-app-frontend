import { createContext, useContext, useEffect, useState } from "react";
import { useGetCurrentUser, useLoginUser, useRegisterUser, userLogoutUser } from "../lib/queries/userQueries";
import toast from "react-hot-toast";

const AuthContext = createContext({
  user: null,
  // token: null,
  login: async () => { },
  register: async () => { },
  logout: async () => { },
  isLoading: false,
  isAuthenticated: false
})

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  console.log(user)
  const [isAuthenticated, setIsAuthenticated] = useState(!!user)
  // const [token, setToken] = useState(localStorage.getItem('accessToken') || null);

  const { data: currentUser, isLoading: loadingUserData, isError } = useGetCurrentUser(user?._id)

  const { mutateAsync: loginMutation, isPending: loggingIn } = useLoginUser()
  const { mutateAsync: registerMutation, isPending: registeringUser } = useRegisterUser()
  const { mutateAsync: logoutMutation, isPending: loggingOut } = userLogoutUser()

  const login = async (data) => {
    try {
      const res = await loginMutation(data)
      console.log(res)
      const { user } = res.data
      setIsAuthenticated(true)
      setUser(user)
      // setToken(accessToken)

      // localStorage.setItem('accessToken', accessToken)
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
      // setToken(null)
      setUser(null)
      toast('Logged out successfully')

      // localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
    } catch (error) {
      console.log('Logout failed', error)
      toast.error('Logout unsuccessful. Please try again.')
    }
  }

  const data = {
    user: currentUser?.data?.user || user,
    setUser,
    // token,
    login,
    register,
    logout,
    isAuthenticated,
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