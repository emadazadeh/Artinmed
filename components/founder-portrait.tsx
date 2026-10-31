import { founder } from "@/lib/brand";

export default function FounderPortrait({ sizes, alt }: { sizes: string; alt: string }) {
  return <>
    <link rel="preload" as="image" type="image/avif" imageSrcSet={founder.portraitAvifSet} imageSizes={sizes} fetchPriority="high" />
    <picture className="founder-responsive-picture">
      <source type="image/avif" srcSet={founder.portraitAvifSet} sizes={sizes} />
      <img src={founder.portrait} srcSet={founder.portraitSrcSet} sizes={sizes} alt={alt} width="1024" height="1280" loading="eager" fetchPriority="high" decoding="async" />
    </picture>
  </>;
}
