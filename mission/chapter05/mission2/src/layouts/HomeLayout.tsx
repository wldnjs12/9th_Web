import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function HomeLayout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="min-h-[calc(100vh-3.5rem)]">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-zinc-800 py-6 text-center text-sm text-zinc-400">
        푸터
      </footer>
    </div>
  );
}
