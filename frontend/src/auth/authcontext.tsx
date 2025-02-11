'use client'
import{ createContext, useState, useEffect } from 'react';
import {CustomUser, JWT} from "api-client";

interface AuthContextType {
  token: string | null;
  user: CustomUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUserDetails: (jwtToken: JWT) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUserDetails: (jwtToken) => {},
  logout: () => {},
});
