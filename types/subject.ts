// types/subject.ts
export type ObjectId = string;

export interface SubjectDoc {
  _id: ObjectId;
  code: string;
  name: string;
  credit?: number;
  // department?: string; // BE KHÔNG có -> bỏ

  createdAt?: string;
  updatedAt?: string;
}

export interface SubjectsListResponse {
  data: SubjectDoc[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
