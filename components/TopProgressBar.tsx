"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function ProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  // Complete progress on route change
  useEffect(() => {
    if (visible) {
      setProgress(100);
      const timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const handleStart = () => {
      setVisible(true);
      setProgress(15);

      // Smooth increment simulating YouTube loading bar
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          if (prev < 40) return prev + Math.random() * 15 + 10;
          if (prev < 70) return prev + Math.random() * 8 + 5;
          return prev + Math.random() * 3 + 1;
        });
      }, 150);
    };

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore anchor jumps, new tabs, downloads, external links
      if (
        href.startsWith("#") ||
        target.target === "_blank" ||
        target.hasAttribute("download") ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      try {
        const url = new URL(href, window.location.href);
        const currentUrl = new URL(window.location.href);

        // Only trigger for same-origin navigation that changes route
        if (
          url.origin === currentUrl.origin &&
          (url.pathname !== currentUrl.pathname || url.search !== currentUrl.search)
        ) {
          handleStart();
        }
      } catch {
        // Invalid URL, ignore
      }
    };

    // Listen to popstate (back/forward navigation)
    const handlePopState = () => {
      handleStart();
    };

    document.addEventListener("click", handleClick, { capture: true });
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
      if (interval) clearInterval(interval);
    };
  }, [visible]);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[99999] pointer-events-none transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div
        className="h-full bg-[#F25922] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  );
}

export default function TopProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBarInner />
    </Suspense>
  );
}
