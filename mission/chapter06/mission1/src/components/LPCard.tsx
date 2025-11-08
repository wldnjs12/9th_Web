import { Link } from "react-router-dom";

export default function LPCard({ lp }: { lp: any }) {
  if (!lp) return null;

  return (
    <Link
      to={`/lps/${lp.id}`}
      className="relative group block bg-zinc-900 rounded-lg overflow-hidden hover:scale-105 transition-transform"
    >
      <img
        src={lp.thumbnail || "/placeholder.png"}
        alt={lp.title || "No Title"}
        className="w-full h-64 object-cover opacity-90 group-hover:opacity-100 transition"
      />

      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex flex-col justify-end p-3">
        <h3 className="text-lg font-semibold text-white truncate">
          {lp.title || "제목 없음"}
        </h3>
        <p className="text-sm text-zinc-300 truncate">
          {lp.author?.name || "작성자 없음"}
        </p>
      </div>
    </Link>
  );
}
