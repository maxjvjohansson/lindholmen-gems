import Image from "next/image";

export default function Header() {
  return (
    <section>
      <header className="flex flex-col items-center mb-16">
        <div className="flex items-center justify-center mt-8">
          <Image
            src="/logo.svg"
            width={60}
            height={60}
            alt="Logotyp"
            priority
          />
        </div>
        <div className="text-center justify-start text-gray-800 text-3xl font-normal leading-9 mt-8">
          Lindholmen Gems
        </div>
        <div className="text-center justify-start text-gray-800 text-sm font-normal mt-4">
          Explore Lindholmen. <br />
          Solve challenges. Walk together.
        </div>
      </header>
    </section>
  );
}
