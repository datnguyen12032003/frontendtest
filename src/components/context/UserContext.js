import React, { createContext, useState, useEffect, useContext } from "react";
import { getToken } from "../Login/app/static"; // Adjust the import path as necessary
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null); // State to hold user profile
  const [isLoading, setIsLoading] = useState(false);
  const enabled = true;
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/users/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`, // Use token for authentication
        },
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const refetch = () => {
    if (enabled) {
      fetchProfile();
    }
  }; // Set fetched profile data
  useEffect(() => {
    if (enabled) {
      fetchProfile();
    }
  }, [enabled]);
  const logOut = () => {
    localStorage.removeItem("AUTH_TOKEN"); // Remove token from localStorage
    setProfile(null); // Clear profile state
    navigate("/login"); // Redirect to login page
  };
  return (
    <UserContext.Provider value={{ profile, setProfile, logOut, refetch }}>
      {children}
    </UserContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(UserContext);
  if (context == undefined) {
    throw new Error("Use post use out side post provider");
  }
  return context;
};
