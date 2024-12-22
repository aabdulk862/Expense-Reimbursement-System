export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string; // 'employee' or 'manager'
}

export interface Reimbursement {
  reimId: number;
  description: string;
  amount: number;
  status: string; // 'PENDING', 'APPROVED', 'DENIED'
  userId: number;
}
