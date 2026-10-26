import type { Metadata } from "next";
import ClinicHome from "@/components/clinic-home";
import { pageMetadata, site } from "@/lib/site";

export const metadata: Metadata = { ...pageMetadata(site.title, site.description, "/"), title: { absolute: site.title } };

export default function Home() { return <ClinicHome />; }
