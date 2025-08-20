"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/Button/Button";
const Modal = dynamic(() => import("@/components/Modal/Modal"), { ssr: false });
import { isWithinRadius } from "@/lib/geo";

const Map = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 rounded-md" />,
});

export default function ExploreClient() {
  const searchParams = useSearchParams();

  const [stepState, setStepState] = useState(1);
  useEffect(() => {
    const sp = Number(searchParams.get("step")) || 1;
    setStepState(sp);
  }, [searchParams]);

  const currentStep = stepState;
  const totalSteps = 4;
  const nextStep = Math.min(totalSteps, currentStep + 1);
  const nextHref = `/explore?step=${nextStep}`;

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

  const target = targets[currentStep - 1] || targets[0];

  const [userPos, setUserPos] = useState(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const watchIdRef = useRef(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("completedSteps");
      if (stored) setCompletedSteps(JSON.parse(stored));
    } catch (e) {
      console.warn("Kunde inte läsa completedSteps från localStorage", e);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
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

  const taskDone = completedSteps.includes(currentStep);

  const markStepDone = () => {
    if (!within || taskDone) return;
    const newCompleted = [...completedSteps, currentStep];
    setCompletedSteps(newCompleted);
    try {
      localStorage.setItem("completedSteps", JSON.stringify(newCompleted));
    } catch (e) {
      console.warn("Kunde inte spara completedSteps", e);
    }
    setTaskOpen(false);
    window.location.href = nextHref;
  };

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

    const opts = {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000,
    };

    const onSuccess = (pos) => {
      setUserPos([pos.coords.latitude, pos.coords.longitude]);
      setLocationModalOpen(false);
    };

    const onError = (err) => {
      if (err.code === 1) {
        alert(
          "Platsåtkomst nekades. Tillåt plats i webbläsarens inställningar."
        );
      } else if (err.code === 2) {
        alert("Kunde inte hämta positionen. Kontrollera platstjänster/GPS.");
      } else {
        alert("Tidsgräns uppnådd. Försök igen.");
      }
      console.error("Geolocation error:", err);
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, opts);

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.error("watchPosition error:", err),
      opts
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
            "Plats är blockerad i webbläsaren. Tillåt plats för denna webbplats och försök igen."
          );
          return;
        }
      }
    } catch (_) {}
    startGeolocation();
  };

  const within = userPos
    ? isWithinRadius(userPos, target.center, target.radius)
    : false;

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
            href={taskDone ? nextHref : undefined}
            onClick={!taskDone ? () => setTaskOpen(true) : undefined}
            variant="primary"
            disabled={!within && !taskDone}
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
                <Button onClick={markStepDone} disabled={!within || taskDone}>
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
