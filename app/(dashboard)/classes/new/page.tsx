// app/(dashboard)/classes/new/page.tsx
import Link from "next/link";
import ClassForm from "@/components/ClassForm";

export default function ClassCreatePage() {
  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Thêm lớp</h1>
        <Link href="/classes" className="text-sm text-blue-600 hover:underline">
          ← Danh sách
        </Link>
      </div>
      <div className="rounded-xl border p-6">
        <ClassForm initial={null} />
      </div>
    </div>
  );
}
