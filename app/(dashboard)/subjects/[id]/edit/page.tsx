// app/(dashboard)/subjects/[id]/edit/page.tsx
import Link from "next/link";
import SubjectForm from "@/components/SubjectForm";
import { getSubjectById } from "@/lib/data-subjects";
import type { SubjectDoc } from "@/types/subject";

type Params = Promise<{ id: string }>;

export default async function SubjectEditPage({ params }: { params: Params }) {
  const { id } = await params;

  // Lấy dữ liệu chi tiết để prefill form; nếu lỗi/không có -> 404 do SubjectForm không tự xử lý
  const subject = await getSubjectById(id);
  if (!subject) {
    // Next.js tự render trang 404 nếu throw notFound();
    // nhưng ở đây ta có thể chủ động điều hướng ra /subjects hoặc dùng notFound().
    // Đơn giản: throw notFound(); (nếu bạn muốn)
    // import { notFound } from "next/navigation"; rồi gọi notFound();
    // Ở đây chọn cách fallback link:
    return (
      <div className="max-w-xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy môn học</h1>
        <Link href="/subjects" className="text-blue-600 hover:underline">
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  // Chuẩn hoá initial cho SubjectForm
  const initial: Pick<SubjectDoc, "_id" | "name" | "code" | "credit"> = {
    _id: subject._id,
    name: subject.name,
    code: subject.code,
    credit: subject.credit ?? 0,
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sửa môn học</h1>
        <div className="flex gap-3">
          <Link
            href={`/subjects/${id}`}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Chi tiết
          </Link>
          <Link
            href="/subjects"
            className="text-sm text-blue-600 hover:underline"
          >
            Danh sách
          </Link>
        </div>
      </div>

      <div className="rounded-xl border p-6">
        <SubjectForm initial={initial} />
      </div>
    </div>
  );
}
