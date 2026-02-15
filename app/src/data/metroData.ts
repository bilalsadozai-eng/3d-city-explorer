import type { Station, NewsItem } from '@/types';

export const stations: Station[] = [
  {
    id: 'saddar',
    name: 'Saddar Rawalpindi',
    nameUrdu: 'صدر راولپنڈی',
    description: 'A major commercial hub with connections to local buses and ride-hailing zones. The heart of Rawalpindi\'s shopping and business district.',
    facilities: ['Elevator', 'Ticketing', 'Security', 'Help Desk', 'Parking'],
    coordinates: { x: -15, y: 0, z: 0 },
    distance: 0,
    connections: ['Local Bus Terminal', 'Ride-hailing Zone', 'Shopping District'],
  },
  {
    id: 'committee',
    name: 'Committee Chowk',
    nameUrdu: 'کمیٹی چوک',
    description: 'A key interchange for local markets and government offices nearby. Historic center with access to major administrative buildings.',
    facilities: ['Elevator', 'Help Desk', 'Parking', 'ATM'],
    coordinates: { x: -10, y: 0, z: 2 },
    distance: 2.5,
    connections: ['Local Markets', 'Government Offices', 'Banking District'],
  },
  {
    id: 'faizabad',
    name: 'Faizabad Interchange',
    nameUrdu: 'فیض آباد انٹرچینج',
    description: 'Connects to intercity bus terminals and major road networks. The main gateway between Rawalpindi and Islamabad.',
    facilities: ['Elevator', 'ATM', 'Food Kiosk', 'Security', 'Parking', 'Prayer Area'],
    coordinates: { x: -5, y: 0, z: -1 },
    distance: 6.8,
    connections: ['Intercity Bus Terminal', 'Motorway Access', 'Taxi Stand'],
  },
  {
    id: 'peshawar-morr',
    name: 'Peshawar Morr',
    nameUrdu: 'پشاور موڑ',
    description: 'Serves residential zones and shopping areas with frequent service. Major residential hub with modern amenities.',
    facilities: ['Elevator', 'Ticketing', 'Help Desk', 'Retail Shops'],
    coordinates: { x: 0, y: 0, z: 1 },
    distance: 11.2,
    connections: ['Residential Areas', 'Shopping Mall', 'Schools'],
  },
  {
    id: 'secretariat',
    name: 'Islamabad Secretariat',
    nameUrdu: 'اسلام آباد سیکرٹریٹ',
    description: 'Steps from government offices, public parks, and the Blue Area business district. The administrative heart of the capital.',
    facilities: ['Elevator', 'Security', 'Help Desk', 'Parking', 'VIP Lounge'],
    coordinates: { x: 8, y: 0, z: -2 },
    distance: 18.5,
    connections: ['Government Offices', 'Blue Area', 'Jinnah Avenue'],
  },
  {
    id: 'parade-ground',
    name: 'Parade Ground',
    nameUrdu: 'پریڈ گراؤنڈ',
    description: 'Central Islamabad station near major commercial and recreational facilities. Access to the city\'s main parade and event grounds.',
    facilities: ['Elevator', 'Ticketing', 'Food Court', 'Retail'],
    coordinates: { x: 12, y: 0, z: 0 },
    distance: 21.0,
    connections: ['Commercial Area', 'Event Grounds', 'Sports Complex'],
  },
  {
    id: 'shaheen-enclave',
    name: 'Shaheen Enclave',
    nameUrdu: 'شاہین انکلیو',
    description: 'Modern residential and commercial hub in the heart of Islamabad. Premium location with high-end amenities.',
    facilities: ['Elevator', 'Security', 'Parking', 'Retail'],
    coordinates: { x: 16, y: 0, z: 1 },
    distance: 23.5,
    connections: ['Residential Complex', 'Commercial Plaza', 'Restaurants'],
  },
];

export const newsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Metro Service Extended to 12 AM on Weekends',
    date: '2026-02-10',
    summary: 'Starting this weekend, metro service will operate until midnight on Fridays and Saturdays to accommodate increased passenger demand.',
    category: 'announcement',
  },
  {
    id: '2',
    title: 'New Smart Card System Launch',
    date: '2026-02-08',
    summary: 'The new contactless smart card system will be rolled out across all stations starting March 1st, offering faster entry and discounted fares.',
    category: 'update',
  },
  {
    id: '3',
    title: 'Maintenance Work on Section B',
    date: '2026-02-05',
    summary: 'Scheduled maintenance on the Faizabad to Peshawar Morr section will occur on February 20th from 1 AM to 4 AM. Alternative transport provided.',
    category: 'alert',
  },
  {
    id: '4',
    title: 'Women-Only Carriages Now Available',
    date: '2026-02-01',
    summary: 'Dedicated women-only carriages are now operational during peak hours (7-9 AM and 5-7 PM) for enhanced comfort and safety.',
    category: 'announcement',
  },
];

export const fareRates = [
  { distance: 5, amount: 30 },
  { distance: 10, amount: 40 },
  { distance: 15, amount: 50 },
  { distance: 20, amount: 60 },
  { distance: 25, amount: 70 },
];

export const scheduleInfo = {
  weekday: {
    firstDeparture: '06:00',
    lastDeparture: '22:00',
    peakFrequency: 3,
    offPeakFrequency: 6,
  },
  weekend: {
    firstDeparture: '07:00',
    lastDeparture: '23:00',
    peakFrequency: 5,
    offPeakFrequency: 8,
  },
};

export const metroFacts = [
  {
    icon: 'route',
    value: '24 km',
    label: 'Total Route Length',
  },
  {
    icon: 'stations',
    value: '25',
    label: 'Stations',
  },
  {
    icon: 'time',
    value: '45 min',
    label: 'End-to-End Journey',
  },
  {
    icon: 'speed',
    value: '60 km/h',
    label: 'Maximum Speed',
  },
  {
    icon: 'passengers',
    value: '150K+',
    label: 'Daily Passengers',
  },
  {
    icon: 'bus',
    value: '68',
    label: 'Metro Buses',
  },
];

export const calculateFare = (fromId: string, toId: string): number => {
  const fromStation = stations.find(s => s.id === fromId);
  const toStation = stations.find(s => s.id === toId);
  
  if (!fromStation || !toStation) return 30;
  
  const distance = Math.abs(toStation.distance - fromStation.distance);
  const rate = fareRates.find(r => distance <= r.distance) || fareRates[fareRates.length - 1];
  return rate.amount;
};

export const calculateDuration = (fromId: string, toId: string): number => {
  const fromStation = stations.find(s => s.id === fromId);
  const toStation = stations.find(s => s.id === toId);
  
  if (!fromStation || !toStation) return 10;
  
  const distance = Math.abs(toStation.distance - fromStation.distance);
  return Math.ceil((distance / 25) * 45);
};
