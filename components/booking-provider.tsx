"use client";

import { createContext, lazy, Suspense, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { ServiceId } from "@/lib/clinic-data";

const loadBooking = () => import("./booking-dialog");
const BookingDialog = lazy(loadBooking);
const preloadBooking = () => { void loadBooking().catch(() => {}); };
type ActiveDialog = { mode: "book"; service: ServiceId } | { mode: "track" } | null;
const BookingContext = createContext<{ openBooking: (service?: ServiceId) => void; showTracking: () => void } | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<ActiveDialog>(null);
  const openBooking = useCallback((service: ServiceId = "nutrition-fitness") => setDialog({ mode: "book", service }), []);
  const showTracking = useCallback(() => setDialog({ mode: "track" }), []);
  const close = useCallback(() => setDialog(null), []);
  const value = useMemo(() => ({ openBooking, showTracking }), [openBooking, showTracking]);
  return <BookingContext.Provider value={value}>
    {children}
    <Suspense fallback={<div className="modal-loading" role="status">در حال آماده‌سازی فرم…</div>}>
      {dialog && <BookingDialog key={dialog.mode} initialService={dialog.mode === "book" ? dialog.service : "nutrition-fitness"} trackingOnly={dialog.mode === "track"} onClose={close} />}
    </Suspense>
  </BookingContext.Provider>;
}

function useBooking() {
  const value = useContext(BookingContext);
  if (!value) throw new Error("Booking actions require BookingProvider.");
  return value;
}

export function BookingButton({ service, children, className = "button button-green", label }: { service?: ServiceId; children: ReactNode; className?: string; label?: string }) {
  const { openBooking } = useBooking();
  return <button type="button" className={className} aria-label={label} onPointerEnter={preloadBooking} onFocus={preloadBooking} onClick={() => openBooking(service)}>{children}</button>;
}

export function TrackingButton({ children, className = "", label }: { children: ReactNode; className?: string; label?: string }) {
  const { showTracking } = useBooking();
  return <button type="button" className={className} aria-label={label} onPointerEnter={preloadBooking} onFocus={preloadBooking} onClick={showTracking}>{children}</button>;
}
