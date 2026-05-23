"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Donation {
  id: string;
  donorName: string;
  panNumber: string;
  baseAmount: number;
  tipAmount: number;
  totalAmount: number;
  timestamp: string;
}

export interface Incident {
  id: number;
  title: string;
  location: string;
  urgency: "LOW" | "MODERATE" | "CRITICAL";
  time: string;
}

export interface KioskScan {
  donationId: string;
  currentStep: number; // 0=Kiosk, 1=Transit, 2=Warehouse
  timestamp: string;
}

interface PortalContextType {
  donations: Donation[];
  addDonation: (donation: Donation) => void;
  incidents: Incident[];
  addIncident: (incident: Incident) => void;
  kioskScans: KioskScan[];
  updateKioskScan: (scan: KioskScan) => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export function PortalProvider({ children }: { children: ReactNode }) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([
    { id: 1, title: "Urgent: 50 Food Packets needed", location: "Sector 4 Flooding Site", urgency: "CRITICAL", time: new Date().toISOString() }
  ]);
  const [kioskScans, setKioskScans] = useState<KioskScan[]>([]);

  const addDonation = (donation: Donation) => {
    setDonations((prev) => [donation, ...prev]);
  };

  const addIncident = (incident: Incident) => {
    setIncidents((prev) => [incident, ...prev]);
  };

  const updateKioskScan = (scan: KioskScan) => {
    setKioskScans((prev) => {
      const existing = prev.find(s => s.donationId === scan.donationId);
      if (existing) {
        return prev.map(s => s.donationId === scan.donationId ? scan : s);
      }
      return [scan, ...prev];
    });
  };

  return (
    <PortalContext.Provider value={{ donations, addDonation, incidents, addIncident, kioskScans, updateKioskScan }}>
      {children}
    </PortalContext.Provider>
  );
}

export function usePortalContext() {
  const context = useContext(PortalContext);
  if (context === undefined) {
    throw new Error("usePortalContext must be used within a PortalProvider");
  }
  return context;
}
