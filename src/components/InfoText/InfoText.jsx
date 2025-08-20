"use client";

import ClockIcon from "@/assets/icons/clock.svg";
import WalkingManIcon from "@/assets/icons/walking_man.svg";
import PinLocationIcon from "@/assets/icons/pinlocation.svg";

export default function InfoText() {
  return (
    <article className="flex justify-center items-center mt-18">
      <div className="w-80 inline-flex flex-col justify-center items-center gap-5">
        <div className="inline-flex justify-center items-center">
          <h2 className="text-center justify-start text-Dark-blue text-2xl font-normal leading-loose">
            Perfect for lunch breaks
          </h2>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-3.5">
          <div className="self-stretch inline-flex justify-start items-center gap-5">
            <ClockIcon />
            <div className="w-64 inline-flex flex-col justify-start items-start">
              <p className="self-stretch justify-start text-Dark-blue text-lg font-normal leading-7">
                Daily Exercise
              </p>
              <p className="self-stretch text-center justify-start text-Dark-blue text-base font-normal leading-normal">
                Get your steps in but make it fun!
              </p>
            </div>
          </div>
          <div className="self-stretch inline-flex justify-start items-center gap-5">
            <PinLocationIcon />
            <div className="w-64 inline-flex flex-col justify-start items-start">
              <p className="self-stretch justify-start text-Dark-blue text-lg font-normal leading-7">
                Explore Lindholmen
              </p>
              <p className="self-stretch justify-start text-Dark-blue text-base font-normal leading-normal">
                Discover hidden gems right outside your door
              </p>
            </div>
          </div>
          <div className="self-stretch inline-flex justify-start items-center gap-5">
            <WalkingManIcon />
            <div className="w-64 inline-flex flex-col justify-start items-start">
              <p className="self-stretch justify-start text-Dark-blue text-lg font-normal leading-7">
                Team Building
              </p>
              <p className="self-stretch justify-start text-Dark-blue text-base font-normal leading-normal">
                Connect with your friends, colleagues and classmates{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
