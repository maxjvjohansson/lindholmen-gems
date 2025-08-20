"use client";

import LogoSmall from "@/assets/icons/logo_small.svg";
import Instagram from "@/assets/icons/instagram.svg";
import Twitter from "@/assets/icons/twitter.svg";
import Facebook from "@/assets/icons/facebook.svg";

export default function Footer() {
  return (
    <footer className="bg-[#1F2937] py-8 flex flex-col items-center gap-6 mt-16">
      <div className="flex items-center gap-3">
        <LogoSmall />
        <span className="text-orange-50 text-lg font-normal font-['Quicksand']">
          Lindholmen Gems
        </span>
      </div>

      <p className="text-orange-50/50 text-sm font-normal font-['Quicksand'] text-center">
        © 2025 Lindholmen Gems. All rights reserved.
      </p>

      <div className="flex gap-6 text-orange-50/70">
        <Instagram />
        <Twitter />
        <Facebook />
      </div>
    </footer>
  );
}
