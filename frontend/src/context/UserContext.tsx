import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../types";

export const APP_USERS: User[] = [
  { id: "anna", name: "Anna", role: "requester" },
  { id: "max", name: "Max", role: "approver" },
];

interface UserContextValue {
  user: User;
  users: User[];
  setUser: (user: User) => void;
}

/** Shared active-user state. Null until UserProvider mounts. */
const UserContext = createContext<UserContextValue | null>(null);

/** Holds the current user (Anna by default) and exposes setUser to switch. */
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(APP_USERS[0]);
  // useMemo caches the context object and only recreates it when `user` changes.
  // Without it, a new object would be created every render and all consumers would re-render.
  const value = useMemo(() => ({ user, users: APP_USERS, setUser }), [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

/** Reads active user from context. Must be called under UserProvider. */
export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
