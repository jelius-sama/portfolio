"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    // Send analytics data to the server
    fetch(`/api/analytics?page=${encodeURIComponent(pathname)}`, {
      method: "GET",
      keepalive: true, // Ensures request completes even if user navigates away
    }).catch((err) => console.error("Analytics error:", err));
  }, [pathname]);

  return null;
}
