"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function ProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const prevPathRef = useRef(`${pathname}?${searchParams.toString()}`);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearAllTimers = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const finish = () => {
    clearAllTimers();
    setProgress(100);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 250);
  };

  const start = () => {
    clearAllTimers();
    setVisible(true);
    setProgress(20);

    // Smooth incremental crawl
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 85;
        }
        if (prev < 45) return prev + 15;
        if (prev < 70) return prev + 8;
        return prev + 3;
      });
    }, 150);

    // Absolute fallback safety timeout (never stay stuck)
    timerRef.current = setTimeout(() => {
      finish();
    }, 3500);
  };

  // Complete progress on route change
  useEffect(() => {
    const currentPath = `${pathname}?${searchParams.toString()}`;
    if (prevPathRef.current !== currentPath) {
      prevPathRef.current = currentPath;
      if (visible) {
        finish();
      }
    }
  }, [pathname, searchParams, visible]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore hash links, blank targets, downloads, or modifier keys
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

        if (
          url.origin === currentUrl.origin &&
          (url.pathname !== currentUrl.pathname || url.search !== currentUrl.search)
        ) {
          start();
        }
      } catch {
        // ignore invalid urls
      }
    };

    const handlePopState = () => {
      // Browser back/forward navigation - trigger quick complete animation
      clearAllTimers();
      setVisible(true);
      setProgress(60);
      setTimeout(() => {
        finish();
      }, 120);
    };

    document.addEventListener("click", handleClick, { capture: true });
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
      clearAllTimers();
    };
  }, []);

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
