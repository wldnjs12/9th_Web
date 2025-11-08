import { useNavigate } from "react-router-dom";

export default function FloatingButton() {
  const nav = useNavigate();

  return (
    <button
      onClick={() => nav("/create")}
      className="fixed bottom-6 right-6 bg-pink-600 hover:bg-pink-500 text-white text-3xl rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
    >
      +
    </button>
  );
}
