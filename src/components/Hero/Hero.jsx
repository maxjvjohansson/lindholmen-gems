import Button from "../Button/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import HelpIcon from "@mui/icons-material/Help";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full h-screen px-6 bg-gradient-to-r from-blue-50 to-indigo-100 flex flex-col items-center text-center py-10 space-y-6">
      <header className="flex flex-col items-center mb-24">
        <div className="flex items-center justify-center">
          <Image src="/logo.svg" width={96} height={96} />
        </div>
        <h1 className="text-3xl font-normal">Lindholmen Gems</h1>
        <p className="text-gray-600 mt-2">
          Utforska Lindholmen. Lös utmaningar. Gå tillsammans.
        </p>
      </header>

      <div className="flex flex-col gap-4 w-full mb-32">
        <Button
          href="/explore"
          variant="primary"
          size="lg"
          Icon={PlayArrowIcon}
        >
          Starta äventyret
        </Button>

        <Button href="/add" variant="outline" size="lg" Icon={HelpIcon}>
          Så funkar det
        </Button>
      </div>
    </section>
  );
}
