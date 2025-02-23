import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

/**
 * AuthContext: Provides authentication state and functions to manage user authentication.
 */
export const AuthContext = createContext();

/**
 * AuthProvider: Wraps the application with authentication context.
**/

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User authentication state
  const [loading, setLoading] = useState(true); // Loading state during initialization

  useEffect(() => {
    /**
     * initializeAuth: Initializes authentication state from localStorage.
     */
    const initializeAuth = () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          const currentTime = Date.now() / 1000;

          // Check if the token is expired
          if (decoded.exp && decoded.exp > currentTime) {
            setUser({ userId: decoded.id, email: decoded.name, token: storedToken });
          } else {
            // Token is expired, clear user and token
            localStorage.removeItem("token");
            setUser(null);
          }
        } catch (error) {
          // Handle invalid token
          console.error("Invalid token:", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false); // Set loading to false after initialization
    };

    initializeAuth();
  }, []); // Run only once on component mount


  //login: Sets user authentication state and stores token in localStorage.
  const login = (userData) => {
    const { token } = userData;
    try {
      const decoded = jwtDecode(token);
      const user = { userId: decoded.id, email: decoded.name, token };
      setUser(user);
      localStorage.setItem("token", token);
    } catch (error) {
      // Handle login error
      console.error("Error setting up auth:", error);
      logout();
    }
  };

  /**
   * logout: Clears user authentication state and removes token from localStorage.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  if (loading) {
    // Render loading state during initialization
    return <div>Loading...</div>; // Or a custom loading component
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;