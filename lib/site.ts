import type { Metadata } from "next";
import { services } from "./clinic-data.ts";

// Confirmed public origin. Update this single value when moving to a custom domain.
export const site = {
  name: "دکتر رسون",
  url: "https://doctor-resoon.cometolive34.chatgpt.site",
  title: "دکتر رسون | ویزیت آنلاین پزشک و خدمات پزشکی در منزل",
  description: "درخواست ویزیت آنلاین پزشک و هماهنگی خدمات پزشکی در منزل، واکسیناسیون و بوتاکس با حضور پزشک؛ هر خدمت پس از ارزیابی پزشکی و بررسی محدودهٔ شما.",
  socialImage: "/images/doctor-resoon-social.png",
} as const;

export const publicPaths = ["/", ...services.map(service => `/services/${service.id}`), "/privacy"];

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = new URL(path, site.url).href;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: path === "/" ? site.title : `${title} | ${site.name}`,
      description,
      url,
      siteName: site.name,
      locale: "fa_IR",
      type: "website",
      images: [{ url: site.socialImage, width: 1200, height: 630, alt: "دکتر رسون؛ ویزیت آنلاین پزشک و مراقبت در منزل" }],
    },
    twitter: {
      card: "summary_large_image",
      title: path === "/" ? site.title : `${title} | ${site.name}`,
      description,
      images: [site.socialImage],
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
  const graph: Record<string, unknown>[] = [
    { "@type": "Organization", "@id": organizationId, name: site.name, alternateName: "Doctor Resoon", url: site.url },
    { "@type": "WebSite", "@id": websiteId, name: site.name, url: site.url, inLanguage: "fa-IR", publisher: { "@id": organizationId } },
    { "@type": "WebPage", "@id": `${url}#webpage`, url, name: title, description, inLanguage: "fa-IR", isPartOf: { "@id": websiteId }, about: { "@id": serviceId ? `${url}#service` : organizationId } },
  ];
  if (serviceId) {
    graph.push({ "@type": "Service", "@id": `${url}#service`, name: title, description, url, provider: { "@id": organizationId }, serviceType: services.find(service => service.id === serviceId)?.name });
    graph.push({ "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "خانه", item: `${site.url}/` },
      { "@type": "ListItem", position: 2, name: title, item: url },
    ] });
  }
  if (questions.length) graph.push({ "@type": "FAQPage", "@id": `${url}#faq`, inLanguage: "fa-IR", mainEntity: questions.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) });
  return { "@context": "https://schema.org", "@graph": graph };
}

export function serializeSchema(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
