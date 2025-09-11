// app/(dashboard)/students/[id]/edit/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import StudentForm from "@/components/StudentForm";
import { getStudentById } from "@/lib/data-students";
import type { Student } from "@/types/student";

// ✅ Next 15: params là Promise -> phải await
type Params = Promise<{ id: string }>;

export default async function StudentEditPage({ params }: { params: Params }) {
  const { id } = await params;

  // Gọi BE, nếu 404/lỗi -> notFound()
  let stu: Student | null = null;
  try {
    stu = await getStudentById(id);
  } catch {
    return notFound();
  }
  if (!stu?._id) return notFound();

  // Chuẩn hoá dữ liệu ban đầu cho form
  const initial: Pick<
    Student,
    | "_id"
    | "name"
    | "email"
    | "studentId"
    | "gender"
    | "dateOfBirth"
    | "classId"
  > = {
    _id: stu._id,
    name: stu.name,
    email: stu.email,
    studentId: stu.studentId,
    gender: stu.gender,
    dateOfBirth: stu.dateOfBirth,
    classId: stu.classId, // nếu là ObjectId hoặc {_id,name,...} đều giữ nguyên cho form xử lý
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sửa sinh viên</h1>
        <div className="flex gap-3">
          <Link
            href={`/students/${id}`}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Chi tiết
          </Link>
          <Link
            href="/students"
            className="text-sm text-blue-600 hover:underline"
          >
            Danh sách
          </Link>
        </div>
      </div>

      <div className="rounded-xl border p-6">
        {/* key={id} để reset state form khi đổi sang sinh viên khác */}
        <StudentForm key={id} initial={initial} />
      </div>
    </div>
  );
}
