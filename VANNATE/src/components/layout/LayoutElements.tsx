"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import LiveNewsFeed from "../ui/LiveNewsFeed";

export default function LayoutElements() {
  const pathname = usePathname();
  
  if (pathname === "/intro") return null;

  return (
    <>
      <Navbar />
      <LiveNewsFeed />
      <LanguageSwitcher />
      <Footer />
    </>
  );
}
