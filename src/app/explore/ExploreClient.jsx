"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button/Button";
import { useSessionProgress } from "@/lib/useSessionProgress";
import DistanceIcon from "@/assets/icons/distance.svg";
import { CONTENTS } from "@/lib/taskContents";
import QuestionIcon from "@/assets/icons/question_filled.svg";
import PuzzleIcon from "@/assets/icons/puzzle.svg";
import WalkingIcon from "@/assets/icons/walking_man.svg";

const Map = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 rounded-md" />,
});

function haversineDistance([lat1, lon1], [lat2, lon2]) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371e3;
  const φ1 = toRad(lat1),
    φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1),
    Δλ = toRad(lon2 - lon1);
  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function ExploreClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");

  const players = Number(searchParams.get("players")) || 1;

  const { step: currentStep, updateStep } = useSessionProgress(sessionId);
  const totalSteps = 4;

  const targets = useMemo(
    () => [
      { name: "Karlatornet", center: [57.709155, 11.940615], radius: 60 },
      {
        name: "Kuggen",
        center: [57.706805, 11.938837],
        radius: 40,
      },
      { name: "Lindholmspiren", center: [57.704546, 11.940976], radius: 40 },
      { name: "Backa Teater", center: [57.70513, 11.935599], radius: 40 },
    ],
    []
  );

  const idx = Math.max(0, Math.min((currentStep ?? 1) - 1, targets.length - 1));
  const target = targets[idx];
  const copy = CONTENTS[idx] || CONTENTS[0];
  const nextStep = Math.min(totalSteps, (currentStep ?? 1) + 1);

  const [userPos, setUserPos] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [congratsShown, setCongratsShown] = useState(false);

  const watchIdRef = useRef(null);

  const GEO_OPTS = {
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000,
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
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.warn("watchPosition error:", err),
      GEO_OPTS
    );
  }
  function startGeolocation() {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        startWatch();
      },
      () => startWatch(),
      GEO_OPTS
    );
  }

  useEffect(() => {
    setHydrated(true);
    startGeolocation();
    return () => clearWatch();
  }, []);

  useEffect(() => {
    setUnlocked(false);
    setCongratsShown(false);
  }, [idx]);

  const distance = userPos ? haversineDistance(userPos, target.center) : null;
  const within = distance !== null ? distance <= target.radius : false;

  const markStepDone = () => {
    if (!within || !sessionId) return;
    setUnlocked(false);
    setCongratsShown(true);
  };

  const goNextLocation = async () => {
    await updateStep(nextStep);
    setCongratsShown(false);
  };

  const returnToLobby = () => {
    router.push("/");
  };

  const TaskIcon = copy.task?.Icon || QuestionIcon;
  const CongratsIcon = copy.congrats?.Icon || PuzzleIcon;

  const FINAL_STATS = {
    players: players,
    km: 1.5,
    min: 30,
    pieces: totalSteps,
  };

  const isFinalStep = idx === totalSteps - 1;

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
          userPosition={userPos || undefined}
        />

        {within && !unlocked && !congratsShown && (
          <div className="absolute bottom-48 inset-0 flex items-center justify-center z-[1200]">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setUnlocked(true)}
            >
              {copy.overlay?.text || "Unlock the location"}
            </Button>
          </div>
        )}
      </div>

      <div className="fixed bottom-8 left-0 right-0 z-[1100] flex justify-center">
        <div className="w-[92%] max-w-xl rounded-2xl shadow-xl px-6 py-6 bg-gradient-to-b from-white to-orange-100">
          {congratsShown ? (
            isFinalStep ? (
              <div className="text-center">
                <h2 className="text-orange-400 text-2xl font-medium leading-loose">
                  Well done!
                </h2>
                <p className="text-lg text-gray-800 mb-6">
                  You completed the Lindholmen Walk!
                </p>

                <div className="flex justify-center gap-8 text-orange-400 text-2xl mb-6">
                  <span>{FINAL_STATS.players} players</span>
                  <span>{FINAL_STATS.km} km</span>
                  <span>{FINAL_STATS.min}min</span>
                </div>

                <div className="flex items-center justify-center gap-3 text-orange-400 font-medium mb-6">
                  <PuzzleIcon />
                  <span>{FINAL_STATS.pieces} collected puzzle pieces</span>
                </div>

                <div className="flex justify-center">
                  <Button onClick={returnToLobby}>Return to lobby</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center">
                    <CongratsIcon />
                  </div>
                  <h2 className="text-xl font-bold">
                    {copy.congrats?.title || "Congratulations!"}
                  </h2>
                </div>
                <p className="text-[15px] leading-6 text-gray-800 text-center px-1 mb-4">
                  {copy.congrats?.body}
                </p>
                <div className="flex justify-end">
                  <Button onClick={goNextLocation}>
                    {copy.congrats?.nextLabel || "Next location"}
                  </Button>
                </div>
              </>
            )
          ) : unlocked ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center">
                  <TaskIcon />
                </div>
                <h2 className="text-lg font-semibold">
                  {copy.task?.title || `Task at ${target.name}`}
                </h2>
              </div>
              <p className="text-[15px] leading-6 text-gray-800 mb-5">
                {copy.task?.body}
              </p>
              <div className="flex justify-end">
                <Button
                  onClick={markStepDone}
                  disabled={!within}
                  className="px-6"
                >
                  {copy.task?.doneLabel || "Done"}
                </Button>
              </div>
            </>
          ) : userPos ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center">
                  <WalkingIcon />
                </div>
                <h2 className="text-md font-semibold mb-1">
                  {copy.pre?.title || `Walk to ${target.name}`}
                </h2>
              </div>
              <p className="text-sm mb-4">{copy.pre?.body}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center gap-2">
                  <DistanceIcon />
                  {copy.pre?.distanceLabel || "Distance remaining"}
                </span>
                <span className="text-amber-600 font-bold">
                  {distance !== null ? `${Math.round(distance)}m` : "--"}
                </span>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">Waiting for location...</p>
          )}
        </div>
      </div>
    </section>
  );
}
