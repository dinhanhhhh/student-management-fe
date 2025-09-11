// types/class.ts
export type ObjectId = string;

export interface ClassDoc {
  _id: ObjectId;
  name: string;
  year: number;
  department: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClassesListResponse {
  data: ClassDoc[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
