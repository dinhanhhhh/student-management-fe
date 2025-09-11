// app/(dashboard)/classes/page.tsx
import Link from "next/link";
import { getClasses } from "@/lib/data-classes";
import type { ClassDoc } from "@/types/class";

type SearchParams = Promise<{ page?: string; limit?: string }>;

export default async function ClassesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Next.js 15: searchParams là Promise → cần await
  const sp = await searchParams;
  const page = Number.isFinite(Number(sp?.page)) ? Number(sp?.page) : 1;
  const limit = Number.isFinite(Number(sp?.limit)) ? Number(sp?.limit) : 12;

  // Bọc lỗi mềm để UI không sập nếu BE lỗi
  let classes: ClassDoc[] = [];
  try {
    classes = await getClasses(page, limit);
  } catch {
    classes = [];
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Danh sách lớp</h1>
        <div className="flex items-center gap-2">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← Dashboard
          </Link>
          <Link
            href="/classes/new"
            className="rounded-lg bg-black text-white px-3 py-2 text-sm"
          >
            + Thêm lớp
          </Link>
        </div>
      </div>

      {/* Nội dung */}
      {classes.length === 0 ? (
        <div className="text-gray-500">
          <p>Chưa có lớp nào.</p>
          <Link
            href="/classes/new"
            className="inline-block mt-3 text-sm text-blue-600 hover:underline"
          >
            Tạo lớp đầu tiên →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((c) => (
            <Link
              key={c._id}
              href={`/classes/${c._id}`}
              className="rounded-xl border p-4 hover:shadow transition"
            >
              <div className="text-lg font-semibold">{c.name}</div>
              <div className="text-gray-700">Khoa: {c.department}</div>
              <div className="text-gray-700">Khóa: {c.year}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
