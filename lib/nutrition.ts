export type FoodPortion = { id: string; label: string; grams: number; basis: string; original: string };
export type Food = { id: string; name: string; originalName: string; category: string; kcal100g: number; portions: FoodPortion[]; defaultPortion: string; localized: boolean; aliases?: string[]; note?: string };
export const foodCategories = [
  ["all", "همهٔ غذاها"], ["grains", "نان و غلات"], ["protein", "تخم‌مرغ و گوشت"], ["dairy", "لبنیات"], ["fruits", "میوه‌ها"], ["vegetables", "سبزیجات"], ["legumes", "حبوبات"], ["nuts", "مغزها و دانه‌ها"], ["fats", "روغن و چربی"], ["drinks", "نوشیدنی‌ها"], ["sweets", "شیرینی و تنقلات"], ["meals", "غذاهای آماده"], ["other", "سایر مواد"]
] as const;
export const meals = [["breakfast", "صبحانه"], ["lunch", "ناهار"], ["dinner", "شام"], ["snack", "میان‌وعده"]] as const;
export type Meal = typeof meals[number][0];
export type DiaryEntry = { id: string; date: string; meal: Meal; foodName: string; kcal100g: number; amount: number; portion: FoodPortion; fdcId?: string };
export const diaryStorageKey = "doctor-resoon.calorie-diary.v1";
export function parseFoodNumber(value: string): number {
  const s = value.trim().replace(/[۰-۹]/g, d => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[٠-٩]/g, d => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).replace(/[٫,]/g, ".").replace(/٬/g, "");
  return /^(?:\d+(?:\.\d*)?|\.\d+)$/.test(s) ? Number(s) : NaN;
}
export function normalizeFoodSearch(value: string) {
  return value.normalize("NFKC").toLowerCase().replace(/ي|ى/g, "ی").replace(/ك/g, "ک").replace(/أ|إ|آ/g, "ا").replace(/[\u064B-\u065F\u0670]/g, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim().replace(/\s+/g, " ");
}
export function calculateFood(kcal100g: number, amount: number, gramsPerUnit: number) {
  if (![kcal100g, amount, gramsPerUnit].every(Number.isFinite) || kcal100g < 0 || kcal100g > 1000 || amount <= 0 || gramsPerUnit <= 0 || amount * gramsPerUnit > 10000) throw new Error("مقدار واردشده معتبر نیست؛ وزن هر ثبت باید بیشتر از صفر و حداکثر ۱۰ کیلوگرم باشد.");
  const grams = amount * gramsPerUnit;
  return { grams, kcal: kcal100g * grams / 100 };
}
export function entryCalories(entry: DiaryEntry) { return calculateFood(entry.kcal100g, entry.amount, entry.portion.grams).kcal; }
export function totalCalories(entries: readonly DiaryEntry[]) { return entries.reduce((sum, entry) => sum + entryCalories(entry), 0); }
export function calorieDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tehran", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}
export function validDiaryDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value < "2000-01-01" || value > "2100-12-31") return false;
  const parsed = new Date(value + "T12:00:00Z");
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
export function readDiary(raw: string | null): DiaryEntry[] {
  if (!raw) return [];
  const data: unknown = JSON.parse(raw);
  if (!Array.isArray(data) || data.length > 2000) throw new Error("اطلاعات ذخیره‌شده قابل خواندن نیست.");
  const ids = new Set<string>();
  for (const item of data) {
    const e = item as DiaryEntry;
    if (!e || typeof e !== "object" || typeof e.id !== "string" || !e.id || e.id.length > 100 || ids.has(e.id) || !validDiaryDate(e.date) || !meals.some(([id]) => id === e.meal) || typeof e.foodName !== "string" || !e.foodName.trim() || e.foodName.length > 300 || typeof e.kcal100g !== "number" || typeof e.amount !== "number" || !e.portion || typeof e.portion.grams !== "number" || typeof e.portion.id !== "string" || typeof e.portion.label !== "string" || e.portion.label.length > 300 || (e.fdcId !== undefined && (typeof e.fdcId !== "string" || !/^\d+$/.test(e.fdcId)))) throw new Error("اطلاعات ذخیره‌شده قابل خواندن نیست.");
    calculateFood(e.kcal100g, e.amount, e.portion.grams); ids.add(e.id);
  }
  return data as DiaryEntry[];
}
export const foodNumber = (n: number, decimals = 1) => new Intl.NumberFormat("fa-IR", { maximumFractionDigits: decimals }).format(n);
