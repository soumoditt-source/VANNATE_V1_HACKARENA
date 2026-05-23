"use client";

import dynamic from "next/dynamic";

const Interactive3DScroll = dynamic(() => import("@/components/ui/Interactive3DScroll"), { ssr: false });

export default function DynamicInteractive3DScroll() {
  return <Interactive3DScroll />;
}
