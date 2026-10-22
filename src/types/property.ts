export type PropertyIntent = 'Buy' | 'Rent' | 'Commercial' | 'Plots';

export type PropertyType = 
  | 'Apartment' 
  | 'Villa' 
  | 'Penthouse' 
  | 'Builder Floor' 
  | 'Commercial Office' 
  | 'Commercial Shop' 
  | 'Residential Plot';

export type FurnishingStatus = 'Furnished' | 'Semi-Furnished' | 'Unfurnished';

export interface RoomSpec {
  name: string;
  dimensions: string; // e.g. "14' x 16'"
  areaSqFt: number;
  description: string;
}

export interface FloorPlan {
  title: string;
  carpetAreaSqFt: number;
  superAreaSqFt: number;
  bhk: number;
  bathrooms: number;
  balconies: number;
  rooms: RoomSpec[];
}

export interface LocalityRating {
  connectivityScore: number; // 0-10
  lifestyleScore: number; // 0-10
  safetyScore: number; // 0-10
  environmentScore: number; // 0-10
  nearestMetroDistanceKm: number;
  nearestHospitalDistanceKm: number;
  nearestSchoolDistanceKm: number;
  topHighlights: string[];
}

export interface AgentInfo {
  name: string;
  role: 'Verified Agent' | 'Builder Rep' | 'Direct Owner';
  company: string;
  phone: string;
  avatar: string;
  experienceYears: number;
  activeListings: number;
  responseTimeMin: number;
}

export interface Property {
  id: string;
  title: string;
  project: string;
  developer: string;
  intent: PropertyIntent;
  type: PropertyType;
  city: string;
  locality: string;
  fullAddress: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  price: number; // In INR Rupees
  pricePerSqFt: number;
  bhk: number;
  bathrooms: number;
  carpetAreaSqFt: number;
  superBuiltupAreaSqFt: number;
  furnishing: FurnishingStatus;
  facing: 'North' | 'East' | 'North-East' | 'South' | 'West';
  floorNumber: number;
  totalFloors: number;
  possessionDate: string; // e.g., "Ready to Move" or "Dec 2026"
  isReadyToMove: boolean;
  reraId: string;
  isReraVerified: boolean;
  isExclusive: boolean;
  isZeroBrokerage: boolean;
  images: string[];
  amenities: string[];
  overview: string;
  floorPlans: FloorPlan[];
  localityInfo: LocalityRating;
  agent: AgentInfo;
  postedDate: string;
}

export interface FilterState {
  intent: PropertyIntent;
  city: string;
  searchQuery: string;
  propertyTypes: PropertyType[];
  bhkSelection: number[];
  minPrice: number;
  maxPrice: number;
  onlyVerified: boolean;
  onlyReadyToMove: boolean;
  onlyZeroBrokerage: boolean;
  sortBy: 'recommended' | 'price-low' | 'price-high' | 'area-high' | 'newest';
}

export interface EMICalculationResult {
  monthlyEMI: number;
  principalAmount: number;
  totalInterest: number;
  totalAmountPayable: number;
}
