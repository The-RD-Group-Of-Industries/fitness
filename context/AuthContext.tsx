import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { router } from "expo-router"

interface AuthContextType {
  isAuthenticated: boolean
  user: any
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken")
      if (token) {
        const response = await axios.get("https://fitness-admin-tau.vercel.app/api/mobile/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(response.data.user)
        setIsAuthenticated(true)
        router.replace("/(tabs)")
      } else {
        setIsAuthenticated(false)
        router.replace("/welcome")
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      await logout()
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("https://fitness-admin-tau.vercel.app/api/mobile/auth/login", {
        email,
        password,
      })

      await AsyncStorage.setItem("userToken", response.data.token)
      setUser(response.data.user)
      setIsAuthenticated(true)
      router.replace("/(tabs)")
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post("", {
        name,
        email,
        password,
      })

      await AsyncStorage.setItem("userToken", response.data.token)
      setUser(response.data.user)
      setIsAuthenticated(true)
      router.replace("/(tabs)")
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken")
      setUser(null)
      setIsAuthenticated(false)
      router.replace("/welcome")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}