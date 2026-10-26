import { serializeSchema } from "@/lib/site";

export default function StructuredData({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(data) }} />;
}
