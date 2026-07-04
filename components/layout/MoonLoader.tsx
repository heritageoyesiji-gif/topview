"use client";
import dynamic from "next/dynamic";

const MoonLoadScreen = dynamic(() => import("./MoonLoadScreen"), { ssr: false });

export default function MoonLoader() {
  return <MoonLoadScreen />;
}
