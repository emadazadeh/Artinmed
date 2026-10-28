import { contactChannels } from "@/lib/brand";
import { Icon } from "./icons";

export default function ContactChannels({ variant = "cards", includePhone = true }: {
  variant?: "cards" | "compact";
  includePhone?: boolean;
}) {
  const compact = variant === "compact";
  return <nav className={`contact-channels contact-channels--${variant}`} aria-label="راه‌های ارتباط با دکتر رسون">
    {contactChannels.filter(channel => includePhone || channel.id !== "phone").map(channel => <a
      key={channel.id}
      className={`contact-channel contact-channel--${channel.id}`}
      href={channel.href}
      target={channel.external ? "_blank" : undefined}
      rel={channel.external ? "noopener noreferrer" : undefined}
      aria-label={`${channel.action}، ${channel.handle}${channel.external ? "؛ باز شدن در پنجرهٔ جدید" : ""}`}
    >
      <span className="contact-channel-icon"><Icon name={channel.icon} size={compact ? 20 : 28} /></span>
      {compact ? <span>{channel.label}</span> : <>
        <h3>{channel.label}</h3>
        <bdi className="contact-channel-handle" dir="ltr">{channel.handle}</bdi>
        <p>{channel.description}</p>
        <span className="contact-channel-action">{channel.action}<Icon name="arrow" size={18} /></span>
      </>}
    </a>)}
  </nav>;
}
