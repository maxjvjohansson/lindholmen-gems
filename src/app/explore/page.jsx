"use client";

import dynamic from "next/dynamic";
import Button from "@/components/Button/Button";
import Modal from "@/components/Modal/Modal";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { isWithinRadius } from "@/lib/geo";

// Dynamically import to avoid SSR issues with Leaflet
const Map = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 rounded-md" />,
});

export default function ExplorePage() {
  // --- Client-only hooks ---
  const searchParams = useSearchParams();
  const currentStep = Number(searchParams.get("step")) || 1;
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
  const [taskOpen, setTaskOpen] = useState(false);

  // --- Completed steps state ---
  const [completedSteps, setCompletedSteps] = useState(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("completedSteps");
    return stored ? JSON.parse(stored) : [];
  });

  const taskDone = completedSteps.includes(currentStep);

  const within = userPos
    ? isWithinRadius(userPos, target.center, target.radius)
    : false;

  const markStepDone = () => {
    if (!within || taskDone) return;
    const newCompleted = [...completedSteps, currentStep];
    setCompletedSteps(newCompleted);
    localStorage.setItem("completedSteps", JSON.stringify(newCompleted));
    setTaskOpen(false);
    // Automatically go to next step
    window.location.href = nextHref;
  };

  // --- Geolocation ---
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

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

      <Modal open={taskOpen} onClose={() => setTaskOpen(false)}>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Task at {target.name}</h2>
          <p className="text-sm text-gray-700">
            Complete this task to unlock the next location.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setTaskOpen(false)}>
              Close
            </Button>
            <Button onClick={markStepDone} disabled={!within || taskDone}>
              Mark as done
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
