// Keep the owner's Google verification response at this exact public URL.
// A route avoids static hosting's automatic removal of the .html suffix.
export function GET() {
  return new Response("google-site-verification: google5b4ed26796eb34ea.html\n", {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
