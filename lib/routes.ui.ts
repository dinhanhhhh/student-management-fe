// lib/routes.ui.ts
export const PATHS = {
  home: "/",
  login: "/login",
  profile: "/profile",
  students: "/students",
  classes: "/classes",
  subjects: "/subjects",
  scores: "/scores",
} as const;

export type PathKey = keyof typeof PATHS;

export const NAV_LINKS: Array<{
  href: (typeof PATHS)[PathKey];
  label: string;
}> = [
  { href: PATHS.students, label: "Students" },
  { href: PATHS.classes, label: "Classes" },
  { href: PATHS.subjects, label: "Subjects" },
  { href: PATHS.scores, label: "Scores" },
];
