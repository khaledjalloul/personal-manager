import { createContext } from "react";

export type UserData = {
  userId: number;
  name: string;
  email: string;
  token: string;
  lastOpenedNoteId?: number;
} | null;

export const UserContext = createContext<{
  readonly userData?: UserData | null;
  readonly setUserData: (userData?: UserData | null) => void;
}>({
  userData: null,
  setUserData: () => { },
});
