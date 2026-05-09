// Example in Navbar.jsx
import { Menu } from "lucide-react";
import { useState } from "react";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="w-full bg-white flex items-center justify-between p-4 shadow">
        <button onClick={() => setOpen(!open)} className="md:hidden text-indigo-600">
          <Menu size={24} />
        </button>
        <h1 className="font-semibold text-indigo-600">Dashboard</h1>
      </div>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 md:hidden">
          <Sidebar />
        </div>
      )}
    </>
  );
}
