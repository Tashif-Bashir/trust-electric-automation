"use client";

import { useState, useCallback } from "react";

interface UseLeadFormReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

/** Manages the lead capture modal state. Share across Navigation, Hero, Calculator. */
export function useLeadForm(): UseLeadFormReturn {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, open, close };
}
