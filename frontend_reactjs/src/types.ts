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
