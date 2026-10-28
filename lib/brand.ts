// Business details supplied by the Site owner. Do not infer coverage or credentials.
export const contact = {
  phone: "+989350631134",
  phoneLabel: "۰۹۳۵۰۶۳۱۱۳۴",
  href: "tel:+989350631134",
} as const;

export const socialProfiles = {
  telegram: { handle: "@doctorreson", href: "https://t.me/doctorreson" },
  instagram: { handle: "@doctorreson.ir", href: "https://www.instagram.com/doctorreson.ir/" },
} as const;

export const contactChannels = [
  { id: "telegram", label: "تلگرام", handle: socialProfiles.telegram.handle, href: socialProfiles.telegram.href, icon: "telegram", description: "برای پرسش دربارهٔ خدمات و هماهنگی در تلگرام پیام بدهید.", action: "ارتباط در تلگرام", external: true },
  { id: "whatsapp", label: "واتساپ", handle: contact.phoneLabel, href: `https://wa.me/${contact.phone.replace(/\D/g, "")}`, icon: "whatsapp", description: "گفت‌وگو با دکتر رسون را در واتساپ خودتان باز کنید.", action: "پیام در واتساپ", external: true },
  { id: "phone", label: "تماس تلفنی", handle: contact.phoneLabel, href: contact.href, icon: "phone", description: "برای پرسش دربارهٔ شرایط و هماهنگی خدمت تماس بگیرید.", action: "تماس با دکتر رسون", external: false },
  { id: "instagram", label: "اینستاگرام", handle: socialProfiles.instagram.handle, href: socialProfiles.instagram.href, icon: "instagram", description: "صفحهٔ دکتر رسون را ببینید و از طریق دایرکت در ارتباط باشید.", action: "مشاهدهٔ اینستاگرام", external: true },
] as const;

export const founder = {
  name: "دکتر عماد آزاده",
  role: "مدیر و مؤسس دکتر رسون",
  path: "/about",
  portrait: "/images/emad-azadeh-care-768.webp",
  portraitSrcSet: "/images/emad-azadeh-care-480.webp 480w, /images/emad-azadeh-care-768.webp 768w, /images/emad-azadeh-care-1024.webp 1024w",
  portraitCaption: "پرترهٔ ویرایش‌شده با هوش مصنوعی بر پایهٔ عکس دکتر عماد آزاده.",
} as const;
