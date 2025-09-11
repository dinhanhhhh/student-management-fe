import type {
  Student,
  StudentsListResponse,
  StudentsQuery,
  ClassRef,
  ObjectId,
} from "@/types/student";
import { apiServerFetch } from "./api-server";

export async function getStudents(
  page = 1,
  limit = 12,
  extras?: Omit<StudentsQuery, "page" | "limit">
): Promise<Student[]> {
  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("limit", String(limit));
  if (extras?.sort) qs.set("sort", extras.sort);
  if (extras?.q) qs.set("q", extras.q);
  if (extras?.classId) qs.set("classId", extras.classId as ObjectId);
  if (extras?.gender) qs.set("gender", extras.gender);

  const data = await apiServerFetch<StudentsListResponse>(`/students?${qs}`);
  return data.data;
}

export async function getStudentById(id: string): Promise<Student> {
  return apiServerFetch<Student>(`/students/${id}`);
}

export function calcAge(dob?: string): number | null {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age < 0 ? null : age;
}

export function classNameOf(s: Pick<Student, "classId">): string {
  const c = s.classId;
  if (!c) return "";
  if (typeof c === "string") return c;
  const ref = c as ClassRef;
  return ref.name ?? "";
}
