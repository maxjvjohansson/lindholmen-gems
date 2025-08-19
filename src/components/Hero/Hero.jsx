"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "../Button/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import HelpIcon from "@mui/icons-material/Help";
import Modal from "../Modal/Modal";

function HowItWorksList() {
  const Item = ({ text }) => (
    <li className="flex items-start gap-3">
      <div className="mt-0.5 grid place-items-center h-9 w-9 rounded-full bg-slate-100"></div>
      <div>
        <p className="text-sm text-slate-600">{text}</p>
      </div>
    </li>
  );

  return (
    <ol className="grid gap-4">
      <Item text="Download the app and create your team." />
      <Item text="Download the app and create your team." />
      <Item text="Download the app and create your team." />
      <Item text="Download the app and create your team." />
    </ol>
  );
}

export default function Hero() {
  const [howOpen, setHowOpen] = useState(false);

  return (
    <section className="w-full min-h-[88vh] px-6 flex flex-col items-center text-center py-10 space-y-6">
      <header className="flex flex-col items-center mb-16">
        <div className="flex items-center justify-center">
          <Image src="/logo.svg" width={96} height={96} alt="Logotyp" />
        </div>
        <div className="mt-3 text-gray-800 text-3xl font-normal leading-9">
          Explore Lindholmen. <br />
          Solve challenges. <br />
          Walk together.
        </div>
      </header>

      <div className="flex flex-col gap-4 w-full max-w-sm mb-10">
        <Button href="/start" variant="primary" size="lg" Icon={PlayArrowIcon}>
          Start
        </Button>

        <Button
          onClick={() => setHowOpen(true)}
          variant="outline"
          size="lg"
          Icon={HelpIcon}
        >
          How it works
        </Button>
      </div>

      <Modal
        open={howOpen}
        onClose={() => setHowOpen(false)}
        title="How it works"
      >
        <HowItWorksList />
      </Modal>
    </section>
  );
}
