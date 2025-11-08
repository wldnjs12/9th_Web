import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function HomeLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* ✅ Navbar에 onMenuClick 전달 */}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      {/* ✅ Sidebar 토글 */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="mx-auto max-w-6xl px-4 py-6 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
