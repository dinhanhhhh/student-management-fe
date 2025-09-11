// types/student.ts
export type ObjectId = string;
export type Gender = "Male" | "Female" | "Other";

export interface ClassRef {
  _id: ObjectId;
  name: string;
  year: number;
  department: string;
}

export interface Student {
  _id: ObjectId;
  name: string;
  studentId?: string;
  email: string;
  gender?: Gender;
  dateOfBirth?: string;
  classId?: ObjectId | ClassRef;

  // BE hiện KHÔNG có phone/address -> bỏ để đồng bộ
  // phone?: string;
  // address?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface StudentsListResponse {
  data: Student[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type StudentDetailResponse = Student;

export interface DeleteResponse {
  message: string;
}

export interface StudentsQuery {
  page?: number | string;
  limit?: number | string;
  sort?: string;
  q?: string;
  classId?: ObjectId;
  gender?: Gender;
}

export function isClassRef(c: unknown): c is ClassRef {
  return (
    !!c &&
    typeof c === "object" &&
    "_id" in (c as ClassRef) &&
    "name" in (c as ClassRef)
  );
}
