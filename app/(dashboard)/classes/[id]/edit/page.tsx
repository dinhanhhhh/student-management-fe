// app/(dashboard)/classes/[id]/edit/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import ClassForm from "@/components/ClassForm";
import { apiServerFetch } from "@/lib/api-server";
import type { ClassDoc } from "@/types/class";

// ❗ Next 15: params là ĐỒNG BỘ, không phải Promise
type Params = { id: string };

export default async function ClassEditPage({ params }: { params: Params }) {
  const { id } = params;

  // gọi BE, nếu 404/lỗi -> notFound()
  let cls: ClassDoc | null = null;
  try {
    cls = await apiServerFetch<ClassDoc>(`/classes/${id}`);
  } catch {
    return notFound();
  }
  if (!cls) return notFound();

  const initial: Pick<ClassDoc, "_id" | "name" | "department" | "year"> = {
    _id: cls._id,
    name: cls.name,
    department: cls.department,
    year: cls.year,
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sửa lớp</h1>
        <div className="flex gap-3">
          <Link
            href={`/classes/${id}`}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Chi tiết
          </Link>
          <Link
            href="/classes"
            className="text-sm text-blue-600 hover:underline"
          >
            Danh sách
          </Link>
        </div>
      </div>

      <div className="rounded-xl border p-6">
        {/* gợi ý thêm key để reset form khi đổi id */}
        <ClassForm key={id} initial={initial} />
      </div>
    </div>
  );
}
