// app/(dashboard)/scores/page.tsx
import Link from "next/link";
import Pagination from "@/components/Pagination";
import { getScores } from "@/lib/data-scores";
import type { ScoreDoc, ScoreStudentRef, ScoreSubjectRef } from "@/types/score";

// Next 15: searchParams là Promise
type SearchParams = Promise<{
  page?: string;
  limit?: string;
  studentId?: string;
  subjectId?: string;
  term?: string;
  sort?: string;
}>;

/* ---------------- Type guards (không dùng any) ---------------- */

function isObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object";
}

function isStudentRef(v: unknown): v is ScoreStudentRef {
  return (
    isObject(v) &&
    typeof (v as Record<string, unknown>)._id === "string" &&
    typeof (v as Record<string, unknown>).name === "string"
  );
}

function isSubjectRef(v: unknown): v is ScoreSubjectRef {
  const o = v as Record<string, unknown>;
  return (
    isObject(v) &&
    typeof o._id === "string" &&
    typeof o.name === "string" &&
    (typeof o.code === "string" || typeof o.code === "undefined")
  );
}

/* ----------- Helpers hiển thị text an toàn (không quăng object) ----------- */

function displayStudent(r: ScoreDoc): string {
  if (isStudentRef(r.student)) return r.student.name;

  if (isStudentRef(r.studentId)) {
    // Ưu tiên name, fallback studentId (mã SV), cuối cùng _id
    return r.studentId.name ?? r.studentId.studentId ?? r.studentId._id;
  }

  return typeof r.studentId === "string" ? r.studentId : "—";
}

function displaySubject(r: ScoreDoc): string {
  if (isSubjectRef(r.subject)) return r.subject.name;

  if (isSubjectRef(r.subjectId)) {
    // Ưu tiên name, fallback code, cuối cùng _id
    return r.subjectId.name ?? r.subjectId.code ?? r.subjectId._id;
  }

  return typeof r.subjectId === "string" ? r.subjectId : "—";
}

/** Key ổn định cho <tr>, kể cả khi thiếu _id (phòng hờ) */
function rowKey(r: ScoreDoc): string {
  const sidKey = isStudentRef(r.studentId)
    ? r.studentId._id
    : typeof r.studentId === "string"
    ? r.studentId
    : isStudentRef(r.student)
    ? r.student._id
    : "sid";

  const subKey = isSubjectRef(r.subjectId)
    ? r.subjectId._id
    : typeof r.subjectId === "string"
    ? r.subjectId
    : isSubjectRef(r.subject)
    ? r.subject._id
    : "sub";

  return r._id ?? `${sidKey}-${subKey}-${r.term}-${String(r.score)}`;
}

/* -------------------------------- Page -------------------------------- */

export default async function ScoresPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const page = Number.isFinite(Number(sp?.page)) ? Number(sp?.page) : 1;
  const limit = Number.isFinite(Number(sp?.limit)) ? Number(sp?.limit) : 12;
  const studentId =
    typeof sp?.studentId === "string" ? sp.studentId : undefined;
  const subjectId =
    typeof sp?.subjectId === "string" ? sp.subjectId : undefined;
  const term = typeof sp?.term === "string" ? sp.term : undefined;
  const sort = typeof sp?.sort === "string" ? sp.sort : undefined;

  // SSR fetch qua /be/scores → {API_URL}/api/scores
  const { data: scores, pagination } = await getScores({
    page,
    limit,
    studentId,
    subjectId,
    term,
    sort,
  });

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Bảng điểm</h1>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Dashboard
        </Link>
      </div>

      {/* Bộ filter tối giản (giữ URL) */}
      <form className="grid gap-2 sm:grid-cols-4 mb-4">
        {/* reset về trang 1 khi lọc */}
        <input type="hidden" name="page" value="1" />

        <input
          name="studentId"
          defaultValue={studentId ?? ""}
          placeholder="Filter studentId (ObjectId)"
          className="rounded-lg border px-3 py-2 text-sm"
        />
        <input
          name="subjectId"
          defaultValue={subjectId ?? ""}
          placeholder="Filter subjectId (ObjectId)"
          className="rounded-lg border px-3 py-2 text-sm"
        />
        <input
          name="term"
          defaultValue={term ?? ""}
          placeholder='Term (vd: "2025-1")'
          className="rounded-lg border px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <select
            name="sort"
            defaultValue={sort ?? "-createdAt"}
            className="rounded-lg border px-3 py-2 text-sm w-full"
          >
            <option value="-createdAt">Mới nhất</option>
            <option value="createdAt">Cũ nhất</option>
            <option value="score">Điểm tăng</option>
            <option value="-score">Điểm giảm</option>
          </select>
          <button className="rounded-lg bg-black text-white px-4 py-2 text-sm">
            Lọc
          </button>
        </div>
      </form>

      {scores.length === 0 ? (
        <p className="text-gray-500">Chưa có điểm.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="min-w-full text-sm">
            <thead className="bg-amber-500/10">
              <tr>
                <th className="px-3 py-2 text-left">Student</th>
                <th className="px-3 py-2 text-left">Subject</th>
                <th className="px-3 py-2 text-left">Term</th>
                <th className="px-3 py-2 text-right">Score</th>
                <th className="px-3 py-2 text-left">Note</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((r) => (
                <tr key={rowKey(r)} className="border-t">
                  <td className="px-3 py-2">{displayStudent(r)}</td>
                  <td className="px-3 py-2">{displaySubject(r)}</td>
                  <td className="px-3 py-2">{r.term}</td>
                  <td className="px-3 py-2 text-right">{r.score ?? "—"}</td>
                  <td className="px-3 py-2">{r.note ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dùng component client để giữ toàn bộ query param hiện có */}
      {pagination?.totalPages && pagination.totalPages > 1 && (
        <Pagination page={pagination.page} totalPages={pagination.totalPages} />
      )}
    </div>
  );
}
