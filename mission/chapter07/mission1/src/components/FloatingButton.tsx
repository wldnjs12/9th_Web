import { useState } from "react";
import LPCreateModal from "./LPCreateModal";

export default function FloatingButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-pink-600 hover:bg-pink-500 text-white text-3xl rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
      >
        +
      </button>
      {open && <LPCreateModal onClose={() => setOpen(false)} />}
    </>
  );
}
