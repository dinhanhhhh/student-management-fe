// app/(dashboard)/subjects/page.tsx
import Link from "next/link";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import { getSubjects } from "@/lib/data-subjects";
import type { SubjectDoc } from "@/types/subject";

type SearchParams = Promise<{
  page?: string;
  limit?: string;
  q?: string;
  creditMin?: string;
  creditMax?: string;
  sort?: string;
}>;

function toNum(v?: string): number | undefined {
  return typeof v === "string" && v.trim() !== "" ? Number(v) : undefined;
}

export default async function SubjectsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  const page = Number.isFinite(Number(sp?.page)) ? Number(sp?.page) : 1;
  const limit = Number.isFinite(Number(sp?.limit)) ? Number(sp?.limit) : 12;
  const q = typeof sp?.q === "string" ? sp.q : "";
  const creditMin = toNum(sp?.creditMin);
  const creditMax = toNum(sp?.creditMax);
  const sort = typeof sp?.sort === "string" ? sp.sort : "-createdAt";

  const { data, pagination } = await getSubjects({
    page,
    limit,
    q,
    creditMin,
    creditMax,
    sort,
  });

  const totalPages = Math.max(1, pagination?.totalPages ?? 1);
  const curPage = Math.min(Math.max(1, pagination?.page ?? page), totalPages);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Danh sách môn học</h1>
        <div className="flex gap-2">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← Dashboard
          </Link>
          <Link
            href="/subjects/new"
            className="rounded-lg bg-black text-white px-3 py-2 text-sm"
          >
            + Thêm môn
          </Link>
        </div>
      </div>

      {/* 🔎 Search theo tên/mã môn – dùng param "q" */}
      <div className="mb-4">
        <SearchBar placeholder="Tìm theo tên hoặc mã môn…" param="q" />
      </div>

      {/* Filter giữ URL – reset về trang 1 khi lọc */}
      <form method="get" className="grid gap-2 sm:grid-cols-4 mb-4">
        <input type="hidden" name="page" value="1" />
        {/* giữ lại q hiện có khi lọc min/max/sort */}
        {q ? <input type="hidden" name="q" value={q} /> : null}

        <input
          name="creditMin"
          type="number"
          min={0}
          defaultValue={creditMin ?? ""}
          placeholder="Min tín chỉ"
          className="rounded-lg border px-3 py-2 text-sm"
        />
        <input
          name="creditMax"
          type="number"
          min={0}
          defaultValue={creditMax ?? ""}
          placeholder="Max tín chỉ"
          className="rounded-lg border px-3 py-2 text-sm"
        />
        <select
          name="sort"
          defaultValue={sort}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="-createdAt">Mới nhất</option>
          <option value="createdAt">Cũ nhất</option>
          <option value="name">Tên A→Z</option>
          <option value="-name">Tên Z→A</option>
          <option value="code">Mã A→Z</option>
          <option value="-code">Mã Z→A</option>
        </select>

        <button className="rounded-lg bg-black text-white px-3 py-2 text-sm">
          Lọc
        </button>
      </form>

      {data.length === 0 ? (
        <p className="text-gray-500">Chưa có môn học.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((s: SubjectDoc) => (
            <Link
              key={s._id}
              href={`/subjects/${s._id}`}
              className="rounded-xl border p-4 hover:shadow-md transition"
            >
              <div className="text-lg font-semibold">{s.name}</div>
              <div className="text-gray-700">Mã: {s.code}</div>
              <div className="text-gray-700">Tín chỉ: {s.credit ?? 0}</div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && <Pagination page={curPage} totalPages={totalPages} />}
    </div>
  );
}
