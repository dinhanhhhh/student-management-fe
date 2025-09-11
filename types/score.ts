// types/score.ts
export type ObjectId = string;

type IdOrObj<T> = string | T;

export interface ScoreStudentRef {
  _id: ObjectId;
  name: string;
  studentId: string;
  email?: string;
}

export interface ScoreSubjectRef {
  _id: ObjectId;
  name: string;
  code: string;
  credit?: number;
}

export interface ScoreDoc {
  _id: ObjectId;
  studentId: IdOrObj<ScoreStudentRef>; // BE có thể populate
  subjectId: IdOrObj<ScoreSubjectRef>; // BE có thể populate
  term: string; // ví dụ "2025-1"
  score: number; // 0..10
  note?: string;
  createdAt?: string;
  updatedAt?: string;

  // một số API có thể trả thêm field populate riêng
  student?: ScoreStudentRef;
  subject?: ScoreSubjectRef;
}

export interface ScoresListResponse {
  data: ScoreDoc[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
