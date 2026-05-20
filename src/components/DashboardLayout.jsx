import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children, title }) {
  return (
    <div className="min-h-screen flex bg-background p-4 pr-6 gap-6 font-sans">
      <Sidebar />
      
      <main className="flex-1 flex flex-col pt-4 max-h-[calc(100vh-2rem)]">
        <Topbar title={title} />
        
        <div className="mt-6 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
