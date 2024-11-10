import { createContext, useContext, useEffect, useState } from "react";
import { useGetCurrentUser, useLoginUser, userLogoutUser } from "../lib/queries/userQueries";
import toast from "react-hot-toast";

const AuthContext = createContext({
  user: null,
  token: null,
  login: async () => { },
  register: async () => { },
  logout: async () => { },
  isLoading: false,
  isAuthenticated: false
})

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const { data: currentUser, isLoading: loadingUserData } = useGetCurrentUser(token, user?._id)
  const isAuthenticated = !!user && !!token;


  const { mutateAsync: loginMutation, isPending: loggingIn } = useLoginUser()
  const { mutateAsync: logoutMutation, isPending: loggingOut } = userLogoutUser()

  const login = async (data) => {
    try {
      const res = await loginMutation(data)
      console.log(res)
      const { user, accessToken } = res.data
      setToken(accessToken)
      setUser(user)

      localStorage.setItem('token', accessToken)
      localStorage.setItem('user', JSON.stringify(user))

    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await logoutMutation()
      toast.success('Logged out successfully!')
      setToken(null)
      setUser(null)

      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } catch (error) {
      console.log('Logout failed', error)
      toast.error('Logout unsuccessful. Please try again.')
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = JSON.parse(localStorage.getItem('user'))
    if (storedUser && storedToken) {
      setToken(storedToken)
      setUser(storedUser)
    }
  }, [])

  const data = {
    user: user || currentUser?.data.user,
    token,
    login,
    logout,
    isAuthenticated,
    isLoading: loadingUserData || loggingIn || loggingOut, 
    setUser, 
  }

  return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  )

}

export const useAuth = () => useContext(AuthContext)

export default AuthProvider