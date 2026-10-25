import type { CSSProperties, ReactNode } from "react";
export type IconName = "arrow" | "arrow-down" | "menu" | "close" | "sparkle" | "shield" | "calendar" | "leaf" | "check" | "chevron" | "camera" | "upload" | "clock" | "heart" | "face" | "laser" | "drop" | "copy" | "refresh" | "download" | "search" | "lock" | "stethoscope" | "video" | "home" | "syringe";
const paths: Record<IconName, ReactNode> = {
  stethoscope: <><path d="M5 3v5a5 5 0 0 0 10 0V3M3 3h4m6 0h4m-7 10v3a5 5 0 0 0 10 0v-3" /><circle cx="20" cy="10" r="3" /></>,
  video: <><rect x="2" y="5" width="14" height="14" rx="3" /><path d="m16 10 6-4v12l-6-4M7 10h4m-2-2v4" /></>,
  home: <><path d="m3 10 9-7 9 7v11H3V10Z" /><path d="M9 21v-7h6v7M9 9h6m-3-3v6" /></>,
  syringe: <><path d="m16 3 5 5m-3-3-3 3m-6 0 7 7m-9-9-3 3 11 11 3-3L7 6Zm-2 13-3 3m7-6-3 3" /></>,
  arrow: <path d="M18 6H6v12M6 6l12 12" />,
  "arrow-down": <path d="M12 4v16m-6-6 6 6 6-6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  sparkle: <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z" /><path d="m20 2 .5 1.5L22 4l-1.5.5L20 6l-.5-1.5L18 4l1.5-.5L20 2Z" /></>,
  shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" /><path d="m8 12 3 3 5-6" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 3v4m10-4v4M3 11h18m-13 4h1m6 0h1m-8 3h1" /></>,
  leaf: <><path d="M20 3C8 2 2 9 5 16s15 5 15-13Z" /><path d="M3 21 15 9m-6 6V9m0 6h6" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m14 6-6 6 6 6" />,
  camera: <><path d="m8 5 2-2h4l2 2h4v15H4V5h4Z" /><circle cx="12" cy="12" r="4" /></>,
  upload: <path d="M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  heart: <path d="M20.5 5.5a5 5 0 0 0-7 0L12 7l-1.5-1.5a5 5 0 0 0-7 7L12 21l8.5-8.5a5 5 0 0 0 0-7Z" />,
  face: <><path d="M7 4c1-2 9-2 10 0s2 6 1 11-6 7-6 7-5-2-6-7-1-9 1-11Z" /><path d="M8 10h2m4 0h2m-4 1-1 4h2m-4 2q3 2 6 0M7 4q1 4 10 4" /></>,
  laser: <path d="m16 3 5 5-9 9-5-5 9-9Zm-7 7 5 5M4 18l-2 2m4 0v2m-4-6H0m18 2 2 2" />,
  drop: <><path d="M12 2S4 11 4 15a8 8 0 0 0 16 0c0-4-8-13-8-13Z" /><path d="M8 15a4 4 0 0 0 4 4" /></>,
  copy: <><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V3H3v13h5" /></>,
  refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M19 10A7 7 0 0 0 6 6L4 8m16 8-2 2a7 7 0 0 1-13-4" /></>,
  download: <path d="M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4" />,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3" /></>,
};
export function Icon({ name, size = 22, className = "", style }: { name: IconName; size?: number; className?: string; style?: CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">{paths[name]}</svg>;
}
export function Brand({ light = false }: { light?: boolean }) {
  return <a className={`brand ${light ? "brand-light" : ""}`} href="#home" aria-label="دکتر رسون، صفحهٔ اصلی"><span className="brand-symbol" aria-hidden="true"><svg viewBox="0 0 40 48" fill="none"><path d="M9 39V9h9c20 0 20 30 0 30H9ZM24 19v10m-5-5h10" stroke="currentColor" strokeWidth="1.4" /><path d="M5 44h30" stroke="currentColor" strokeWidth="1.2" /></svg></span><span className="brand-type">دکتر رسون<span lang="en" dir="ltr">DOCTOR RESOON</span></span></a>;
}
