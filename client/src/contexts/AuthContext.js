import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
      setUserId(storedUserId ? parseInt(storedUserId) : null); 
      setUserName(storedUserName);
    }
  }, []);
  

  const signIn = async (token, userId, userName) => {

    localStorage.setItem('token', token);
    localStorage.setItem('userId',userId.toString()); 
    localStorage.setItem('userName', userName);

    setAuthToken(token);
    setIsAuthenticated(true);
    setUserId(userId);
    setUserName(userName);

    console.log("Current user in context:", { userId, userName });
  };

  const signOut = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('userId'); 
    localStorage.removeItem('userName'); 

    setAuthToken(null);
    setIsAuthenticated(false);
    setUserId(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authToken, userId, userName, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
