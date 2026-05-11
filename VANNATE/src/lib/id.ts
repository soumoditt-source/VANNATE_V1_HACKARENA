let sequence = 1;

export type AccountMode = "citizen" | "ngo" | "command";

function secureToken(length = 10) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const values = new Uint8Array(length);

  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(values);
  } else {
    for (let index = 0; index < values.length; index += 1) {
      values[index] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(values, (value) => alphabet[value % alphabet.length]).join("");
}

function timestampToken() {
  return Date.now().toString(36).toUpperCase();
}

export function generateHumanitarianIds(ngoCode = "108") {
  const next = String(sequence++).padStart(5, "0");
  const donorId = `${ngoCode}${next}`;
  const beneficiaryId = `${ngoCode}-A${String(Number(next) + 99999)}`;
  const checksum = secureToken(5);

  return {
    ngoCode,
    donorId,
    beneficiaryId,
    donationId: `VN-${ngoCode}-${donorId}-${checksum}`,
    trustToken: `VTS-${checksum}-GEO-${timestampToken()}`,
  };
}

export function generateUserIdentity(mode: AccountMode = "citizen", name = "Vannate User") {
  const modePrefix: Record<AccountMode, string> = {
    citizen: "CTZ",
    ngo: "NGO",
    command: "CMD",
  };
  const accountId = `VNN-${modePrefix[mode]}-${timestampToken()}-${secureToken(6)}`;
  const publicKey = `PK-${secureToken(12)}`;
  const qrPayload = {
    iss: "vannate",
    sub: accountId,
    mode,
    name,
    publicKey,
    createdAt: new Date().toISOString(),
    scope: ["identity.verify", "donation.track", "incident.report"],
  };

  return {
    accountId,
    publicKey,
    qrPayload: JSON.stringify(qrPayload),
    qrVersion: "VANNATE-QR-v1",
  };
}
