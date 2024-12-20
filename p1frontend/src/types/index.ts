export interface User {
  userId: number;
  name: string;
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
