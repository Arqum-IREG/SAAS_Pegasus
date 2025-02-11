import {useState, useEffect, ReactNode} from 'react';
import {AuthContext} from "./authcontext";
import {getApiConfiguration} from "../api/utils.tsx";
import {ApiApi, CustomUser, JWT} from "api-client";

export const AuthProvider = ({ children }: {children: ReactNode}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<CustomUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      const validateTokenAndSetUser = async () => {
        let client = new ApiApi(getApiConfiguration(storedToken));
        let userBack;
        try {
          userBack = await client.apiAuthUserRetrieve();
          // token was still good. we have a valid user session
          setToken(storedToken);
          setIsAuthenticated(true);
          setUser(userBack);
        } catch (error) {
          // token didn't work. Invalidate it and try to use a refresh token to get a new one.
          localStorage.removeItem('accessToken');
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const refreshData = await client.apiAuthTokenRefreshCreate({tokenRefresh: {
                  refresh: refreshToken
              }});
              // that worked. save it and proceed.
              localStorage.setItem('accessToken', refreshData.access);
              setToken(refreshData.access);
              client = new ApiApi(getApiConfiguration(refreshData.access));
              userBack = await client.apiAuthUserRetrieve();
              setIsAuthenticated(true);
              setUser(userBack);
            } catch (error) {
              // Refresh token also failed. The user will have to login again.
              localStorage.removeItem('refreshToken');
              setIsAuthenticated(false);
            }
          } else {
            // no refresh token
            setIsAuthenticated(false);
          }
        } finally {
          setIsLoading(false);
        }
      };
      validateTokenAndSetUser();
    } else {
      setToken(null);
      setIsLoading(false);
      setIsAuthenticated(false);
    }
  }, []);

  const handleSetUserDetails = (jwtResponse: JWT) => {
    localStorage.setItem('refreshToken', jwtResponse.refresh);
    setToken(jwtResponse.access);
    localStorage.setItem('accessToken', jwtResponse.access);
    setUser(jwtResponse.user)
    setIsLoading(false);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const contextValue = {
    token,
    user,
    isAuthenticated,
    isLoading,
    setUserDetails: handleSetUserDetails,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
