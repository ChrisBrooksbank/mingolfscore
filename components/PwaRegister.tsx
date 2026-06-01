"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

export function PwaRegister() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") return;

    navigator.serviceWorker.register("/sw.js").then((registration) => {
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            setWaitingWorker(worker);
          }
        });
      });
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
  }, []);

  if (!waitingWorker) return null;

  return (
    <button
      className="button primary"
      style={{ position: "fixed", right: 16, top: 76, zIndex: 30 }}
      onClick={() => waitingWorker.postMessage({ type: "SKIP_WAITING" })}
    >
      <RefreshCw size={17} /> Update ready
    </button>
  );
}
