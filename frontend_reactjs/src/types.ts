export type User = {
  id: number;
  name: string;
  email?: string;
  token?: string;
};

export type ExpensesCategory = {
  id: number;
  name: string;
  color: string;
};

export type Expense = {
  id: number;
  date: Date;
  category: ExpensesCategory;
  description: string;
  vendor: string;
  amount: number;
  tags: string[];
  type?: "manual" | "auto";
};

export type ExpensesCategoryKeyword = {
  id: number;
  keyword: string;
  category: ExpensesCategory;
}

export type Income = {
  id: number;
  date: Date;
  source: string;
  amount: number;
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
}

export enum PianoPieceStatus {
  PLANNED = "Planned",
  LEARNING = "Learning",
  LEARNED = "Learned",
  LEARNED_FORGOTTEN = "Learned (Forgotten)",
}

export type PianoPiece = {
  id: number;
  name: string;
  origin: string;
  composer: string;
  status: PianoPieceStatus;
  sheetMusicUrl: string;
  youtubeUrl: string;
  monthLearned?: Date;
}

export type NoteCategory = {
  id: number;
  name: string;
}

export type Note = {
  id: number;
  dateCreated: Date;
  dateModified: Date;
  category: NoteCategory;
  title: string;
  content: string;
  tags: string[];
}

export type DiaryEntry = {
  id: number;
  date: Date;
  content: string;
  workContent: string;
};

export enum VideoGameType {
  ONLINE = "Online",
  SINGLE_PLAYER = "Single Player",
  BOTH = "Online & Single Player",
}

export type VideoGame = {
  id: number;
  name: string;
  platform: string;
  type: VideoGameType;
  completed: boolean;
  firstPlayed: Date;
  price: number;
  extraPurchases: {
    name: string;
    price: number;
  }[];
  storeUrl: string;
  coverImage: string;
}