import { User } from "lucide-react";

export default function Topbar({ title }) {
  return (
    <header className="bg-white h-20 rounded-[2rem] flex items-center justify-between px-8 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      
      <button className="h-11 w-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
        <User size={20} strokeWidth={2} />
      </button>
    </header>
  );
}
