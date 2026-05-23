/**
 * Vannate Device Capability Module
 * Detects connection quality and device tier to enable graceful degradation.
 * Supports low-data, low-CPU, and offline-first scenarios.
 */

type ConnectionType = "4g" | "3g" | "2g" | "slow-2g" | "unknown";

/** Returns effective connection type using Network Information API */
export function getConnectionQuality(): ConnectionType {
  if (typeof navigator === "undefined") return "unknown";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conn = (navigator as any).connection ?? (navigator as any).mozConnection ?? (navigator as any).webkitConnection;
  if (!conn) return "unknown";
  return (conn.effectiveType as ConnectionType) ?? "unknown";
}

/** True if device has fewer than 4 CPU cores (low-end device) */
export function isLowEndDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return (navigator.hardwareConcurrency ?? 8) < 4;
}

/** True if device has less than 2GB RAM (best-effort via deviceMemory API) */
export function isLowMemoryDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const memory = (navigator as any).deviceMemory;
  return typeof memory === "number" && memory < 2;
}

/** Returns true when device/network suggests a "lite mode" experience */
export function shouldUseLiteMode(): boolean {
  const quality = getConnectionQuality();
  const slowNet = quality === "2g" || quality === "slow-2g";
  return slowNet || isLowEndDevice() || isLowMemoryDevice();
}

/**
 * Returns appropriate Leaflet tile URL based on device capability.
 * - Fast devices: CartoDB Dark Matter (beautiful, detailed)
 * - Slow/low-bandwidth: OSM Standard (lighter payloads)
 */
export function getMapTileUrl(): string {
  if (shouldUseLiteMode()) {
    return "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
  }
  return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
}

/**
 * Returns appropriate map zoom limits for device.
 * Low-end devices get a wider zoom range to avoid heavy tile loading.
 */
export function getMapZoomConfig(): { minZoom: number; maxZoom: number } {
  return isLowEndDevice()
    ? { minZoom: 8,  maxZoom: 16 }
    : { minZoom: 5,  maxZoom: 19 };
}
