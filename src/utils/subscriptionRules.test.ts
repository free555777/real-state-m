import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SUBSCRIPTION_PLANS,
  OWNER_CATEGORIES,
  BUYER_CATEGORIES,
  calculateSubscriptionValidity,
  validateOwnerListingData,
  validateBuyerRequirementData,
  calculateContactUnlockQuota,
  formatINR,
} from './subscriptionRules';

test('Subscription Plans configuration matches requirements', () => {
  // Owner Plan
  assert.equal(SUBSCRIPTION_PLANS.owner.id, 'owner');
  assert.equal(SUBSCRIPTION_PLANS.owner.name, 'Owner Plan');
  assert.equal(SUBSCRIPTION_PLANS.owner.price, 199);
  assert.equal(SUBSCRIPTION_PLANS.owner.durationMonths, 3);
  assert.deepEqual([...SUBSCRIPTION_PLANS.owner.categories], [
    'Residential',
    'Commercial',
    'Land',
    'Plot',
    'Farmhouse',
    'Builder Project',
  ]);

  // Buyer Plan
  assert.equal(SUBSCRIPTION_PLANS.buyer.id, 'buyer');
  assert.equal(SUBSCRIPTION_PLANS.buyer.name, 'Buyer / Tenant Plan');
  assert.equal(SUBSCRIPTION_PLANS.buyer.price, 49);
  assert.equal(SUBSCRIPTION_PLANS.buyer.originalPrice, 249);
  assert.equal(SUBSCRIPTION_PLANS.buyer.badge, 'Launch Offer');
  assert.equal(SUBSCRIPTION_PLANS.buyer.durationMonths, 3);
  assert.deepEqual([...SUBSCRIPTION_PLANS.buyer.categories], [
    'Residential',
    'Commercial',
    'Land',
    'Plot',
  ]);
  assert.match(SUBSCRIPTION_PLANS.buyer.pricingClarification || '', /separate transactions/i);
});

test('calculateSubscriptionValidity computes 3 months expiration', () => {
  const start = new Date(2026, 0, 1); // Jan 1, 2026
  const result = calculateSubscriptionValidity(start, 3);
  assert.equal(result.expiryDate.getMonth(), 3); // April
  assert.equal(result.expiryDate.getFullYear(), 2026);
  assert.ok(result.formattedExpiry.includes('2026'));
});

test('validateOwnerListingData validates required fields correctly', () => {
  // Empty data must fail
  const emptyRes = validateOwnerListingData({});
  assert.equal(emptyRes.isValid, false);
  assert.ok(emptyRes.errors.category);
  assert.ok(emptyRes.errors.propertyType);
  assert.ok(emptyRes.errors.title);
  assert.ok(emptyRes.errors.city);
  assert.ok(emptyRes.errors.expectedPrice);
  assert.ok(emptyRes.errors.kycDocType);
  assert.ok(emptyRes.errors.agreeTerms);

  // Complete valid data must pass
  const validRes = validateOwnerListingData({
    propertyType: 'sale',
    category: 'Residential',
    title: 'Luxury 3 BHK Skyline Apartment',
    city: 'Mumbai',
    locality: 'Worli Sea Face',
    expectedPrice: 45000000,
    carpetArea: 1650,
    bedrooms: '3 BHK',
    kycDocType: 'Aadhaar Card',
    kycDocNumber: 'XXXX-XXXX-9821',
    agreeTerms: true,
  });
  assert.equal(validRes.isValid, true);
  assert.equal(Object.keys(validRes.errors).length, 0);
});

test('validateBuyerRequirementData validates budget ranges and mandatory fields', () => {
  // Invalid min > max budget
  const invalidBudget = validateBuyerRequirementData({
    intent: 'buy',
    category: 'Residential',
    city: 'Mumbai',
    locality: 'Bandra West',
    budgetMin: 5000000,
    budgetMax: 2000000,
    possessionTimeframe: 'Ready to Move',
    agreeTerms: true,
  });
  assert.equal(invalidBudget.isValid, false);
  assert.ok(invalidBudget.errors.budgetMax);

  // Valid buyer requirement
  const validRes = validateBuyerRequirementData({
    intent: 'buy',
    category: 'Commercial',
    city: 'Mumbai',
    locality: 'BKC',
    budgetMin: 15000000,
    budgetMax: 30000000,
    possessionTimeframe: 'Under Construction',
    agreeTerms: true,
  });
  assert.equal(validRes.isValid, true);
  assert.equal(Object.keys(validRes.errors).length, 0);
});

test('calculateContactUnlockQuota correctly handles separate packs of 3 contacts', () => {
  // Initially, 0 packs purchased: 0 quota, remaining 0, needs pack
  const initial = calculateContactUnlockQuota(0, 0);
  assert.equal(initial.totalUnlockedQuota, 0);
  assert.equal(initial.remainingAllowance, 0);
  assert.equal(initial.canRevealMore, false);
  assert.equal(initial.needsNewPack, true);

  // After 1 pack purchased (for ₹49): 3 contacts allowed
  const pack1 = calculateContactUnlockQuota(1, 1);
  assert.equal(pack1.totalUnlockedQuota, 3);
  assert.equal(pack1.revealedCount, 1);
  assert.equal(pack1.remainingAllowance, 2);
  assert.equal(pack1.canRevealMore, true);
  assert.equal(pack1.needsNewPack, false);

  // After all 3 contacts used up:
  const exhausted = calculateContactUnlockQuota(3, 1);
  assert.equal(exhausted.remainingAllowance, 0);
  assert.equal(exhausted.canRevealMore, false);
  assert.equal(exhausted.needsNewPack, true);
  assert.equal(exhausted.costForNextPack, 49);

  // After 2nd pack purchased (another ₹49): total 6 contacts
  const pack2 = calculateContactUnlockQuota(4, 2);
  assert.equal(pack2.totalUnlockedQuota, 6);
  assert.equal(pack2.remainingAllowance, 2);
  assert.equal(pack2.canRevealMore, true);
});

test('formatINR formats currency nicely', () => {
  assert.equal(formatINR(49), '₹49');
  assert.equal(formatINR(199), '₹199');
  assert.equal(formatINR(2500000), '₹25 L');
  assert.equal(formatINR(45000000), '₹4.5 Cr');
});
