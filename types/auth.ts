// types/auth.ts
export interface LoginRequest {
  username: string; // BE nhận username
  password: string;
}

export type Role = "admin" | "teacher" | "student";

export interface MeUser {
  uid: string;
  role: Role;
  username: string;
  studentRef?: string | null;
}

// /api/auth/login trả về { user: { id, username, role } }
export interface LoginResponse {
  user: {
    id: string;
    username: string;
    role: Role;
  };
}
