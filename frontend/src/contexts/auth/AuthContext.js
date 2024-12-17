import React, { createContext, useState } from "react";
import axios from "axios";

// Set base URL for all axios requests
axios.defaults.baseURL = "http://localhost:5000";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post("/api/auth/login", credentials);

      setUser(response.data);
      setIsAuthenticated(true);
      localStorage.setItem("token", response.data.token);

      // Set default authorization header for future requests
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post("/api/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(response.data);
      setIsAuthenticated(true);
      localStorage.setItem("token", response.data.token);

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        setError,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
