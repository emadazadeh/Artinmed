import SiteFrame from "@/components/site-frame";

export const metadata = { title: "صفحه پیدا نشد", robots: { index: false, follow: true } };

export default function NotFound() {
  return <SiteFrame><main id="main" tabIndex={-1} className="section"><div className="container not-found"><p className="eyebrow">۴۰۴ · صفحه پیدا نشد</p><h1>این مسیر در دسترس نیست.</h1><p>برای آشنایی با خدمات یا ثبت و پیگیری درخواست، به صفحهٔ اصلی بروید.</p><a className="button button-green" href="/">بازگشت به صفحهٔ اصلی</a></div></main></SiteFrame>;
}
