export interface ICustomer {
  ID: string;
  name: string;
  email: string;
  lineID: string;
  tel: string;
  role: 'CUSTOMER' | 'DEALER';
  accessToken?: string;
  createdAt?: string;
}
