"use client";

import NumberOne from "@/assets/icons/1.svg";
import NumberTwo from "@/assets/icons/2.svg";
import NumberThree from "@/assets/icons/3.svg";
import NumberFour from "@/assets/icons/4.svg";

export default function Instructions() {
  return (
    <article className="flex justify-center items-center mt-18">
      <div className="w-72 inline-flex flex-col justify-start items-center gap-5">
        <div className="inline-flex justify-center items-center">
          <h2 className="text-center justify-start text-Dark-blue text-2xl font-normal font-['Quicksand'] leading-loose">
            How it works
          </h2>
        </div>
        <div className="w-72 h-96 flex flex-col justify-between items-start">
          <div className="self-stretch inline-flex justify-between items-start">
            <NumberOne />
            <p className="w-60 justify-start text-Dark-blue text-base font-normal font-['Quicksand'] leading-normal">
              Start a new walk or Join a walk with a unique code
            </p>
          </div>
          <div className="self-stretch inline-flex justify-between items-start">
            <NumberTwo />
            <p className="w-60 justify-start text-Dark-blue text-base font-normal font-['Quicksand'] leading-normal">
              Set up your perfect walk by choosing Duration, number of Players
              and how many stops you want to explore. Or just let your friend do
              it and tag along!{" "}
            </p>
          </div>
          <div className="self-stretch inline-flex justify-between items-start">
            <NumberThree />
            <p className="w-60 justify-start text-Dark-blue text-base font-normal font-['Quicksand'] leading-normal">
              Accept the route and start walking!
            </p>
          </div>
          <div className="self-stretch inline-flex justify-between items-start">
            <NumberFour />
            <p className="w-60 justify-start text-Dark-blue text-base font-normal font-['Quicksand'] leading-normal">
              Do fun quests at every stop, unlock more locations and collect
              Puzzle Pieces to discover more of Lindholmen.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
