"use client";

import dynamic from "next/dynamic";

const IntroScene = dynamic(() => import("@/components/ui/IntroScene"), { ssr: false });

export default function IntroPage() {
  return <IntroScene />;
}
