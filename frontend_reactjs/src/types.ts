export type User = {
  id: number;
  name: string;
  email: string;
  isApproved: boolean;
  wallet: number;
  fundKeywords: string[];
};

// -------- Expenses --------

export type ExpensesCategory = {
  id: number;
  name: string;
  color: string;
  keywords: string[];
};

export enum ExpenseType {
  Bank_Auto = "Bank_Auto",
  Bank_Manual = "Bank_Manual",
  Cash = "Cash",
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

// -------- Diary --------

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

// -------- Journal --------

export type JournalCategory = {
  id: number;
  name: string;
  order: number;
  color: string;
  sections?: { entries: { id: number }[] }[];
};

export type JournalSection = {
  id: number;
  category: JournalCategory;
  order: number;
  name: string;
  _count?: {
    entries: number;
  }
};

export type JournalEntry = {
  id: number;
  sections: JournalSection[];
  date: Date;
  content: string;
  subEntries: JournalSubEntry[];
};

export type JournalSubEntry = {
  id: number;
  entryId: number;
  content: string;
};

// -------- Calendar --------

export type CalendarEntry = {
  id: number;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
}

// -------- To-Dos --------

export type ToDoMilestone = {
  id: number;
  date: Date;
  description: string;
};

export enum ToDoTaskStatus {
  Pending = "Pending",
  Completed = "Completed",
  NotCompleted = "NotCompleted"
};

export type ToDoTask = {
  id: number;
  milestoneId?: number;
  dateCreated: Date;
  dateModified: Date;
  content: string;
  status: ToDoTaskStatus;
};

// -------- Notes --------

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

// -------- Piano --------

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
  isFavorite: boolean;
  monthLearned?: Date;
};

// -------- Sports --------

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


export type GymExerciseType = {
  id: number;
  name: string;
  description: string;
  exercises?: GymExercise[]
  _count?: {
    exercises: number;
  };
}

export type GymSession = {
  id: number;
  date: Date;
  note: string;
  exercises: GymExercise[]
}

export type GymExercise = {
  id: number;
  type: GymExerciseType;
  session: GymSession
  weight: number;
  sets: number;
  reps: number;
  note: string;
}

export type Run = {
  id: number;
  date: Date;
  description: string;
  distance: number;
  duration: number;
  elevationGain: number;
}

export type Swim = {
  id: number;
  date: Date;
  description: string;
}

export type VolleyballGame = {
  id: number;
  date: Date;
  description: string;
}

// -------- Video Games --------

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