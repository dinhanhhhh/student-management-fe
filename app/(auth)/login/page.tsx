"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const nextPath = sp.get("next") || "/students";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      // Gọi BE: POST /api/auth/login qua rewrite /be/auth/login
      const res = await fetch("/be/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Login failed ${res.status}`);
      }
      router.replace(nextPath);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Đăng nhập thất bại";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-20 bg-amber-500 rounded-xl shadow p-6">
      <h1 className="text-2xl font-semibold mb-4">Đăng nhập</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm">Username</label>
          <input
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="student01"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">Mật khẩu</label>
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button
          className="w-full rounded-lg bg-black text-white py-2 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
