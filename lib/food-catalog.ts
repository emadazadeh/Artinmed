import foodData from "../data/nutrition/foods.json" with { type: "json" };
import source from "../data/nutrition/source.json" with { type: "json" };
import { foodCategories, normalizeFoodSearch, type Food } from "./nutrition.ts";
export const nutritionSource = source;
export const foodCatalog = foodData as Food[];
const dictionary: Record<string, string> = {
  "سیب زمینی": "potato", "سیبزمینی": "potato", "تخم مرغ": "egg", "تخممرغ": "egg", "آب پز": "boiled", "آبپز": "boiled", "قهوه ای": "brown", "کم چرب": "low fat", "بدون چربی": "nonfat", "بدون نمک": "without salt", "چرخ کرده": "ground", "گوجه فرنگی": "tomato", "توت فرنگی": "strawberry", "نخود فرنگی": "peas", "جو دوسر": "oats", "آب میوه": "juice", "بادام زمینی": "peanut", "شیر خشک": "milk dry", "بوقلمون": "turkey", "برنج": "rice", "نان": "bread", "مرغ": "chicken", "گوشت": "meat", "گوساله": "beef", "گاو": "beef", "گوسفند": "lamb", "ماهی": "fish", "میگو": "shrimp", "عدس": "lentils", "نخود": "chickpeas", "لوبیا": "beans", "شیر": "milk", "ماست": "yogurt", "پنیر": "cheese", "خامه": "cream", "کره": "butter", "روغن": "oil", "زیتون": "olive", "بادام": "almonds", "گردو": "walnuts", "پسته": "pistachio", "فندق": "hazelnuts", "کنجد": "sesame", "کشمش": "raisins", "خرما": "dates", "سیب": "apples", "موز": "bananas", "پرتقال": "oranges", "خیار": "cucumber", "گوجه": "tomatoes", "هویج": "carrots", "کاهو": "lettuce", "کلم": "cabbage", "بروکلی": "broccoli", "پیاز": "onions", "سیر": "garlic", "قارچ": "mushrooms", "اسفناج": "spinach", "ذرت": "corn", "کدو": "squash", "بادمجان": "eggplant", "شکر": "sugar", "عسل": "honey", "شکلات": "chocolate", "بستنی": "ice cream", "کیک": "cake", "بیسکویت": "cookies", "پیتزا": "pizza", "همبرگر": "hamburger", "سوپ": "soup", "پاستا": "pasta", "ماکارونی": "pasta", "آرد": "flour", "گندم": "wheat", "جو": "barley", "بلغور": "bulgur", "پخته": "cooked", "خام": "raw", "سرخ": "fried", "سرخ شده": "fried", "تن": "tuna", "ماهی تن": "tuna", "سینه": "breast", "ران": "thigh", "انگور": "grapes", "انار": "pomegranates", "کیوی": "kiwifruit", "هندوانه": "watermelon", "طالبی": "cantaloupe", "زردآلو": "apricots", "گلابی": "pears", "هلو": "peaches", "آلو": "plums", "چای": "tea", "قهوه": "coffee", "نوشابه": "carbonated", "آب": "water", "سس": "sauce", "نمک": "salt", "آبلیمو": "lemon juice", "لیمو": "lemon", "سوسیس": "sausage", "کالباس": "luncheon", "فلفل": "pepper", "زعفران": "saffron", "دارچین": "cinnamon"
};
const translations = Object.entries(dictionary).map(([fa, en]) => [normalizeFoodSearch(fa), en] as const).sort((a,b) => b[0].length-a[0].length);
function translateQuery(query: string) {
  let result = ` ${query} `;
  for (const [fa, en] of translations) result = result.split(` ${fa} `).join(` ${en} `);
  return result.trim();
}
const index = foodCatalog.map(food => ({ food, text: normalizeFoodSearch([food.name, food.originalName, ...(food.aliases ?? [])].join(" ")) }));
export function searchFoods(query = "", category = "all", offset = 0, limit = 24) {
  const normalized = normalizeFoodSearch(query).slice(0, 100);
  const translated = translateQuery(normalized).split(" ").filter(Boolean);
  const original = normalized.split(" ").filter(Boolean);
  const compact = normalized.replace(/ /g, "");
  const matches = index.filter(({ food, text }) => (category === "all" || food.category === category) && (!normalized || original.every(word => text.includes(word)) || translated.every(word => text.includes(word)) || text.replace(/ /g, "").includes(compact)));
  return { foods: matches.slice(offset, offset + limit).map(({food}) => food), total: matches.length, offset, hasMore: offset + limit < matches.length };
}
export const catalogCategories = foodCategories.map(([id,label]) => ({ id, label, count: id === "all" ? foodCatalog.length : foodCatalog.filter(food => food.category === id).length }));
