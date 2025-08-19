"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({ open, onClose, children }) {
  const firstFocusRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", onKey);

    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      setTimeout(() => firstFocusRef.current?.focus(), 0);
      return () => {
        document.body.style.overflow = prev;
        document.removeEventListener("keydown", onKey);
      };
    }
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (typeof window === "undefined") return null;
  if (!open) {
    return null;
  }

  return createPortal(
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[1000] bg-black/40"
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Dialog"
        className="fixed inset-0 z-[1001] grid place-items-center pointer-events-none"
      >
        <div className="relative pointer-events-auto w-full max-w-md mx-4 rounded-2xl bg-white shadow-xl p-6">
          <button
            ref={firstFocusRef}
            onClick={onClose}
            aria-label="Stäng"
            className="absolute left-3 top-3 text-slate-700"
            style={{ lineHeight: 0 }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M15 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="pt-6 max-h-[70vh] overflow-y-auto">{children}</div>
        </div>
      </div>
    </>,
    document.body
  );
}
