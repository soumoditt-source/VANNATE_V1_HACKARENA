"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IntroRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const requestPermissions = async () => {
      try {
        if (navigator.permissions && navigator.permissions.query) {
          try {
            const cameraPerm = await navigator.permissions.query({ name: "camera" as PermissionName });
            if (cameraPerm.state === "prompt") {
              if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
                  stream.getTracks().forEach(track => track.stop());
                } catch {
                  try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                    stream.getTracks().forEach(track => track.stop());
                  } catch {}
                }
              }
            }
          } catch {}
        }
      } catch (err) {
        console.log("Camera permission not granted or unavailable:", err);
      }

      try {
        if (navigator.permissions && navigator.permissions.query) {
          try {
            const locationPerm = await navigator.permissions.query({ name: "geolocation" });
            if (locationPerm.state === "prompt") {
              if (navigator.geolocation) {
                try {
                  await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                  });
                } catch {}
              }
            }
          } catch {}
        }
      } catch (err) {
        console.log("Location permission not granted or unavailable:", err);
      }
    };

    requestPermissions();

    const alreadySeen = window.sessionStorage.getItem("vannate-intro-seen-v3");
    if (!alreadySeen) {
      window.sessionStorage.setItem("vannate-intro-seen-v3", "true");
      window.location.replace("/intro");
    }
  }, []);

  return null;
}
