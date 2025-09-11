// app/(dashboard)/students/new/page.tsx
import Link from "next/link";
import StudentForm from "@/components/StudentForm";

export default function StudentCreatePage() {
  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Thêm sinh viên</h1>
        <Link
          href="/students"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Danh sách
        </Link>
      </div>

      <div className="rounded-xl border p-6">
        <StudentForm initial={null} />
      </div>
    </div>
  );
}
