// app/(dashboard)/subjects/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSubjectById } from "@/lib/data-subjects";

// ✅ Next.js 15: params là Promise -> cần await
type Params = Promise<{ id: string }>;

export default async function SubjectDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  // Gọi API chi tiết; nếu lỗi/404 -> notFound()
  let subject: Awaited<ReturnType<typeof getSubjectById>> | null = null;
  try {
    subject = await getSubjectById(id);
  } catch {
    return notFound();
  }
  if (!subject) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Chi tiết môn học</h1>
        <div className="flex gap-3">
          <Link
            href="/subjects"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Danh sách
          </Link>
          <Link
            href={`/subjects/${id}/edit`}
            className="text-sm text-white bg-blue-600 rounded px-3 py-1"
          >
            Sửa
          </Link>
        </div>
      </div>

      <div className="mt-6 rounded-xl border p-6 space-y-2">
        <div>
          <span className="font-semibold">Tên:</span> {subject.name}
        </div>
        <div>
          <span className="font-semibold">Mã:</span> {subject.code}
        </div>
        <div>
          <span className="font-semibold">Số tín chỉ:</span> {subject.credit}
        </div>
        <div className="text-sm text-gray-500">ID: {subject._id}</div>
      </div>
    </div>
  );
}
