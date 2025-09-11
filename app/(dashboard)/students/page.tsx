// app/(dashboard)/students/page.tsx
import Link from "next/link";
import { getStudents, calcAge, classNameOf } from "@/lib/data-students";
import type { Student } from "@/types/student";

// ❗ Next.js 15: searchParams là API động → phải Promise và cần await
type SearchParams = Promise<{ page?: string; limit?: string }>;

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // ✅ BẮT BUỘC phải await trước khi dùng
  const sp = await searchParams;

  // an toàn khi parse số
  const page = Number.isFinite(Number(sp?.page)) ? Number(sp?.page) : 1;
  const limit = Number.isFinite(Number(sp?.limit)) ? Number(sp?.limit) : 12;

  const students = await getStudents(page, limit);

  return (
    <div className="container mx-auto p-8 font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Danh sách Sinh viên
        </h1>
        <Link href="/students/new">
          <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            + Thêm Sinh viên
          </button>
        </Link>
      </div>

      {students.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student: Student) => {
            const age = calcAge(student.dateOfBirth);
            const className = classNameOf(student);

            return (
              <div
                key={student._id} // dùng _id (BE trả _id)
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300 relative"
              >
                {/* Class Badge */}
                {className && (
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                    {className}
                  </div>
                )}
                <h2 className="text-2xl font-semibold text-blue-600">
                  {student.name}
                </h2>

                {/* Email & MSSV (nếu có) */}
                <p className="text-gray-600 mt-2">Email: {student.email}</p>
                {student.studentId && (
                  <p className="text-gray-600">MSSV: {student.studentId}</p>
                )}

                {/* Tuổi tính từ dateOfBirth */}
                <p className="text-gray-600">
                  Tuổi: {age !== null ? age : "—"}
                </p>

                {/* Tên lớp từ classId */}
                <p className="text-gray-600">Lớp: {className || "—"}</p>

                {/* Link sang chi tiết */}
                <Link
                  href={`/students/${student._id}`}
                  className="inline-block mt-4 text-sm text-blue-600 hover:underline"
                >
                  Xem chi tiết →
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          Không tìm thấy sinh viên nào.
        </p>
      )}
    </div>
  );
}
