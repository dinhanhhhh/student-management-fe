// lib/data-classes.ts
import type { ClassDoc, ClassesListResponse } from "@/types/class";
import { apiServerFetch } from "./api-server";

export async function getClasses(
  page = 1,
  limit = 12,
  opts?: { q?: string; department?: string; year?: number; sort?: string }
): Promise<ClassDoc[]> {
  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("limit", String(limit));
  if (opts?.q) qs.set("q", opts.q);
  if (opts?.department) qs.set("department", opts.department);
  if (typeof opts?.year === "number") qs.set("year", String(opts.year));
  if (opts?.sort) qs.set("sort", opts.sort);

  // BE trả envelope { data, pagination } theo types của bạn
  const resp = await apiServerFetch<ClassesListResponse>(
    `/classes?${qs.toString()}`
  );
  return resp.data;
}

/**
 * Lấy chi tiết 1 lớp. Trả về null nếu lỗi/không tìm thấy.
 * Không phụ thuộc vào skipThrow (đề phòng apiServerFetch của bạn không có tham số thứ 3).
 */
export async function getClassById(id: string): Promise<ClassDoc | null> {
  if (!id) return null;
  try {
    const doc = await apiServerFetch<ClassDoc>(`/classes/${id}`);
    // Phòng thủ: kiểm tra tối thiểu field chính
    if (!doc || typeof doc !== "object" || !("_id" in doc)) return null;
    return doc as ClassDoc;
  } catch {
    return null;
  }
}
