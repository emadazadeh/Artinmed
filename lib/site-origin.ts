// Owner-confirmed production domain. Never derive SEO identity from request headers.
export const primaryOrigin = "https://doctorreson.ir";
export const legacyOrigin = "https://doctor-resoon.cometolive34.chatgpt.site";
export const googleVerificationPath = "/google5b4ed26796eb34ea.html";
const primaryHost = new URL(primaryOrigin).hostname;
const alternateHosts = new Set([new URL(legacyOrigin).hostname, `www.${primaryHost}`]);

export function canonicalRedirectUrl(request: Pick<Request, "url" | "method">): string | null {
  if (request.method !== "GET" && request.method !== "HEAD") return null;
  const url = new URL(request.url);
  if (url.hostname !== primaryHost && !alternateHosts.has(url.hostname)) return null;
  // Preserve verification on the old property, same-origin API clients and public assets.
  if (url.pathname === googleVerificationPath || url.pathname === "/robots.txt" || url.pathname === "/sitemap.xml" || ["/api/", "/_next/", "/images/", "/fonts/", "/data/"].some(prefix => url.pathname.startsWith(prefix))) return null;
  const path = url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/, "") || "/";
  if (url.hostname === primaryHost && url.protocol === "https:" && path === url.pathname) return null;
  const destination = new URL(primaryOrigin);
  destination.pathname = path;
  destination.search = url.search;
  return destination.href;
}
