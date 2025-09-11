// lib/data-scores.ts
import { apiServerFetch } from "@/lib/api-server";
import type { ScoresListResponse, ScoreDoc } from "@/types/score";

/** Lấy danh sách điểm (BE: GET /api/scores) */
export async function getScores(options?: {
  page?: number;
  limit?: number;
  studentId?: string;
  subjectId?: string;
  term?: string;
  sort?: string;
}): Promise<ScoresListResponse> {
  const {
    page = 1,
    limit = 12,
    studentId,
    subjectId,
    term,
    sort,
  } = options ?? {};
  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("limit", String(limit));
  if (studentId) qs.set("studentId", studentId);
  if (subjectId) qs.set("subjectId", subjectId);
  if (term) qs.set("term", term);
  if (sort) qs.set("sort", sort);

  // chú ý: KHÔNG thêm "/api" ở path vì rewrite đã map /be/:path* -> {API_URL}/api/:path*
  const res = await apiServerFetch<ScoresListResponse>(
    `/scores?${qs.toString()}`
  );
  // đảm bảo tối thiểu cấu trúc trả về
  return {
    data: Array.isArray(res.data) ? (res.data as ScoreDoc[]) : [],
    pagination: res.pagination ?? { total: 0, page, limit, totalPages: 1 },
  };
}
