export type User = {
  id: number;
  name: string;
  email?: string;
  token?: string;
};

export type Group = {
  id?: number;
  name: string;
  subject: string;
  location: string;
  notes?: string;
  time: Date;
  maxUsers: number;
  admin: User;
  joinsGroups: JoinsGroup[];
};

export type JoinsGroup = {
  user: User;
  group: Group;
  userId: number;
  groupId: number;
};


export type Expense = {
  id?: number;
  date: Date;
  category: ExpensesCategory;
  description: string;
  vendor: string;
  amount: number;
  tags: string[];
  type?: "manual" | "auto";
};

export type Income = {
  id?: number;
  date: Date;
  source: string;
  amount: number;
};

export type ExpensesCategory = {
  id?: number;
  name: string;
  color: string;
};