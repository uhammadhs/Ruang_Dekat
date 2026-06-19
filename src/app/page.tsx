import { BottomNav } from "@/components/bottom-nav";
import { DesktopSidebar } from "@/components/desktop-sidebar";
import { HomeShell } from "@/components/home-shell";
import { RightPanel } from "@/components/right-panel";
import { TopBar } from "@/components/top-bar";

export default function HomePage() {
  return (
    <>
      <TopBar />
      <div className="mx-auto flex max-w-7xl gap-5 px-4 py-5 lg:px-6">
        <DesktopSidebar />
        <HomeShell />
        <RightPanel />
      </div>
      <BottomNav />
    </>
  );
}
