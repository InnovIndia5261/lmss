import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getMyProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        // Mock user data for exploration
        setUser({
          _id: "mock-user-123",
          name: "Explorer User",
          email: "explorer@example.com",
          role: "admin", // Assuming admin role to see all features
          address: "123 Fake Street",
          phoneNumber: "555-0123",
        });
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
