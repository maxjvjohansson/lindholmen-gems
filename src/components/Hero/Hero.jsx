"use client";

import Image from "next/image";
import Button from "../Button/Button";
import JoinLobby from "../JoinLobby/JoinLobby";
import { QuestionMark } from "@/assets/icons/questionmark.svg";

export default function Hero() {
  return (
    <section className="px-12">
      <header className="flex flex-col items-center mb-16">
        <div className="flex items-center justify-center mt-8">
          <Image src="/logo.svg" width={60} height={60} alt="Logotyp" />
        </div>
        <div className="text-center justify-start text-gray-800 text-3xl font-normal leading-9 mt-8">
          Lindholmen Gems
        </div>
        <div className="text-center justify-start text-gray-800 text-sm font-normal mt-4">
          Explore Lindholmen. <br />
          Solve challenges. Walk together.
        </div>
      </header>

      <div className="flex flex-col gap-8 w-full max-w-sm mb-10">
        <Button href="/config" variant="primary" size="lg">
          Start a new walk
        </Button>

        <JoinLobby />

        <Button variant="outline" size="lg" Icon={QuestionMark}>
          How it works
        </Button>
      </div>
    </section>
  );
}
