"use client";

import React, { useState } from "react";
import { BookOpen, X } from "lucide-react";
import { Button } from "./ui/button";
import { LearnSidebar } from "./LearnSidebar";

export function MobileLearnNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button (FAB) on mobile */}
      <div className="fixed bottom-6 right-6 z-40 xl:hidden">
        <Button
          onClick={() => setOpen(true)}
          className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg active:scale-90 hover:scale-105 transition-transform duration-200 flex items-center justify-center border border-primary/20 hover:bg-primary/95"
          aria-label="Course outline"
        >
          <BookOpen className="h-5 w-5" />
        </Button>
      </div>

      {/* Drawer Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end xl:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            onClick={() => setOpen(false)}
          />
          {/* Drawer content */}
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-card border-l border-border animate-in slide-in-from-right duration-350">
            <div className="absolute right-4 top-4 z-10">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setOpen(false)}
                aria-label="Close outline"
                className="active:scale-95 transition-transform"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="h-full overflow-y-auto" onClick={() => setOpen(false)}>
              <LearnSidebar />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
