import { Property, FilterState, EMICalculationResult } from '../types/property';

/**
 * Calculates monthly EMI, total interest, and total payable using standard compound loan formula
 * E = P * r * (1+r)^n / ((1+r)^n - 1)
 */
export function calculateEMI(
  principal: number,
  annualInterestRate: number,
  tenureYears: number
): EMICalculationResult {
  if (principal <= 0 || annualInterestRate <= 0 || tenureYears <= 0) {
    return {
      monthlyEMI: 0,
      principalAmount: Math.max(0, principal),
      totalInterest: 0,
      totalAmountPayable: Math.max(0, principal),
    };
  }

  const monthlyRate = annualInterestRate / (12 * 100);
  const totalMonths = tenureYears * 12;

  const powFactor = Math.pow(1 + monthlyRate, totalMonths);
  const monthlyEMI = Math.round((principal * monthlyRate * powFactor) / (powFactor - 1));
  const totalAmountPayable = monthlyEMI * totalMonths;
  const totalInterest = Math.max(0, totalAmountPayable - principal);

  return {
    monthlyEMI,
    principalAmount: principal,
    totalInterest,
    totalAmountPayable,
  };
}

/**
 * Formats currency in Indian Lacs & Crores notation
 * e.g., ₹1.45 Cr, ₹75 L, ₹45,000 / mo
 */
export function formatIndianPrice(amount: number, intent: 'Buy' | 'Rent' | 'Commercial' | 'Plots' = 'Buy'): string {
  if (!amount || isNaN(amount)) return '₹0';

  if (intent === 'Rent') {
    if (amount >= 100000) {
      const val = parseFloat((amount / 100000).toFixed(2));
      return `₹${val} L / mo`;
    }
    return `₹${amount.toLocaleString('en-IN')} / mo`;
  }

  if (amount >= 10000000) {
    const val = parseFloat((amount / 10000000).toFixed(2));
    return `₹${val} Cr`;
  }

  if (amount >= 100000) {
    const val = parseFloat((amount / 100000).toFixed(2));
    return `₹${val} L`;
  }

  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Formats square feet area with comma separator
 */
export function formatArea(sqFt: number): string {
  return `${sqFt.toLocaleString('en-IN')} sq.ft`;
}

/**
 * Filters and sorts properties based on user selected criteria
 */
export function filterAndSortProperties(
  properties: Property[],
  filters: FilterState
): Property[] {
  let result = properties.filter((p) => {
    // Intent match
    if (filters.intent && p.intent !== filters.intent) {
      return false;
    }

    // City match (case-insensitive)
    if (filters.city && filters.city !== 'All Cities') {
      if (p.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }
    }

    // Search query match (project, locality, developer, title)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.locality.toLowerCase().includes(q) ||
        p.project.toLowerCase().includes(q) ||
        p.developer.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Property types
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      if (!filters.propertyTypes.includes(p.type)) {
        return false;
      }
    }

    // BHK selection
    if (filters.bhkSelection && filters.bhkSelection.length > 0) {
      const bhkMatch = filters.bhkSelection.some((bhk) => {
        if (bhk === 4) return p.bhk >= 4;
        return p.bhk === bhk;
      });
      if (!bhkMatch) return false;
    }

    // Price range
    if (p.price < filters.minPrice || p.price > filters.maxPrice) {
      return false;
    }

    // Verified only
    if (filters.onlyVerified && !p.isReraVerified) {
      return false;
    }

    // Ready to move only
    if (filters.onlyReadyToMove && !p.isReadyToMove) {
      return false;
    }

    // Zero brokerage only
    if (filters.onlyZeroBrokerage && !p.isZeroBrokerage) {
      return false;
    }

    return true;
  });

  // Sorting
  switch (filters.sortBy) {
    case 'price-low':
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case 'area-high':
      result = [...result].sort((a, b) => b.carpetAreaSqFt - a.carpetAreaSqFt);
      break;
    case 'newest':
      result = [...result].sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
      break;
    case 'recommended':
    default:
      // Weight verified and exclusive higher
      result = [...result].sort((a, b) => {
        const scoreA = (a.isReraVerified ? 2 : 0) + (a.isExclusive ? 1 : 0);
        const scoreB = (b.isReraVerified ? 2 : 0) + (b.isExclusive ? 1 : 0);
        return scoreB - scoreA;
      });
      break;
  }

  return result;
}
