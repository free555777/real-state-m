import React, { useState, useEffect } from 'react';
import { HousingHeader, ActivePage } from './components/HousingHeader';
import { HousingFooter } from './components/HousingFooter';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { PostPropertyPage } from './pages/PostPropertyPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { ShortlistDrawer } from './components/ShortlistDrawer';
import { SiteVisitModal } from './components/SiteVisitModal';
import { ContactAgentModal } from './components/ContactAgentModal';
import { INITIAL_PROPERTIES } from './data/mockProperties';
import { Property } from './types/property';
import { CheckCircle2 } from 'lucide-react';
import { MobileBottomNav } from './components/MobileBottomNav';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedPlanTab, setSelectedPlanTab] = useState<'owner' | 'buyer'>('owner');
  const [savedCount, setSavedCount] = useState<number>(3);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [siteVisitProperty, setSiteVisitProperty] = useState<Property | null>(null);
  const [contactAgentProperty, setContactAgentProperty] = useState<Property | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Read URL query parameter if present, e.g. ?page=search, ?page=properties, ?page=product, ?page=plans
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = (params.get('page') || '').toLowerCase();
    if (['search', 'properties', 'buy', 'feed', 'sellers'].includes(p)) {
      setActivePage('search');
    } else if (['product', 'detail', 'property'].includes(p)) {
      setActivePage('product');
    } else if (['post', 'post-property', 'sell'].includes(p)) {
      setActivePage('post-property');
    } else if (['plans', 'pricing', 'subscription', 'choose-plan'].includes(p)) {
      setActivePage('plans');
      const plan = (params.get('plan') || '').toLowerCase();
      if (plan === 'buyer') setSelectedPlanTab('buyer');
      else if (plan === 'owner') setSelectedPlanTab('owner');
    } else if (p === 'home') {
      setActivePage('home');
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNavigate = (page: ActivePage, planTab?: 'owner' | 'buyer') => {
    if (planTab) {
      setSelectedPlanTab(planTab);
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSiteVisit = (title: string) => {
    const found = INITIAL_PROPERTIES.find((p) => p.title.toLowerCase().includes(title.toLowerCase())) || INITIAL_PROPERTIES[0];
    setSiteVisitProperty(found);
  };

  const handleOpenContactAgent = (name: string) => {
    setContactAgentProperty(INITIAL_PROPERTIES[0]);
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] flex flex-col antialiased selection:bg-[#5e23dc]/20 selection:text-[#5e23dc]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1b1b] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Housing Fixed Header */}
      <HousingHeader
        activePage={activePage}
        onNavigate={handleNavigate}
        savedCount={savedCount}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
      />

      {/* Main Dynamic Viewport (Home, Search, Product, Post-Property) */}
      <main className="w-full pt-16 pb-16 sm:pb-0 flex-1 flex flex-col">
        {activePage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectProperty={() => handleNavigate('product')}
          />
        )}

        {activePage === 'search' && (
          <PropertiesPage
            onNavigate={handleNavigate}
            onOpenSiteVisit={handleOpenSiteVisit}
            onOpenContactAgent={handleOpenContactAgent}
          />
        )}

        {activePage === 'product' && (
          <PropertyDetailPage
            onNavigate={handleNavigate}
            onBookSiteVisitSuccess={(details) => {
              showToast(`Site visit confirmed for ${details.name} on ${details.date}`);
            }}
          />
        )}

        {activePage === 'post-property' && (
          <PostPropertyPage
            onNavigate={handleNavigate}
            onListingPublished={(prop) => {
              showToast(`Property "${prop.title}" is now published and live!`);
            }}
          />
        )}

        {activePage === 'plans' && (
          <SubscriptionPage
            initialPlan={selectedPlanTab}
            onNavigate={handleNavigate}
            onSuccessToast={showToast}
          />
        )}
      </main>

      {/* Main Housing Footer */}
      <HousingFooter onNavigate={handleNavigate} />

      {/* Mobile-Only Bottom Navigation Bar (5 buttons: Search, Post Property, Premium, Services, Saved) */}
      <MobileBottomNav
        activePage={activePage}
        onNavigate={handleNavigate}
        savedCount={savedCount}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
      />

      {/* Saved / Shortlist Drawer */}
      <ShortlistDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        shortlistedProperties={INITIAL_PROPERTIES.slice(0, 3)}
        onRemoveShortlist={() => setSavedCount((c) => Math.max(0, c - 1))}
        onSelectProperty={() => {
          setIsSavedDrawerOpen(false);
          handleNavigate('product');
        }}
        onBookSiteVisit={(p) => {
          setIsSavedDrawerOpen(false);
          setSiteVisitProperty(p);
        }}
      />

      {/* Site Visit Modal */}
      <SiteVisitModal
        property={siteVisitProperty}
        onClose={() => setSiteVisitProperty(null)}
      />

      {/* Contact Agent Modal */}
      <ContactAgentModal
        property={contactAgentProperty}
        onClose={() => setContactAgentProperty(null)}
      />

    </div>
  );
}
