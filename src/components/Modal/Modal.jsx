"use client";

import { useEffect, useRef } from "react";

export default function Modal({ open, onClose, title, children }) {
  const dialogRef = useRef(null);
  const firstFocusRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", onKey);
    if (open) firstFocusRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="howitworks-title"
        ref={dialogRef}
        className={`fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md 
          rounded-t-2xl bg-white shadow-xl transition-transform duration-200
          ${open ? "translate-y-0" : "translate-y-full"}
        `}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-between px-5 pt-3 pb-2">
          <div className="mx-auto h-1.5 w-10 rounded-full bg-slate-200" />
        </div>

        <div className="px-5 pb-1">
          <h2
            id="howitworks-title"
            className="text-xl font-semibold text-slate-900 text-center"
          >
            {title}
          </h2>
        </div>

        <div className="px-5 pb-4">{children}</div>
      </div>
    </>
  );
}
