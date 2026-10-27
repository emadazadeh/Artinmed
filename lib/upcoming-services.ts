// Owner-confirmed upcoming services; these IDs are not accepted by booking.
export const upcomingServices = [
  { id: "laboratory", name: "آزمایش خون و نمونه‌گیری در منزل", icon: "drop", description: "نمونه‌گیری در منزل شما و هماهنگی آزمایش‌های موردنیاز؛ جزئیات و شرایط ارائه هنگام آغاز این مسیر اعلام می‌شود." },
  { id: "aesthetic-expansion", name: "خدمات زیبایی در منزل", icon: "face", description: "مزوتراپی، بوتاکس و پی‌آرپی (PRP) در منزل شما؛ این مسیر در برنامهٔ توسعه است و فعلاً امکان ثبت درخواست ندارد." },
] as const;
