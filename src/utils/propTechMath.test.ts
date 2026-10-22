import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateEMI, formatIndianPrice, formatArea, filterAndSortProperties } from './propTechMath';
import { Property, FilterState } from '../types/property';

test('calculateEMI computes correct monthly EMI for a 50 Lakh loan at 8.5% for 20 years', () => {
  const result = calculateEMI(5000000, 8.5, 20);
  // Monthly rate = 0.085/12 = 0.0070833
  // EMI expected around 43,391
  assert.ok(result.monthlyEMI > 43000 && result.monthlyEMI < 44000);
  assert.ok(result.totalInterest > 5000000);
  assert.equal(result.totalAmountPayable, result.principalAmount + result.totalInterest);
});

test('calculateEMI handles boundary zero inputs gracefully', () => {
  const result = calculateEMI(0, 8.5, 20);
  assert.equal(result.monthlyEMI, 0);
  assert.equal(result.totalAmountPayable, 0);
});

test('formatIndianPrice formats Crores, Lakhs and thousands accurately', () => {
  assert.equal(formatIndianPrice(18500000, 'Buy'), '₹1.85 Cr');
  assert.equal(formatIndianPrice(7500000, 'Buy'), '₹75 L');
  assert.equal(formatIndianPrice(45000, 'Rent'), '₹45,000 / mo');
  assert.equal(formatIndianPrice(120000, 'Rent'), '₹1.2 L / mo');
});

test('formatArea formats square feet with comma separation', () => {
  assert.equal(formatArea(1450), '1,450 sq.ft');
  assert.equal(formatArea(850), '850 sq.ft');
});

test('filterAndSortProperties correctly filters by city, BHK, and price', () => {
  const sampleProperties: Property[] = [
    {
      id: 'p1',
      title: 'Luxury 3BHK in Bandra',
      project: 'Sea Horizon',
      developer: 'Oberoi',
      intent: 'Buy',
      type: 'Apartment',
      city: 'Mumbai',
      locality: 'Bandra West',
      fullAddress: 'Pali Hill, Bandra West',
      coordinates: { lat: 19.06, lng: 72.83 },
      price: 35000000,
      pricePerSqFt: 25000,
      bhk: 3,
      bathrooms: 3,
      carpetAreaSqFt: 1400,
      superBuiltupAreaSqFt: 1800,
      furnishing: 'Furnished',
      facing: 'North-East',
      floorNumber: 12,
      totalFloors: 30,
      possessionDate: 'Ready to Move',
      isReadyToMove: true,
      reraId: 'P51800012345',
      isReraVerified: true,
      isExclusive: true,
      isZeroBrokerage: false,
      images: [],
      amenities: ['Pool', 'Gym'],
      overview: 'Sea view residence',
      floorPlans: [],
      localityInfo: {
        connectivityScore: 9.5,
        lifestyleScore: 9.8,
        safetyScore: 9.2,
        environmentScore: 8.5,
        nearestMetroDistanceKm: 0.8,
        nearestHospitalDistanceKm: 1.2,
        nearestSchoolDistanceKm: 0.5,
        topHighlights: ['Sea View', 'Near Metro'],
      },
      agent: {
        name: 'Karan Mehra',
        role: 'Verified Agent',
        company: 'PropTech Elite',
        phone: '+91 98200 12345',
        avatar: '',
        experienceYears: 8,
        activeListings: 14,
        responseTimeMin: 5,
      },
      postedDate: '2026-03-01',
    },
    {
      id: 'p2',
      title: 'Smart 2BHK in Whitefield',
      project: 'Prestige Lakeside',
      developer: 'Prestige Group',
      intent: 'Buy',
      type: 'Apartment',
      city: 'Bengaluru',
      locality: 'Whitefield',
      fullAddress: 'Varthur Rd, Whitefield',
      coordinates: { lat: 12.96, lng: 77.74 },
      price: 8500000,
      pricePerSqFt: 7500,
      bhk: 2,
      bathrooms: 2,
      carpetAreaSqFt: 980,
      superBuiltupAreaSqFt: 1250,
      furnishing: 'Semi-Furnished',
      facing: 'East',
      floorNumber: 5,
      totalFloors: 18,
      possessionDate: 'Ready to Move',
      isReadyToMove: true,
      reraId: 'PRM/KA/RERA/1251',
      isReraVerified: true,
      isExclusive: false,
      isZeroBrokerage: true,
      images: [],
      amenities: ['Clubhouse', 'Gym'],
      overview: 'Tech corridor flat',
      floorPlans: [],
      localityInfo: {
        connectivityScore: 8.8,
        lifestyleScore: 8.5,
        safetyScore: 9.0,
        environmentScore: 8.2,
        nearestMetroDistanceKm: 0.5,
        nearestHospitalDistanceKm: 2.0,
        nearestSchoolDistanceKm: 1.0,
        topHighlights: ['Near ITPL', 'Metro Connected'],
      },
      agent: {
        name: 'Priya Sharma',
        role: 'Verified Agent',
        company: 'Urban Living',
        phone: '+91 98450 98765',
        avatar: '',
        experienceYears: 6,
        activeListings: 22,
        responseTimeMin: 10,
      },
      postedDate: '2026-03-10',
    },
  ];

  const filter1: FilterState = {
    intent: 'Buy',
    city: 'Mumbai',
    searchQuery: '',
    propertyTypes: [],
    bhkSelection: [3],
    minPrice: 0,
    maxPrice: 100000000,
    onlyVerified: true,
    onlyReadyToMove: true,
    onlyZeroBrokerage: false,
    sortBy: 'recommended',
  };

  const mumbaiResults = filterAndSortProperties(sampleProperties, filter1);
  assert.equal(mumbaiResults.length, 1);
  assert.equal(mumbaiResults[0].id, 'p1');

  const filter2: FilterState = {
    ...filter1,
    city: 'Bengaluru',
    bhkSelection: [2],
  };
  const bglrResults = filterAndSortProperties(sampleProperties, filter2);
  assert.equal(bglrResults.length, 1);
  assert.equal(bglrResults[0].id, 'p2');
});
