export interface IUser {
  ID: string;
  name: string;
  username: string;
  role: 'ADMIN' | 'EMPLOYEE';
  accessToken?: string;
  createdAt?: string;
}
