import { createContext } from "react";

export type UserData = {
  token: string;
  darkMode: boolean;
  showPrivateContent?: boolean;
  calendarLastSelectedDate?: Date;
  diaryLastSelectedDate?: Date;
  journalSortOrder?: "asc" | "desc";
  journalGroupBySection?: boolean;
  journalLastSelectedSectionIds?: number[];
  notesLastOpenedId?: number;
  sportsLastSelectedPath?: string;
} | null;

export const UserContext = createContext<{
  readonly userData?: UserData | null;
  readonly setUserData: (userData?: UserData | null) => void;
}>({
  userData: null,
  setUserData: () => { },
});
