// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold">Student Management</h1>
      <p className="text-gray-600 mt-2">Chọn module để quản lý:</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link href="/students" className="rounded-xl border p-6 hover:shadow">
          Students
        </Link>
        <Link href="/classes" className="rounded-xl border p-6 hover:shadow">
          Classes
        </Link>
        <Link href="/subjects" className="rounded-xl border p-6 hover:shadow">
          Subjects
        </Link>
        <Link href="/scores" className="rounded-xl border p-6 hover:shadow">
          Scores
        </Link>
      </div>
    </div>
  );
}
