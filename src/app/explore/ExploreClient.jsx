"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/Button/Button";
import { isWithinRadius } from "@/lib/geo";
import { useSessionProgress } from "@/lib/useSessionProgress";

const Modal = dynamic(() => import("@/components/Modal/Modal"), { ssr: false });

const Map = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 rounded-md" />,
});

export default function ExploreClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");

  const { step: currentStep, updateStep } = useSessionProgress(sessionId);
  const totalSteps = 4;

  const targets = useMemo(
    () => [
      { name: "Lärdomsgatan", center: [57.706028, 11.936274], radius: 30 },
      {
        name: "Lindholmen Science Park",
        center: [57.7069, 11.9369],
        radius: 30,
      },
      { name: "Campus", center: [57.7075, 11.938], radius: 30 },
      { name: "Kajen", center: [57.7078, 11.9345], radius: 30 },
    ],
    []
  );

  const target = targets[(currentStep ?? 1) - 1] || targets[0];
  const nextStep = Math.min(totalSteps, (currentStep ?? 1) + 1);

  const [userPos, setUserPos] = useState(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const watchIdRef = useRef(null);
  const watchRetryRef = useRef({ tries: 0, id: null });
  const [hydrated, setHydrated] = useState(false);

  const GEO_OPTS_FAST = {
    enableHighAccuracy: true,
    maximumAge: 15000,
    timeout: 15000,
  };
  const GEO_OPTS_WATCH = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 30000,
  };

  function clearWatch() {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }

  function startWatch() {
    clearWatch();
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        watchRetryRef.current.tries = 0;
      },
      (err) => {
        console.warn("watchPosition error:", err);
        if (err.code === 3) {
          clearWatch();
          const tries = ++watchRetryRef.current.tries;
          const delay = Math.min(5000, 1000 * Math.pow(1.5, tries));
          watchRetryRef.current.id = setTimeout(() => startWatch(), delay);
        } else if (err.code === 1) {
          setLocationModalOpen(true);
        } else {
          clearWatch();
          setTimeout(() => startWatch(), 3000);
        }
      },
      GEO_OPTS_WATCH
    );
  }

  const startGeolocation = () => {
    if (typeof window === "undefined") return;
    if (!("geolocation" in navigator)) {
      alert("Din webbläsare stöder inte plats.");
      return;
    }
    if (!window.isSecureContext) {
      alert("Plats kräver säker anslutning (https eller localhost).");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        setLocationModalOpen(false);
        startWatch();
      },
      (err) => {
        console.warn("getCurrentPosition error:", err);
        if (err.code === 1) setLocationModalOpen(true);
        startWatch();
      },
      GEO_OPTS_FAST
    );
  };

  const askLocation = async () => {
    try {
      if ("permissions" in navigator) {
        const status = await navigator.permissions.query({
          name: "geolocation",
        });
        if (status && status.state === "denied") {
          alert(
            "Plats är blockerad i webbläsaren. Tillåt plats och försök igen."
          );
          return;
        }
      }
    } catch (_) {}
    startGeolocation();
  };

  useEffect(() => {
    setHydrated(true);
    return () => {
      clearWatch();
      if (watchRetryRef.current.id) {
        clearTimeout(watchRetryRef.current.id);
        watchRetryRef.current.id = null;
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!hydrated) return;
    (async () => {
      try {
        if (!("permissions" in navigator)) {
          if (!cancelled) setLocationModalOpen(true);
          return;
        }
        const status = await navigator.permissions.query({
          name: "geolocation",
        });
        if (cancelled) return;
        if (status && status.state === "granted") {
          startGeolocation();
          setLocationModalOpen(false);
        } else {
          setLocationModalOpen(true);
        }
      } catch (_) {
        if (!cancelled) setLocationModalOpen(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrated]);

  const within = userPos
    ? isWithinRadius(userPos, target.center, target.radius)
    : false;

  const markStepDone = async () => {
    if (!within || !sessionId) return;
    setTaskOpen(false);
    await updateStep(nextStep);
  };

  return (
    <section className="w-full p-0">
      <div
        className="relative w-full p-0 mt-[72px]"
        style={{ height: "calc(100vh - 72px)" }}
      >
        <Map
          className="w-full h-full"
          zoom={16}
          minZoom={16}
          restrictPanning
          restrictToInitialView
          markerPosition={target.center}
          circleRadiusMeters={target.radius}
          markerPopup={target.name}
        />
      </div>

      <div className="fixed bottom-4 left-0 right-0 z-[1100] flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <Button
            onClick={() => setTaskOpen(true)}
            variant="primary"
            disabled={!within}
          >
            Unlock
          </Button>
        </div>
      </div>

      {hydrated && (
        <>
          <Modal
            open={locationModalOpen}
            onClose={() => setLocationModalOpen(false)}
          >
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Vi behöver din plats</h2>
              <p className="text-sm text-gray-700">
                För att låsa upp spelet behöver vi veta din position.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setLocationModalOpen(false)}
                >
                  Stäng
                </Button>
                <Button variant="primary" onClick={askLocation}>
                  Tillåt plats
                </Button>
              </div>
            </div>
          </Modal>

          <Modal open={taskOpen} onClose={() => setTaskOpen(false)}>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Task at {target.name}</h2>
              <p className="text-sm text-gray-700">Task här!</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setTaskOpen(false)}>
                  Stäng
                </Button>
                <Button onClick={markStepDone} disabled={!within}>
                  Mark as done
                </Button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </section>
  );
}
