"use client";

import Button from "../Button/Button";

export default function CTA() {
  return (
    <section className="flex justify-center items-center mt-18">
      <div className="w-72 inline-flex flex-col justify-start items-start gap-10">
        <div className="self-stretch inline-flex justify-center items-center gap-20">
          <div
            data-property-1="Variant4"
            className="w-20 inline-flex flex-col justify-start items-center"
          >
            <div className="self-stretch inline-flex justify-center items-center">
              <p className="text-center justify-start text-amber-600 text-2xl font-normal font-['Quicksand'] leading-loose">
                500+
              </p>
            </div>
            <div className="inline-flex justify-center items-center">
              <p className="text-center justify-start text-Dark-blue text-base font-normal font-['Quicksand'] leading-normal">
                Teams Played
              </p>
            </div>
          </div>
          <div
            data-property-1="Variant4"
            className="w-20 inline-flex flex-col justify-start items-center"
          >
            <div className="self-stretch inline-flex justify-center items-center">
              <p className="text-center justify-start text-amber-600 text-2xl font-normal font-['Quicksand'] leading-loose">
                4.9
              </p>
            </div>
            <div className="inline-flex justify-center items-center">
              <p className="text-center justify-start text-Dark-blue text-base font-normal font-['Quicksand'] leading-normal">
                Average Rating
              </p>
            </div>
          </div>
        </div>
        <div className="self-stretch inline-flex justify-center items-center gap-20">
          <div
            data-property-1="Variant4"
            className="w-20 inline-flex flex-col justify-start items-center"
          >
            <div className="self-stretch inline-flex justify-center items-center">
              <p className="text-center justify-start text-amber-600 text-2xl font-normal font-['Quicksand'] leading-loose">
                450
              </p>
            </div>
            <div className="inline-flex justify-center items-center">
              <p className="text-center justify-start text-Dark-blue text-base font-normal font-['Quicksand'] leading-normal">
                Unique Quests
              </p>
            </div>
          </div>
          <div
            data-property-1="Variant4"
            className="w-20 inline-flex flex-col justify-start items-center"
          >
            <div className="self-stretch inline-flex justify-center items-center">
              <p className="text-center justify-start text-amber-600 text-2xl font-normal font-['Quicksand'] leading-loose">
                630
              </p>
            </div>
            <div className="inline-flex justify-center items-center">
              <p className="text-center justify-start text-Dark-blue text-base font-normal font-['Quicksand'] leading-normal">
                Locations
              </p>
            </div>
          </div>
        </div>
        <Button
          className="w-full"
          variant="primary"
          size="lg"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Get started
        </Button>
      </div>
    </section>
  );
}
