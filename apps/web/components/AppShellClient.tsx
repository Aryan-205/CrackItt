"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { AppRightPanel } from "./AppRightPanel";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import type { DashboardFeedItem, Streak, User } from "@repo/types";
import { usePathname } from "next/navigation";

interface AppShellClientProps {
  children: React.ReactNode;
  user: User;
  streak: Streak;
  feed: DashboardFeedItem[];
}

export function AppShellClient({
  children,
  user,
  streak,
  feed,
}: AppShellClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const showRightPanel = pathname === "/dashboard" || pathname.startsWith("/learn/");

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar (Left) */}
      <div className="hidden lg:block border-r border-border bg-sidebar w-56 shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Sliding drawer panel */}
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-sidebar border-r border-border animate-in slide-in-from-left duration-300">
            <div className="absolute right-4 top-4 z-10">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
                className="active:scale-95 transition-transform"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <Sidebar onNavClick={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Content wrapper */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
          {/* Desktop Right Sidebar Panel (profile, streak widget, and content feed) */}
          {showRightPanel && (
            <div className="hidden xl:block w-84 shrink-0 border-l border-border bg-card">
              <AppRightPanel user={user} streak={streak} feed={feed} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
