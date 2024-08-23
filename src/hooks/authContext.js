"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import { useToast } from "@chakra-ui/react";

const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/refresh`,
      { refresh_token: refreshToken }
    );

    if (response.data.access_token) {
      localStorage.setItem("access_token", response.data.access_token);
      return response.data.access_token;
    } else {
      throw new Error("No access token received");
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const checkLoginStatus = () => {
      const storedToken = localStorage.getItem("access_token");

      if (storedToken) {
        try {
          const decodedToken = jwt.decode(storedToken);

          if (decodedToken && decodedToken.exp) {
            const currentTime = Math.floor(Date.now() / 1000);

            if (decodedToken.exp > currentTime) {
              setIsLoggedIn(true);
              return;
            } else {
              console.log("token expired");
              setIsLoggedIn(false);
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              toast({
                title: "Session Expired",
                description: "Please log in again.",
                status: "warning",
                duration: 3000,
                isClosable: true,
              });
            }
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();

    const checkUser = () => {
      const storedToken = localStorage.getItem("access_token");
      if (storedToken) {
        try {
          const user = jwt.decode(storedToken);
          setRole(user.role);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    };

    checkUser();

    const refreshInterval = setInterval(async () => {
      await refreshToken();
    }, 59 * 60 * 1000); // 59 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
