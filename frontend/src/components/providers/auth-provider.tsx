"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { createContext, type ReactNode, useContext } from "react";
import { api } from "../../../convex/_generated/api";

interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoading: isConvexAuthLoading, isAuthenticated } = useConvexAuth();
  const currentUser = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? {} : "skip",
  );

  const user: User | null = currentUser
    ? {
        id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        image: currentUser.image,
      }
    : null;

  const isLoading =
    isConvexAuthLoading || (isAuthenticated && currentUser === undefined);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
