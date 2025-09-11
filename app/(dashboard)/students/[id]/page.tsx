// app/(dashboard)/students/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { apiServerFetch } from "@/lib/api-server";
import type { Student } from "@/types/student";

// ✅ Next.js 15: params là Promise -> cần await trước khi dùng
type Params = Promise<{ id: string }>;

export default async function StudentDetail({ params }: { params: Params }) {
  const { id } = await params;

  let stu: Student | null = null;
  try {
    stu = await apiServerFetch<Student>(`/students/${id}`);
  } catch {
    return notFound();
  }
  if (!stu?._id) return notFound();

  return (
    <div className="rounded-xl border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Chi tiết sinh viên</h1>
        <Link
          href={`/students/${id}/edit`}
          className="text-sm text-white bg-blue-600 rounded px-3 py-1"
        >
          Sửa
        </Link>
      </div>

      <div className="space-y-1">
        <div>
          <span className="font-medium">Tên:</span> {stu.name}
        </div>
        <div>
          <span className="font-medium">Email:</span> {stu.email}
        </div>
        {stu.studentId && (
          <div>
            <span className="font-medium">MSSV:</span> {stu.studentId}
          </div>
        )}
      </div>
    </div>
  );
}
