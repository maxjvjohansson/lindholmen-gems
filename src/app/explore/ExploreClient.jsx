"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/Button/Button";
import { isWithinRadius } from "@/lib/geo";
import { useSessionProgress } from "@/lib/useSessionProgress";

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
  const [contentState, setContentState] = useState("locked"); // "locked" or "unlocked"
  const watchIdRef = useRef(null);
  const watchRetryRef = useRef({ tries: 0, id: null });
  const [hydrated, setHydrated] = useState(false);
  const [locationInitialized, setLocationInitialized] = useState(false);

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

  const clearWatch = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const startWatch = () => {
    clearWatch();
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        setLocationInitialized(true);
        watchRetryRef.current.tries = 0;
      },
      (err) => {
        console.warn("watchPosition error:", err);
        setLocationInitialized(true);
        if (err.code === 3) {
          clearWatch();
          const tries = ++watchRetryRef.current.tries;
          const delay = Math.min(5000, 1000 * Math.pow(1.5, tries));
          watchRetryRef.current.id = setTimeout(startWatch, delay);
        } else if (err.code === 1) {
          setLocationModalOpen(true);
        } else {
          clearWatch();
          setTimeout(startWatch, 3000);
        }
      },
      GEO_OPTS_WATCH
    );
  };

  const startGeolocation = () => {
    if (typeof window === "undefined") return;
    if (!("geolocation" in navigator)) {
      alert("Din webbläsare stöder inte plats.");
      setLocationInitialized(true);
      return;
    }
    if (!window.isSecureContext) {
      alert("Plats kräver säker anslutning (https eller localhost).");
      setLocationInitialized(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        setLocationModalOpen(false);
        setLocationInitialized(true);
        startWatch();
      },
      (err) => {
        console.warn("getCurrentPosition error:", err);
        setLocationInitialized(true);
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

    localStorage.setItem("locationAllowed", "true");
    startGeolocation();
  };

  useEffect(() => {
    setHydrated(true);
    const allowed = localStorage.getItem("locationAllowed") === "true";
    if (allowed) {
      startGeolocation();
    } else {
      setLocationInitialized(true);
    }

    return () => {
      clearWatch();
      if (watchRetryRef.current.id) {
        clearTimeout(watchRetryRef.current.id);
        watchRetryRef.current.id = null;
      }
    };
  }, []);

  const within = userPos
    ? isWithinRadius(userPos, target.center, target.radius)
    : false;

  const unlockContent = () => setContentState("unlocked");

  const markStepDone = async () => {
    if (!within || !sessionId) return;
    setContentState("locked");
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

      {/* Unlock Button - only visible when locked and within radius */}
      {hydrated &&
        locationInitialized &&
        contentState === "locked" &&
        within && (
          <div className="fixed inset-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1100] pointer-events-auto">
            <button
              onClick={unlockContent}
              className="w-60 h-20 px-10 py-6 bg-zinc-300 inline-flex justify-center items-center gap-2.5 hover:bg-zinc-400 transition-colors"
            >
              <div className="justify-start text-gray-800 text-xl font-semibold font-['Inter']">
                Unlock the location
              </div>
            </button>
          </div>
        )}

      {/* Always-visible modal at the bottom */}
      {hydrated && locationInitialized && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto z-[1000] ">
          {contentState === "locked" ? (
            within ? (
              <div className="w-96 h-56 relative rounded-md shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] bg-gradient-to-b from-orange-50 to-orange-100 p-4">
                <div className="text-Dark-blue text-sm font-medium mb-2">
                  You have arrived
                </div>
                <div className="text-Dark-blue text-sm font-normal">
                  Unlock the location
                </div>
              </div>
            ) : (
              <div className="w-96 h-56 relative opacity-95 rounded-md shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] bg-gradient-to-b from-orange-50 to-orange-100 p-4">
                <div className="text-Dark-blue text-sm font-medium mb-2">
                  Walk to the marked location
                </div>
                <div className="text-Dark-blue text-sm font-normal">
                  Follow the path to reach your first location.
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-Dark-blue text-sm font-medium">
                    Distance remaining
                  </div>
                  <div className="text-amber-600 text-lg font-bold">115m</div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="text-Dark-blue text-sm font-normal">
                    Estimated time 2 minutes
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="w-96 h-auto relative opacity-95 rounded-2xl shadow-xl bg-white p-6">
              <h2 className="text-lg font-semibold mb-2">
                Task at {target.name}
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                Here is the content of your task. Mark it as done when finished.
              </p>
              <div className="flex justify-end">
                <Button onClick={markStepDone} disabled={!within}>
                  Mark as done
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
