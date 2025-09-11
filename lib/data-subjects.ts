// lib/data-subjects.ts
import { apiServerFetch } from "./api-server";
import type { SubjectDoc, SubjectsListResponse } from "@/types/subject";

/**
 * Lấy danh sách môn học với filter/sort/pagination.
 * Thuật ngữ:
 * - Query string (qs): chuỗi tham số sau dấu ? trong URL, dùng để lọc/phân trang/sắp xếp.
 */
export async function getSubjects(params: {
  page?: number;
  limit?: number;
  q?: string;
  creditMin?: number;
  creditMax?: number;
  sort?: string;
}): Promise<SubjectsListResponse> {
  const {
    page = 1,
    limit = 12,
    q = "",
    creditMin,
    creditMax,
    sort = "-createdAt",
  } = params;

  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("limit", String(limit));
  if (q) qs.set("q", q);
  if (typeof creditMin === "number") qs.set("creditMin", String(creditMin));
  if (typeof creditMax === "number") qs.set("creditMax", String(creditMax));
  if (sort) qs.set("sort", sort);

  return apiServerFetch<SubjectsListResponse>(`/subjects?${qs.toString()}`);
}

/**
 * Lấy chi tiết 1 môn học theo id.
 * Trả về null nếu lỗi/không tìm thấy.
 *
 * Giải thích:
 * - Generic <T>: cho TS biết kiểu dữ liệu kỳ vọng từ fetch.
 * - Union type SubjectDoc | null: hoặc có đối tượng môn học, hoặc không có (null).
 * - apiServerFetch ném (throw) lỗi khi !res.ok → dùng try/catch để “nuốt” lỗi và trả null.
 */
export async function getSubjectById(id: string): Promise<SubjectDoc | null> {
  if (!id) return null;
  try {
    const res = await apiServerFetch<SubjectDoc>(`/subjects/${id}`);
    return res; // Thành công → SubjectDoc
  } catch {
    return null; // Thất bại (404/500/parse) → null
  }
}
