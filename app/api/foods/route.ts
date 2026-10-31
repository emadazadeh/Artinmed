import { searchFoods } from "@/lib/food-catalog";
import { foodCategories } from "@/lib/nutrition";
export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const query = params.get("q") ?? "";
  const category = params.get("category") ?? "all";
  const offset = Number(params.get("offset") ?? 0);
  if (query.length > 100 || !foodCategories.some(([id]) => id === category) || !Number.isInteger(offset) || offset < 0 || offset > 10000) return Response.json({error:"جست‌وجو معتبر نیست."},{status:400,headers:{"X-Robots-Tag":"noindex"}});
  return Response.json(searchFoods(query, category, offset), { headers: { "Cache-Control": "public, max-age=3600", "X-Robots-Tag": "noindex" } });
}
