"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { Icon } from "./icons";
export default function Modal({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    const focused = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog?.showModal(); document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = overflow; focused?.focus(); };
  }, []);
  return <dialog ref={ref} className={`modal ${wide ? "modal-wide" : ""}`} aria-labelledby={titleId} onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}><div className="modal-inner"><header className="modal-header"><div><span className="eyebrow small">ARTINMED EXPERIENCE</span><h2 id={titleId}>{title}</h2></div><button className="icon-button" aria-label="بستن پنجره" onClick={onClose}><Icon name="close" /></button></header>{children}</div></dialog>;
}
