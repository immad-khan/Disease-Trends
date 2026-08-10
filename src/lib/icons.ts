import {
  Activity,
  Biohazard,
  Bug,
  Droplets,
  Syringe,
  Thermometer,
  Scan,
  Wind,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  bug: Bug,
  droplets: Droplets,
  lungs: Wind,
  thermometer: Thermometer,
  activity: Activity,
  syringe: Syringe,
  virus: Biohazard,
  scan: Scan,
};

export function diseaseIcon(key: string): LucideIcon {
  return MAP[key] ?? Activity;
}
