// app/(dashboard)/subjects/new/page.tsx
import Link from "next/link";
import SubjectForm from "@/components/SubjectForm";

export default function SubjectCreatePage() {
  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Thêm môn học</h1>
        <Link
          href="/subjects"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Danh sách
        </Link>
      </div>

      <div className="rounded-xl border p-6">
        <SubjectForm initial={null} />
      </div>
    </div>
  );
}
