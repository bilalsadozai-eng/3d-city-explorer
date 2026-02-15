export interface Station {
  id: string;
  name: string;
  nameUrdu: string;
  description: string;
  facilities: string[];
  coordinates: { x: number; y: number; z: number };
  distance: number;
  connections: string[];
  image?: string;
}

export interface FareInfo {
  from: string;
  to: string;
  amount: number;
  duration: number;
}

export interface ScheduleInfo {
  stationId: string;
  direction: 'forward' | 'backward';
  nextDeparture: number;
  frequency: number;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  category: 'update' | 'alert' | 'announcement';
}

export interface MetroState {
  currentStation: string | null;
  selectedFrom: string | null;
  selectedTo: string | null;
  isPlaying: boolean;
  progress: number;
}
