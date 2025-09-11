// app/profile/page.tsx
import { apiServerFetch } from "@/lib/api-server";

type ClassRef = {
  _id: string;
  name: string;
  year: number;
  department: string;
};

type MeStudent = {
  _id: string;
  name: string;
  email: string;
  studentId?: string;
  gender?: "Male" | "Female" | "Other";
  dateOfBirth?: string;
  classId?: string | ClassRef;

  // BE không có 2 trường này -> bỏ cho đồng bộ
  // phone?: string;
  // address?: string;

  createdAt?: string;
  updatedAt?: string;
};

function classNameOf(c?: string | ClassRef) {
  if (!c) return "";
  if (typeof c === "string") return c;
  return c.name ?? "";
}

function calcAge(dob?: string) {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age < 0 ? null : age;
}

export default async function ProfilePage() {
  const me = await apiServerFetch<MeStudent>("/students/me/profile");

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Hồ sơ của bạn</h1>

      <div className="rounded-xl border p-6 space-y-2">
        <div>
          <span className="font-medium">Họ tên:</span> {me.name}
        </div>
        <div>
          <span className="font-medium">Email:</span> {me.email}
        </div>
        {me.studentId && (
          <div>
            <span className="font-medium">MSSV:</span> {me.studentId}
          </div>
        )}
        <div>
          <span className="font-medium">Tuổi:</span>{" "}
          {calcAge(me.dateOfBirth) ?? "—"}
        </div>
        <div>
          <span className="font-medium">Lớp:</span>{" "}
          {classNameOf(me.classId) || "—"}
        </div>
        {/* Không render phone/address vì BE không có */}
      </div>
    </div>
  );
}
