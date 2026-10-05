"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

export function PwaRegister() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") return;

    // Only reload when an existing worker is replaced. On a first visit clients.claim()
    // also fires controllerchange, and reloading then would wipe whatever the user was doing.
    const hadController = Boolean(navigator.serviceWorker.controller);
    let reloading = false;
    const onControllerChange = () => {
      if (!hadController || reloading) return;
      reloading = true;
      window.location.reload();
    };

    navigator.serviceWorker.register("/sw.js").then((registration) => {
      if (registration.waiting && navigator.serviceWorker.controller) {
        setWaitingWorker(registration.waiting);
      }
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

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    return () => navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
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
