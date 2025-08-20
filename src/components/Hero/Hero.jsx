"use client";

import Button from "../Button/Button";
import JoinLobby from "../JoinLobby/JoinLobby";
import Header from "../Header/Header";

export default function Hero() {
  return (
    <section className="px-12">
      <Header />

      <div className="flex flex-col gap-8 w-full max-w-sm mb-10">
        <Button href="/config" variant="primary" size="lg">
          Start a new walk
        </Button>

        <JoinLobby />

        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            document
              .getElementById("instructions")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          How it works ?
        </Button>
      </div>
    </section>
  );
}
