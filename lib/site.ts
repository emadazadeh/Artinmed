import type { Metadata } from "next";
import { services } from "./clinic-data.ts";
import { contact, founder } from "./brand.ts";

// Confirmed public origin. Update this single value when moving to a custom domain.
export const site = {
  name: "دکتر رسون",
  url: "https://doctor-resoon.cometolive34.chatgpt.site",
  title: "دکتر رسون | تغذیه و ورزش، ویزیت آنلاین و مراقبت در منزل",
  description: "برنامه تغذیه و ورزش برای چاقی و لاغری، ویزیت آنلاین پزشک، سرم‌تراپی و تیم درمانی در منزل، واکسیناسیون و مراقبت پیشگیرانه؛ ثبت و پیگیری درخواست در دکتر رسون.",
  socialImage: "/images/doctor-resoon-care-social.webp",
} as const;

export const publicPaths = ["/", "/services", ...services.map(service => `/services/${service.id}`), "/about", "/contact", "/privacy"];

// Actual editorial updates, not build time. Leave undated pages out of this map.
export const pageUpdatedAt: Record<string, string> = {
  "/": "2026-10-27",
  "/services": "2026-10-27",
  ...Object.fromEntries(services.map(service => [`/services/${service.id}`, "2026-10-27"])),
};

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = new URL(path, site.url).href;
  const fullTitle = title.includes(site.name) ? title : `${title} | ${site.name}`;
  const image = new URL(site.socialImage, site.url).href;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      locale: "fa_IR",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: "دکتر عماد آزاده، مدیر و مؤسس دکتر رسون؛ ویزیت آنلاین و مراقبت در منزل" }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [{ url: image, alt: "دکتر عماد آزاده، مدیر و مؤسس دکتر رسون" }],
    },
  };
}

export function pageSchema({ path, title, description, questions = [], serviceId }: {
  path: string;
  title: string;
  description: string;
  questions?: readonly (readonly [string, string])[];
  serviceId?: string;
}) {
  const url = new URL(path, site.url).href;
  const organizationId = `${site.url}/#organization`;
  const websiteId = `${site.url}/#website`;
  const founderId = `${site.url}${founder.path}#founder`;
  const graph: Record<string, unknown>[] = [
    { "@type": "Organization", "@id": organizationId, name: site.name, alternateName: "Doctor Resoon", url: site.url, logo: `${site.url}/favicon.svg`, telephone: contact.phone, founder: { "@id": founderId }, contactPoint: { "@type": "ContactPoint", telephone: contact.phone, contactType: "هماهنگی خدمات", availableLanguage: "fa-IR", url: `${site.url}/contact` } },
    { "@type": "Person", "@id": founderId, name: founder.name, jobTitle: founder.role, url: `${site.url}${founder.path}`, image: new URL(founder.portrait, site.url).href, worksFor: { "@id": organizationId } },
    { "@type": "WebSite", "@id": websiteId, name: site.name, url: site.url, inLanguage: "fa-IR", publisher: { "@id": organizationId } },
    { "@type": "WebPage", "@id": `${url}#webpage`, url, name: title, description, inLanguage: "fa-IR", isPartOf: { "@id": websiteId }, about: { "@id": serviceId ? `${url}#service` : organizationId }, dateModified: pageUpdatedAt[path], primaryImageOfPage: { "@type": "ImageObject", url: new URL(site.socialImage, site.url).href, width: 1200, height: 630 } },
  ];
  const page = graph.find(node => node["@type"] === "WebPage")!;
  if (path === founder.path) {
    page["@type"] = "AboutPage";
    page.mainEntity = { "@id": founderId };
  }
  if (path === "/contact") {
    page["@type"] = "ContactPage";
  }
  if (path === "/services") {
    page["@type"] = "CollectionPage";
    page.mainEntity = { "@id": `${url}#services` };
    graph.push({ "@type": "ItemList", "@id": `${url}#services`, name: "خدمات دکتر رسون", numberOfItems: services.length, itemListElement: services.map((service, index) => ({ "@type": "ListItem", position: index + 1, name: service.name, url: `${site.url}/services/${service.id}` })) });
  }
  if (serviceId) {
    page.mainEntity = { "@id": `${url}#service` };
    graph.push({ "@type": "Service", "@id": `${url}#service`, name: title, description, url, provider: { "@id": organizationId }, serviceType: services.find(service => service.id === serviceId)?.name });
  }
  if (path !== "/") {
    page.breadcrumb = { "@id": `${url}#breadcrumb` };
    graph.push({ "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [
      { "@type": "ListItem", position: 1, name: "خانه", item: `${site.url}/` },
      ...(serviceId ? [{ "@type": "ListItem", position: 2, name: "خدمات دکتر رسون", item: `${site.url}/services` }] : []),
      { "@type": "ListItem", position: serviceId ? 3 : 2, name: title, item: url },
    ] });
  }
  if (questions.length) {
    page.hasPart = { "@id": `${url}#faq` };
    graph.push({ "@type": "FAQPage", "@id": `${url}#faq`, isPartOf: { "@id": `${url}#webpage` }, inLanguage: "fa-IR", mainEntity: questions.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

export function serializeSchema(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
