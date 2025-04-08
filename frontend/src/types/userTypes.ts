export interface User {
  id: string;
  username: string;
  email: string;
  points: number;
  profilePic?: string;
  createdAt: Date;
}

export interface UserName {
  id: string;
  username: string;
  points: number;
  victories: number;
}
