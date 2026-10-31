import assert from "node:assert/strict";
import test from "node:test";
import { calculateFood, calorieDate, parseFoodNumber, readDiary, totalCalories, validDiaryDate, type DiaryEntry } from "../lib/nutrition.ts";
import { foodCatalog, nutritionSource, searchFoods } from "../lib/food-catalog.ts";

const egg = foodCatalog.find(food => food.id === "173424")!;
const rice = foodCatalog.find(food => food.id === "168878")!;
const eggUnit = egg.portions.find(unit => unit.id === egg.defaultPortion)!;
const riceUnit = rice.portions.find(unit => unit.id === rice.defaultPortion)!;
const entry: DiaryEntry = { id: "example-egg", date: "2026-10-31", meal: "breakfast", foodName: egg.name, fdcId: egg.id, kcal100g: egg.kcal100g, amount: 1, portion: eggUnit };

test("pinned USDA dataset has a calorie value and positive, traceable portions for all 7793 records", () => {
  assert.equal(foodCatalog.length, 7793); assert.equal(nutritionSource.records, 7793);
  assert.equal(new Set(foodCatalog.map(food => food.id)).size, foodCatalog.length);
  for (const food of foodCatalog) {
    assert.ok(Number.isFinite(food.kcal100g) && food.kcal100g >= 0 && food.kcal100g <= 1000);
    assert.ok(food.portions.some(unit => unit.id === food.defaultPortion));
    assert.ok(food.portions.every(unit => Number.isFinite(unit.grams) && unit.grams > 0 && ["weight", "usda", "cup/16", "tbsp/3"].includes(unit.basis)));
  }
});
test("one large boiled egg and five level tablespoons of plain cooked rice use different measured weights", () => {
  assert.equal(egg.kcal100g, 155); assert.equal(eggUnit.grams, 50);
  assert.equal(rice.kcal100g, 130); assert.equal(riceUnit.grams, 158 / 16);
  assert.equal(calculateFood(egg.kcal100g, 1, eggUnit.grams).kcal, 77.5);
  assert.equal(calculateFood(rice.kcal100g, 5, riceUnit.grams).kcal, 64.1875);
  assert.equal(totalCalories([entry, { ...entry, id: "rice", kcal100g: rice.kcal100g, amount: 5, portion: riceUnit }]), 141.6875);
  const oil = foodCatalog.find(food => food.id === "171413")!;
  const spoon = oil.portions.find(unit => ["tbsp", "tablespoon"].includes(unit.original))!;
  assert.notEqual(spoon.grams, riceUnit.grams);
});
test("Persian, Arabic and decimal quantities preserve half portions and reject non-numeric input", () => {
  assert.equal(parseFoodNumber("۰٫۵"), .5); assert.equal(parseFoodNumber("١٫٥"), 1.5); assert.equal(parseFoodNumber("1,5"), 1.5); assert.equal(parseFoodNumber("۱٬۰۰۰"), 1000);
  assert.equal(calculateFood(155, .5, 50).kcal, 38.75);
  for (const bad of ["", " ", "-1", "Infinity", "1e3", "دو", "1.2.3"]) assert.ok(Number.isNaN(parseFoodNumber(bad)));
  for (const bad of [0, -1, NaN, Infinity]) assert.throws(() => calculateFood(155, bad, 50));
  assert.throws(() => calculateFood(155, 201, 50)); assert.equal(calculateFood(0, 1, 240).kcal, 0);
});
test("meal totals retain unrounded values instead of compounding display rounding", () => {
  assert.equal(totalCalories(Array.from({ length: 10 }, (_, i) => ({ ...entry, id: String(i), amount: .1 }))), 77.5);
});
test("search accepts Persian spelling variants, Arabic letters, English and broader Persian food terms", () => {
  for (const query of ["تخم‌مرغ", "تخم مرغ", "تخممرغ", "egg"]) assert.ok(searchFoods(query).foods.some(food => food.id === egg.id), query);
  assert.ok(searchFoods("برنج").foods.some(food => food.id === rice.id));
  assert.ok(searchFoods("برنج قهوه ای").foods.some(food => food.id === "169704"));
  assert.ok(searchFoods("سینه مرغ").foods.some(food => food.id === "171477"));
  assert.ok(searchFoods("كيوي").foods.some(food => food.id === "168153"));
  assert.ok(searchFoods("", "protein").foods.some(food => food.id === egg.id));
  assert.equal(searchFoods("thisfooddoesnotexist").total, 0);
  assert.notEqual(searchFoods("", "all", 0).foods[0].id, searchFoods("", "all", 24).foods[0].id);
});
test("Tehran dates, impossible dates and saved diary snapshots are validated without silent data loss", () => {
  assert.equal(calorieDate(new Date("2026-10-30T21:00:00Z")), "2026-10-31");
  assert.ok(validDiaryDate("2028-02-29"));
  for (const bad of ["2026-02-29", "2026-99-99", "2026-02-31", "2026-1-1", "", null]) assert.equal(validDiaryDate(bad), false);
  assert.deepEqual(readDiary(null), []); assert.deepEqual(readDiary(JSON.stringify([entry])), [entry]);
  for (const bad of ["bad json", "{}", "null", JSON.stringify([entry, entry]), JSON.stringify([{...entry, amount: -1}]), JSON.stringify([{...entry, date:"2026-99-99"}]), JSON.stringify([{...entry, portion:{...entry.portion,grams:0}}])]) assert.throws(() => readDiary(bad));
});
