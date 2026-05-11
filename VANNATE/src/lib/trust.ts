export type TrustSignal = {
  label: string;
  score: number;
  weight: number;
};

export function computeTrustScore(signals: TrustSignal[]) {
  const weighted = signals.reduce(
    (acc, signal) => acc + signal.score * signal.weight,
    0,
  );
  const totalWeight = signals.reduce((acc, signal) => acc + signal.weight, 0);
  return Math.round(weighted / totalWeight);
}

export const defaultTrustSignals: TrustSignal[] = [
  { label: "Government registration", score: 970, weight: 0.22 },
  { label: "Activity consistency", score: 900, weight: 0.18 },
  { label: "Beneficiary confirmation", score: 932, weight: 0.24 },
  { label: "Media proof quality", score: 860, weight: 0.14 },
  { label: "Community review", score: 888, weight: 0.12 },
  { label: "Anomaly resistance", score: 954, weight: 0.1 },
];
