import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { loginUser, registerUser, getUserDetails } from "@/lib/api"; // use your API layer
import * as SecureStore from 'expo-secure-store';

// Add this interface at the top of your AuthContext.tsx
interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
  phone?: string | null; // Can be a string, null, or undefined
  image?: string | null;
  }


interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean; 
  user: User|null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User|null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    console.log("1. checkAuth function started."); // Log start
    setIsLoading(true);
    try {
      const token = await SecureStore.getItemAsync("token");
      // console.log("2. Token from SecureStore:", token); // Log the token

      if (token) {
        console.log("3. Token found. Calling getUserDetails...");
        const response = await getUserDetails();        // console.log("4. Response from getUserDetails:", response.data); // Log the full response data

        // --- CRITICAL CHECK ---
        const userData = response.data.user || response.data; 
        // Make sure response.data.user actually exists before trying to set it.
        if (userData && userData.id) {
          console.log("5. User object found in response. Setting user state.");
          setUser(userData); // This is the goal
          setIsAuthenticated(true);
          router.replace("/(tabs)");
        } else {
          // This will tell you if the API response has the wrong shape
          console.error("6. FATAL: API response is missing 'user' object.", response.data);
          await logout(); // Log out if the response is malformed
        }
        
      } else {
        console.log("3. No token found. Navigating to welcome screen.");
        setIsAuthenticated(false);
        router.replace("/welcome");
      }
    } catch (error) {
      // This will catch any network errors or other exceptions
      console.error("7. FATAL: Error caught in checkAuth function:", error);
      await logout(); // Log out if there's any error
    }finally{
      setIsLoading(false);
    }
  };


const login = async (email: string, password: string) => {
  try {
    // 1. Your API call returns the full Axios response object
    const response = await loginUser({ email, password });

    // 2. The token is at response.data.token
    const token = response.data.token;
    await SecureStore.setItemAsync("token",token);
    // console.log("Token saved:", token);

    // 3. The user object is at response.data.user
    const user = response.data.user;
    setUser(user);
    // console.log("User object set in context:", user);

    // 4. Update auth state and navigate
    setIsAuthenticated(true);
    // router.replace("/(tabs)");

  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};


const register = async (name: string, email: string, password: string) => {
    try {
        // 1. Call API
        const response = await registerUser({ name, email, password });
        console.log("REGISTER RESPONSE DATA:", JSON.stringify(response.data, null, 2));
        // 2. GET Token and User from response
        const { token, user } = response.data;

        if (!token) {
            throw new Error("No token received from registration API");
        }

        // 3. SAVE Token to SecureStore (CRITICAL STEP)
        await SecureStore.setItemAsync("token", token);

        // 4. Update Context State
        setUser(user);
        setIsAuthenticated(true);
        alert('Success Registration successful!');
        router.replace("/(tabs)"); // Optional, usually handled by the UI calling this
    } catch (error) {
        console.error("Registration failed:", error);
        throw error;
    }
};


  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      setUser(null);
      setIsAuthenticated(false);
      router.replace("/welcome");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated,isLoading, user, login, register, logout, checkAuth,setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
