import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../hooks/useSidebar";

export default function HomeLayout() {
  const { open, openSidebar, closeSidebar } = useSidebar();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar onMenuClick={openSidebar} />

      <Sidebar open={open} onClose={closeSidebar} />

      <main className="mx-auto max-w-6xl px-4 py-6 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
