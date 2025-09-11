// app/(dashboard)/classes/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getClassById } from "@/lib/data-classes";
import type { ClassDoc } from "@/types/class";

// ✅ Next 15: params là Promise và cần await
type Params = Promise<{ id: string }>;

export default async function ClassDetailPage({ params }: { params: Params }) {
  const { id } = await params; // ✅ phải await

  let classDoc: ClassDoc | null = null;
  try {
    classDoc = await getClassById(id);
  } catch {
    return notFound();
  }
  if (!classDoc) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Chi tiết lớp</h1>
        <div className="flex gap-2">
          <Link
            href="/classes"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Danh sách lớp
          </Link>
          <Link
            href={`/classes/${id}/edit`}
            className="rounded-lg bg-black text-white px-3 py-2 text-sm"
          >
            Sửa lớp
          </Link>
        </div>
      </div>

      {/* Thông tin lớp */}
      <div className="rounded-xl border p-6 space-y-3">
        <div>
          <span className="font-semibold">Tên lớp:</span> {classDoc.name}
        </div>
        <div>
          <span className="font-semibold">Khoa:</span> {classDoc.department}
        </div>
        <div>
          <span className="font-semibold">Khóa/Năm:</span> {classDoc.year}
        </div>

        {classDoc.createdAt && (
          <div className="text-sm text-gray-500">
            Tạo lúc: {new Date(classDoc.createdAt).toLocaleString("vi-VN")}
          </div>
        )}
        {classDoc.updatedAt && (
          <div className="text-sm text-gray-500">
            Cập nhật: {new Date(classDoc.updatedAt).toLocaleString("vi-VN")}
          </div>
        )}

        <div className="text-xs text-gray-500">ID: {classDoc._id}</div>
      </div>
    </div>
  );
}
