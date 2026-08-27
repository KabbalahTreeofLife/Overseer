"use client";

import { useEffect, useState } from "react";

export function Logo({ className }: { className?: string }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <img
      src={dark ? "/overseer-logo-light.svg" : "/overseer-logo.svg"}
      alt="Overseer"
      className={className}
    />
  );
}
