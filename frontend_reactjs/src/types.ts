export type User = {
  id: number;
  name: string;
  email: string;
  isApproved: boolean;
  wallet: number;
  fundKeywords: string[];
  token?: string;
};

export type ExpensesCategory = {
  id: number;
  name: string;
  color: string;
  keywords: string[];
};

export enum ExpenseType {
  Manual = "Manual",
  Auto = "Auto"
}

export type Expense = {
  id: number;
  date: Date;
  category?: ExpensesCategory;
  description: string;
  vendor: string;
  amount: number;
  tags: string[];
  type: ExpenseType;
};

export type Fund = {
  id: number;
  date: Date;
  source: string;
  amount: number;
  type: ExpenseType;
};

export enum DiaryEntryType {
  Daily = "Daily",
  Monthly = "Monthly"
};

export type DiaryEntry = {
  id: number;
  date: Date;
  content: string;
  workContent: string;
  type: DiaryEntryType;
};

export type JournalCategory = {
  id: number;
  name: string;
  sections?: { entries: { id: number }[] }[];
};

export type JournalSection = {
  id: number;
  category: JournalCategory;
  name: string;
};

export type JournalEntry = {
  id: number;
  section?: JournalSection;
  date: Date;
  content: string;
  subEntries: JournalSubEntry[];
};

export type JournalSubEntry = {
  id: number;
  entryId: number;
  content: string;
};

export type NoteCategory = {
  id: number;
  name: string;
};

export type Note = {
  id: number;
  dateCreated: Date;
  dateModified: Date;
  category?: NoteCategory;
  title: string;
  content: string;
  tags: string[];
};

export enum PianoPieceStatus {
  Planned = "Planned",
  Learning = "Learning",
  Learned = "Learned",
  Learned_Forgotten = "Learned_Forgotten",
};

export type PianoPiece = {
  id: number;
  name: string;
  origin: string;
  composer: string;
  status: PianoPieceStatus;
  sheetMusicUrl: string;
  youtubeUrl: string;
  monthLearned?: Date;
};

export type Hike = {
  id: number;
  date: Date;
  description: string;
  distance: number;
  ascent: number;
  descent: number;
  duration: number;
  durationWithBreaks: number;
  coverImage: string;
  images: string[];
  googleMapsUrl: string;
};

export enum VideoGameType {
  Online = "Online",
  Single_Player = "Single_Player",
  Both = "Both"
};

export type VideoGame = {
  id: number;
  name: string;
  platform: string;
  type: VideoGameType;
  completionCount: number;
  firstPlayed: Date;
  price: string;
  extraPurchases: string;
  storeUrl: string;
  coverImage: string;
};