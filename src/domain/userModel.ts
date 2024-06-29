export interface User {
    id?: number;
    username: string;
    password: string;
    role: 'Padre' | 'Hijo' | 'Ladron';
     email?: string;
  phoneNumber?: string;
  }
  