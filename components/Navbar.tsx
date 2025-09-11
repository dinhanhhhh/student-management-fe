"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { NAV_LINKS, PATHS } from "@/lib/routes.ui";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  // Ẩn navbar ở trang public (login)
  const hide = useMemo(() => {
    if (!pathname) return false;
    return pathname === PATHS.login;
  }, [pathname]);

  if (hide) return null;

  async function logout() {
    try {
      setLoading(true);
      await fetch("/be/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // nuốt lỗi nhẹ
    } finally {
      setLoading(false);
      router.replace(PATHS.login);
      router.refresh();
    }
  }

  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-bold">
          Student Manager
        </Link>
        <ul className="hidden md:flex items-center gap-4 text-sm">
          {NAV_LINKS.map((it) => (
            <li key={it.href}>
              <Link
                className={
                  pathname?.startsWith(it.href)
                    ? "text-blue-600 font-medium"
                    : "hover:underline"
                }
                href={it.href}
              >
                {it.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={logout}
          disabled={loading}
          className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded disabled:opacity-50"
        >
          {loading ? "Đang thoát..." : "Đăng xuất"}
        </button>
      </div>
    </nav>
  );
}
