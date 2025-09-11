# Student Management — Frontend (Next.js 15 + TypeScript + TailwindCSS)

Ứng dụng quản lý **Sinh viên / Lớp / Môn học / Điểm**.  
Frontend sử dụng **Next.js 15 (App Router)**, **TypeScript**, **TailwindCSS**, có **middleware bảo vệ route**, và **rewrite** proxy API tới Backend (đã deploy Render) để tránh CORS & giữ cookie.

---

## 1. Yêu cầu hệ thống
- Node.js >= 18.18 (khuyến nghị 18 LTS hoặc 20 LTS)
- pnpm / npm / yarn
- Backend đã chạy (local hoặc Render) mount API dưới `/api/*`

---

## 2. Cấu hình môi trường
Tạo file `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
# hoặc https://<your-backend>.onrender.com
```

---

## 3. Cài đặt & chạy
```bash
# install deps
npm install
# hoặc yarn / pnpm

# dev mode
npm run dev

# build & start
npm run build
npm start
```

---

## 4. Cấu trúc thư mục
```
student-management-fe/
├── app/               # App Router pages
│   ├── (auth)/login
│   ├── (dashboard)/students
│   ├── (dashboard)/classes
│   ├── (dashboard)/subjects
│   ├── (dashboard)/scores
│   └── profile
├── components/        # Form, Navbar, Pagination...
├── lib/               # api-client, api-server, data-*, routes.ui
├── types/             # TypeScript interfaces
├── middleware.ts      # route protection
├── next.config.ts     # rewrite /be/* -> {API_URL}/api/*
└── ...
```

---

## 5. Cách FE gọi API
- FE gọi `/be/...`
- Next.js rewrite `/be/:path*` -> `{API_URL}/api/:path*`
- Cookie auth đi kèm nhờ `credentials: "include"`

Ví dụ:
```ts
await fetch("/be/auth/login", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password }),
});
```

---

## 6. Middleware bảo vệ route
- Bảo vệ các path: `/students`, `/classes`, `/subjects`, `/scores`, `/profile`
- Gọi `GET /be/auth/me`
- Nếu 401 -> redirect `/login?next=...`
- Nếu role = student mà vào `/students/*` -> redirect `/profile`

---

## 7. Các module chính
- **Students**: CRUD sinh viên, tính tuổi từ `dateOfBirth`, badge class
- **Classes**: CRUD lớp, `ClassCard` fetch sĩ số client-side
- **Subjects**: CRUD môn học, filter/search/sort
- **Scores**: CRUD điểm, filter theo studentId, subjectId, term, sort
- **Profile**: `/students/me/profile` lấy hồ sơ sinh viên đăng nhập

---

## 8. Style & Lint
- Tailwind qua `@tailwindcss/postcss`
- ESLint extends `next/core-web-vitals`, `next/typescript`

---

## 9. Deploy
### Vercel
1. Push FE lên GitHub
2. Import project -> chọn Next.js
3. Set env:
   - `NEXT_PUBLIC_API_URL=https://<your-backend>.onrender.com`
4. Deploy

### Render (BE)
- FE rewrite `/be/*` -> BE `/api/*`
- BE cần `FE_ORIGIN=https://<your-fe>.vercel.app`

---

## 10. Debug thường gặp
- **Login 401**: thiếu `credentials: "include"` hoặc sai `FE_ORIGIN`
- **/be/* 404**: sai `NEXT_PUBLIC_API_URL` hoặc config rewrite
- **Middleware luôn redirect login**: BE down hoặc cookie không gửi
- **Ảnh không hiển thị**: thiếu domain trong `images.remotePatterns`

---

## License
MIT
