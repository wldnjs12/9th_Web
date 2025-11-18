import { useCallback, useEffect, useState } from "react";

export function useSidebar() {
  const [open, setOpen] = useState(false);

  const openSidebar = useCallback(() => setOpen(true), []);
  const closeSidebar = useCallback(() => setOpen(false), []);
  const toggleSidebar = useCallback(() => setOpen(prev => !prev), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        console.log("KEY PRESSED =>", e.key);
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return {
    open,
    openSidebar,
    closeSidebar,
    toggleSidebar,
  };
}
