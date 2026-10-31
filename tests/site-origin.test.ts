import test from "node:test";
import assert from "node:assert/strict";
import { canonicalRedirectUrl, googleVerificationPath, legacyOrigin, primaryOrigin } from "../lib/site-origin.ts";
import { pageMetadata, pageSchema, publicPaths, site } from "../lib/site.ts";

test("every public page has canonical and sharing URLs on the owner-confirmed primary domain", () => {
  assert.equal(site.url, "https://doctorreson.ir");
  for (const path of publicPaths) {
    const meta = pageMetadata("عنوان صفحه", "توضیح صفحه", path);
    assert.equal(meta.alternates?.canonical, new URL(path, primaryOrigin).href);
    const serialized = JSON.stringify(meta);
    assert.ok(!serialized.includes(legacyOrigin));
    assert.ok(serialized.includes(primaryOrigin + "/images/"));
    assert.ok(!JSON.stringify(pageSchema({ path, title:"عنوان", description:"توضیح" })).includes(legacyOrigin));
  }
});
test("legacy pages, HTTP and www consolidate with their exact path and query preserved", () => {
  assert.equal(canonicalRedirectUrl({url:legacyOrigin+"/services/medical-care?utm_source=instagram",method:"GET"}),primaryOrigin+"/services/medical-care?utm_source=instagram");
  assert.equal(canonicalRedirectUrl({url:"http://doctorreson.ir/contact",method:"GET"}),primaryOrigin+"/contact");
  assert.equal(canonicalRedirectUrl({url:"https://www.doctorreson.ir/calorie-counter",method:"HEAD"}),primaryOrigin+"/calorie-counter");
  assert.equal(canonicalRedirectUrl({url:primaryOrigin+"/about/",method:"GET"}),primaryOrigin+"/about");
  assert.equal(canonicalRedirectUrl({url:primaryOrigin+"/about?utm_source=test",method:"GET"}),null);
  assert.equal(canonicalRedirectUrl({url:primaryOrigin+"/",method:"HEAD"}),null);
});
test("verification, crawlers, assets, API requests and local previews retain their endpoints", () => {
  for (const path of [googleVerificationPath,"/robots.txt","/sitemap.xml","/api/appointments","/api/appointments/track","/api/foods?q=rice","/_next/static/app.js","/fonts/Vazirmatn.woff2","/images/emad-azadeh-care-480.webp","/data/calorie-foods.csv"]) assert.equal(canonicalRedirectUrl({url:legacyOrigin+path,method:"GET"}),null,path);
  assert.equal(canonicalRedirectUrl({url:legacyOrigin+"/api/appointments",method:"POST"}),null);
  assert.equal(canonicalRedirectUrl({url:"http://127.0.0.1:8787/about/",method:"GET"}),null);
  assert.equal(canonicalRedirectUrl({url:"https://unrelated.example/contact",method:"GET"}),null);
});
test("crafted paths and lookalike hosts cannot create an external redirect or loop", () => {
  const target = canonicalRedirectUrl({url:legacyOrigin+"//evil.example/path",method:"GET"})!;
  assert.equal(new URL(target).origin,primaryOrigin);
  assert.equal(canonicalRedirectUrl({url:"https://doctorreson.ir.evil.example/about",method:"GET"}),null);
  assert.equal(canonicalRedirectUrl({url:target,method:"GET"}),null);
});
