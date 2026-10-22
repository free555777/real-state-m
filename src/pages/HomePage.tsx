import React, { useState, useRef } from 'react';
import { ActivePage } from '../components/HousingHeader';

interface HomePageProps {
  onNavigate: (page: ActivePage) => void;
  onSelectProperty?: (propertyId: string) => void;
}

const TOP_PICKS = [
  {
    id: 'anuhar-gautami',
    title: 'Anuhar Gautami Heights',
    shortTitle: 'Anuhar Gautami Heig...',
    location: 'Miyapur, Hyderabad',
    price: '₹86.28 L - 1.43 Cr',
    config: '2, 2.5, 3 BHK Apartments',
    developer: 'Anuhar Homes Pvt Ltd',
    developerShort: 'Anuhar Homes Pvt ...',
    developerType: 'anuhar',
    yearEstd: '2005',
    projectsCount: '25',
    tagline: 'Premium High-Rise Living in Miyapur',
    reraId: 'P02400004921',
    badge: 'ANUHAR HOMES',
    subBadge: 'BUILDING EXCELLENCE',
    website: 'www.anuhar.com',
    thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=320&q=80',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=85',
  },
  {
    id: 'allegro-classic',
    title: 'Classic Featherlite',
    shortTitle: 'Classic Feather...',
    location: 'Hennur Road, Bangalore',
    price: '₹1.14 Cr - 1.95 Cr',
    config: '2, 3, 4 BHK Apartments',
    developer: 'Allegro Mahaveer Ventures',
    developerShort: 'Allegro Mahaveer ...',
    developerType: 'allegro',
    yearEstd: '2012',
    projectsCount: '19',
    tagline: 'High-Rise Architectural Landmark',
    reraId: 'PRM/KA/RERA/1251/446/PR/190823',
    badge: 'ALLEGRO LUXURY',
    subBadge: 'MAHAVEER VENTURE',
    website: 'www.allegromahaveer.com',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=320&q=80',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85',
  },
  {
    id: 'venkatesh-skylife',
    title: 'Venkatesh Skylife',
    shortTitle: 'Venkatesh Skylife',
    location: 'Nanded, Pune',
    price: '₹1.8 Cr - 2.62 Cr',
    config: '3, 4 BHK Apartments',
    developer: 'Shree Venkatesh Buildcon Pvt Ltd',
    developerShort: 'Shree Venkatesh ...',
    developerType: 'venkatesh',
    yearEstd: '2000',
    projectsCount: '28',
    tagline: '4 & 3 BHK Signature Residences',
    reraId: 'P52100080345',
    badge: 'VENKATESH LUXE',
    subBadge: 'BY ANKUSH ASABE',
    website: 'www.venkateshbuildcon.com',
    thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=320&q=80',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85',
  },
  {
    id: 'lansum-el-palacio',
    title: 'Lansum EL Palacio',
    shortTitle: 'Lansum EL Palacio',
    location: 'Puppalguda, Hyderabad',
    price: '₹1.53 Cr - 2.06 Cr',
    config: '3 BHK Apartment',
    developer: 'Lansum Properties LLP',
    developerShort: 'Lansum Properties ...',
    developerType: 'lansum',
    yearEstd: '2011',
    projectsCount: '16',
    tagline: 'Palatial 3 BHK High-Rise Residences',
    reraId: 'P02400005821',
    badge: 'LANSUM PROPERTIES',
    subBadge: 'PREMIER LIVING',
    website: 'www.lansumproperties.com',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=320&q=80',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
  },
  {
    id: 'venkatesh-laurel',
    title: 'Venkatesh Laurel',
    shortTitle: 'Venkatesh Laurel',
    location: 'Central Shivajinagar, Pune',
    price: '₹2.10 Cr - 3.45 Cr',
    config: '3, 4 BHK Luxury Residences',
    developer: 'Shree Venkatesh Buildcon Pvt Ltd',
    developerShort: 'Shree Venkatesh ...',
    developerType: 'venkatesh',
    yearEstd: '2000',
    projectsCount: '28',
    tagline: 'Views Curated For You',
    reraId: 'P52100078129',
    badge: 'VENKATESH LUXE',
    subBadge: 'BY ANKUSH ASABE',
    website: 'www.venkateshbuildcon.com',
    thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=320&q=80',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=85',
  },
  {
    id: 'venkatesh-erandwane',
    title: 'Venkatesh Erandwane...',
    shortTitle: 'Venkatesh',
    fullTitle: 'Venkatesh Erandwane Central',
    location: 'Erandwane, Pune',
    price: '₹2.85 Cr - 4.20 Cr',
    config: '3, 4 & 4.5 BHK Apartments',
    developer: 'Shree Venkatesh Buildcon Pvt Ltd',
    developerShort: 'Shree Venkatesh ...',
    developerType: 'venkatesh',
    yearEstd: '2000',
    projectsCount: '28',
    tagline: 'Signature Iconic High-Rise',
    reraId: 'P52100067452',
    badge: 'VENKATESH SIGNATURE',
    subBadge: 'BY ANKUSH ASABE',
    website: 'www.venkateshbuildcon.com',
    thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=320&q=80',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85',
  },
];

const HIGH_DEMAND_PROJECTS_ROW_1 = [
  {
    id: 'topaz-towers',
    title: 'Topaz Towers',
    developer: 'by Aakar Realties',
    config: '2, 3 BHK Apartments',
    location: 'Charholi Budruk, Pune',
    price: '₹60.86 L - 92.66 L',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'goldmark-essentia',
    title: 'Goldmark Essentia',
    developer: 'by Dattatray More',
    config: 'Residential Plots',
    location: 'Mugawade, Pune',
    price: '₹51.18 L - 1.47 Cr',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'unique-prestigia',
    title: 'Unique Prestigia',
    developer: 'by Unique Properties',
    config: '2, 3, 4 BHK Apartment, Duple...',
    location: 'Lohegaon, Pune',
    price: '₹89.61 L - 3.13 Cr',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'godrej-emerald-waters',
    title: 'Godrej Emerald Waters',
    developer: 'by Godrej Properties',
    config: '2, 3 BHK Luxury Residences',
    location: 'Pimpri, Pune',
    price: '₹1.15 Cr - 2.10 Cr',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'kolte-patil-life',
    title: 'Life Republic Phase 2',
    developer: 'by Kolte-Patil',
    config: '2, 3 BHK High-Rise Homes',
    location: 'Hinjawadi, Pune',
    price: '₹75.0 L - 1.35 Cr',
    image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=400&q=80',
  },
];

const HIGH_DEMAND_PROJECTS_ROW_2 = [
  {
    id: 'global-riverfront',
    title: 'Global Riverfront Ph...',
    developer: 'by Global Group',
    config: '2, 3, 3.5 BHK Apartment, Dupl...',
    location: 'Mundhwa, Pune',
    price: '₹1.7 Cr - 3.02 Cr',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'samarth-park',
    title: 'Samarth Park',
    developer: 'by Samarth Properties',
    config: 'Residential Plots',
    location: 'Ranjangaon, Pune',
    price: '₹6.5 L - 9.75 L',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'bivega-silver',
    title: 'Bivega The Silver Alt...',
    developer: 'by Bivega Realty',
    config: '2, 3, 4 BHK Apartments',
    location: 'Ravet, Pune',
    price: '₹90.0 L - 2.04 Cr',
    image: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'vtp-bellissimo',
    title: 'VTP Bellissimo',
    developer: 'by VTP Realty',
    config: '2, 3 BHK Premium Homes',
    location: 'Hinjawadi, Pune',
    price: '₹78.5 L - 1.45 Cr',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'rohan-abhilasha',
    title: 'Rohan Abhilasha',
    developer: 'by Rohan Builders',
    config: '1, 2, 3 BHK Apartments',
    location: 'Wagholi, Pune',
    price: '₹42.0 L - 85.0 L',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80',
  },
];

const RECOMMENDED_SELLERS_ROW_1 = [
  {
    id: 'trinita-capital',
    name: 'Trinita Capital LLP',
    headerBg: 'bg-[#bde0fe]',
    headerTextColor: 'text-stone-900',
    avatarType: 'pattern',
    experience: '9 Yrs',
    listings: 48,
    tags: ['Kharadi', 'Mundhwa'],
    phone: '+91 98230 45112',
  },
  {
    id: 'akaraa-realty',
    name: 'Akaraa Realty',
    headerBg: 'bg-[#0f385c]',
    headerTextColor: 'text-white',
    avatarType: 'gold',
    experience: '15 Yrs',
    listings: 97,
    tags: ['Undri', 'Mohammed Wadi'],
    phone: '+91 98221 67890',
  },
  {
    id: 'a-square',
    name: 'A Square Enterpri...',
    fullName: 'A Square Enterprises',
    headerBg: 'bg-[#d4af37]',
    headerTextColor: 'text-stone-900',
    avatarType: 'as',
    avatarText: 'AS',
    experience: '18 Yrs',
    listings: 31,
    tags: ['Viman Nagar', 'Yerawada'],
    phone: '+91 98500 12345',
  },
  {
    id: 'elegance-properties',
    name: 'ELEGANCE PROPERTIES',
    headerBg: 'bg-[#e76f51]',
    headerTextColor: 'text-white',
    avatarType: 'crest',
    experience: '19 Yrs',
    listings: 63,
    tags: ['Dhayari', 'Khadewadi'],
    phone: '+91 98233 88990',
  },
  {
    id: 'marvel-realtors',
    name: 'Marvel Realtors',
    headerBg: 'bg-[#3b82f6]',
    headerTextColor: 'text-white',
    avatarType: 'as',
    avatarText: 'MR',
    experience: '12 Yrs',
    listings: 54,
    tags: ['Kalyani Nagar', 'Koregaon Park'],
    phone: '+91 98200 45678',
  },
];

const RECOMMENDED_SELLERS_ROW_2 = [
  {
    id: 'hitesh-awachite',
    name: 'Hitesh Awachite',
    headerBg: 'bg-white border-b border-stone-200/80',
    headerTextColor: 'text-stone-900',
    avatarType: 'yuga',
    avatarText: 'YUGA',
    experience: '14 Yrs',
    listings: 74,
    tags: ['Lohegaon', 'Dhanori'],
    phone: '+91 99700 87654',
  },
  {
    id: 'day-realty',
    name: 'day Realty',
    headerBg: 'bg-white border-b border-stone-200/80',
    headerTextColor: 'text-stone-900',
    avatarType: 'dr',
    avatarText: 'DR',
    experience: '12 Yrs',
    listings: 96,
    tags: ['Baner', 'Wakad'],
    phone: '+91 98600 43210',
  },
  {
    id: 'sr-homes',
    name: 'SR HOMES',
    headerBg: 'bg-white border-b border-stone-200/80',
    headerTextColor: 'text-stone-900',
    avatarType: 'sr',
    avatarText: 'SR',
    experience: '12 Yrs',
    listings: 23,
    tags: ['Nerhe', 'Hinjawadi Phase 2'],
    phone: '+91 98811 55667',
  },
  {
    id: 'vedanshu-properties',
    name: 'Vedanshu Properties',
    headerBg: 'bg-white border-b border-stone-200/80',
    headerTextColor: 'text-stone-900',
    avatarType: 'vedanshu',
    experience: '0.5 Yrs',
    listings: 76,
    tags: ['Mundhwa', 'Kharadi'],
    phone: '+91 98210 99887',
  },
  {
    id: 'prime-estate',
    name: 'Prime Estate Partners',
    headerBg: 'bg-white border-b border-stone-200/80',
    headerTextColor: 'text-stone-900',
    avatarType: 'as',
    avatarText: 'PE',
    experience: '8 Yrs',
    listings: 41,
    tags: ['Aundh', 'Pashan'],
    phone: '+91 98330 11223',
  },
];

const NEWLY_ADDED_PROPERTIES = [
  {
    id: 'aqura-pride',
    title: 'Aqura Pride',
    config: '2, 3 BHK Apartments',
    location: 'Vadgaon Budruk, Pune',
    price: '₹72.0 L - 1.8 Cr',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'rohan-ananta',
    title: 'Rohan Ananta Phase I',
    config: '1, 2 BHK Apartments',
    location: 'Tathawade, Pune',
    price: '₹38.9 L - 72.44 L',
    image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'konark-grand-casa',
    title: 'Konark Grand Casa',
    config: '2, 3 BHK Apartments',
    location: 'Thergaon, Pune',
    price: '₹39.1 L - 1.07 Cr',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'arihant-elite',
    title: 'Arihant Elite',
    config: '3 BHK Apartment',
    location: 'Wanwadi, Pune',
    price: '₹98.99 L - 1.07 Cr',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'pride-aloma',
    title: 'Pride Aloma',
    config: '2, 3 BHK Apartments',
    location: 'Wakad, Pune',
    price: '₹68.5 L - 1.15 Cr',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'nyati-elysia',
    title: 'Nyati Elysia',
    config: '2, 3 BHK Luxury Towers',
    location: 'Kharadi, Pune',
    price: '₹88.0 L - 1.65 Cr',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectProperty }) => {
  const [heroTab, setHeroTab] = useState<'buy' | 'sell' | 'rent'>('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Top Picks State & Carousel Navigation
  const [activeTopPickIndex, setActiveTopPickIndex] = useState(0);
  const [isMediaPlaying, setIsMediaPlaying] = useState(true);
  const [selectedTopPick, setSelectedTopPick] = useState<typeof TOP_PICKS[0] | null>(null);
  const [enquirySent, setEnquirySent] = useState(false);
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryEmail, setEnquiryEmail] = useState('');
  const topPicksScrollRef = useRef<HTMLDivElement>(null);
  const mobileTopPicksScrollRef = useRef<HTMLDivElement>(null);
  const highDemandScrollRef = useRef<HTMLDivElement>(null);
  const sellersScrollRef = useRef<HTMLDivElement>(null);
  const newlyAddedScrollRef = useRef<HTMLDivElement>(null);

  const [selectedSeller, setSelectedSeller] = useState<typeof RECOMMENDED_SELLERS_ROW_1[0] | null>(null);
  const [selectedNewlyAdded, setSelectedNewlyAdded] = useState<typeof NEWLY_ADDED_PROPERTIES[0] | null>(null);
  const [sellerLeadSuccess, setSellerLeadSuccess] = useState(false);
  const [newlyAddedLeadSuccess, setNewlyAddedLeadSuccess] = useState(false);
  const [leadContactName, setLeadContactName] = useState('');
  const [leadContactPhone, setLeadContactPhone] = useState('');

  const scrollHorizontally = (ref: React.RefObject<HTMLDivElement | null>, distance: number) => {
    if (ref.current) {
      ref.current.scrollBy({ left: distance, behavior: 'smooth' });
    }
  };

  const handleScrollTopPicks = (direction: 'left' | 'right') => {
    if (!topPicksScrollRef.current) return;
    const container = topPicksScrollRef.current;
    const card = container.querySelector('[data-card="top-pick"]') as HTMLElement;
    const step = card ? card.offsetWidth + 24 : 850;
    
    if (direction === 'right') {
      const nextIdx = (activeTopPickIndex + 1) % TOP_PICKS.length;
      setActiveTopPickIndex(nextIdx);
      container.scrollBy({ left: step, behavior: 'smooth' });
    } else {
      const prevIdx = activeTopPickIndex > 0 ? activeTopPickIndex - 1 : 0;
      setActiveTopPickIndex(prevIdx);
      container.scrollBy({ left: -step, behavior: 'smooth' });
    }
  };

  const handleSelectTopPick = (index: number) => {
    setActiveTopPickIndex(index);
    if (topPicksScrollRef.current) {
      const container = topPicksScrollRef.current;
      const targetElement = document.getElementById(`top-pick-${index}`);
      if (targetElement) {
        const containerLeft = container.getBoundingClientRect().left;
        const targetLeft = targetElement.getBoundingClientRect().left;
        container.scrollBy({
          left: targetLeft - containerLeft - 8,
          behavior: 'smooth'
        });
      }
    }
    if (mobileTopPicksScrollRef.current) {
      const container = mobileTopPicksScrollRef.current;
      const targetElement = document.getElementById(`mobile-top-pick-${index}`);
      if (targetElement) {
        const containerLeft = container.getBoundingClientRect().left;
        const targetLeft = targetElement.getBoundingClientRect().left;
        container.scrollBy({
          left: targetLeft - containerLeft - 16,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleCarouselScroll = () => {
    if (!topPicksScrollRef.current) return;
    const container = topPicksScrollRef.current;
    const scrollLeft = container.scrollLeft;
    const card = container.querySelector('[data-card="top-pick"]') as HTMLElement;
    const step = card ? card.offsetWidth + 24 : 850;
    const currentIndex = Math.min(TOP_PICKS.length - 1, Math.max(0, Math.round(scrollLeft / step)));
    if (currentIndex !== activeTopPickIndex) {
      setActiveTopPickIndex(currentIndex);
    }
  };

  const handleMobileCarouselScroll = () => {
    if (!mobileTopPicksScrollRef.current) return;
    const container = mobileTopPicksScrollRef.current;
    const scrollLeft = container.scrollLeft;
    const card = container.querySelector('[data-card="mobile-top-pick"]') as HTMLElement;
    const step = card ? card.offsetWidth + 16 : 300;
    const currentIndex = Math.min(TOP_PICKS.length - 1, Math.max(0, Math.round(scrollLeft / step)));
    if (currentIndex !== activeTopPickIndex) {
      setActiveTopPickIndex(currentIndex);
    }
  };

  const handleOpenContact = (pick: typeof TOP_PICKS[0]) => {
    setSelectedTopPick(pick);
    setEnquirySent(false);
    setEnquiryName('');
    setEnquiryPhone('');
    setEnquiryEmail('');
  };

  const handleSendEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryName || !enquiryPhone) return;
    setEnquirySent(true);
    setTimeout(() => {
      setSelectedTopPick(null);
      setEnquirySent(false);
    }, 2800);
  };

  const handleSearch = () => {
    if (heroTab === 'sell') {
      onNavigate('post-property');
      return;
    }
    onNavigate('search');
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceFeedback('Voice search is not supported in this browser. Please type your search.');
      setTimeout(() => setVoiceFeedback(null), 4000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceFeedback('Listening... Speak your dream home requirements.');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setSearchQuery(transcript);
          setVoiceFeedback(`Heard: "${transcript}"`);
          setTimeout(() => setVoiceFeedback(null), 3000);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceFeedback('Could not detect speech. Please try again or type.');
        setTimeout(() => setVoiceFeedback(null), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceFeedback('Microphone permission required for voice search.');
      setTimeout(() => setVoiceFeedback(null), 3000);
    }
  };

  const suggestionChips = [
    { label: 'Will my king bed fit in the primary?', query: 'Will my king bed fit in the primary?' },
    { label: '3 bedroom home near a Starbucks', query: '3 bedroom home near a Starbucks' },
    { label: 'What makes this house unique?', query: 'What makes this house unique?' },
    { label: 'Does this property have a backyard?', query: 'Does this property have a backyard?' },
  ];

  const handleChipClick = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="flex flex-col w-full">
      
      {/* 1. Full-Screen Hero Section with Luxury Modern Villa Background */}
      <section 
        className="hero relative w-full overflow-hidden flex flex-col justify-between items-center min-h-[520px] sm:min-h-[calc(100vh-4rem)] pt-4 sm:pt-10 pb-6 sm:pb-12 px-3 sm:px-6 lg:px-12"
        style={{
          backgroundImage: "url('/images/luxury-house.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 52%",
          backgroundRepeat: "no-repeat",
          minHeight: "calc(100vh - 4rem)",
          width: "100%"
        }}
      >
        {/* Top Header Row Directly Overlaid on Top of Image */}
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 md:gap-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] sm:text-xs font-semibold mb-2 sm:mb-3 border border-white/20 shadow-sm">
                <span className="material-symbols-outlined text-sm text-[#10b981]">verified</span>
                <span>3K+ listings added daily • 77K+ verified across India</span>
              </div>
              <h1 className="text-[28px] sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold text-stone-900 tracking-tight leading-[1.12] sm:leading-[1.08] drop-shadow-[0_2px_8px_rgba(255,255,255,0.95)]">
                Your Vision. Your Property.<br className="hidden sm:inline" /> Your Future.
              </h1>
            </div>
            <div className="max-w-md md:pb-2">
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/85 backdrop-blur-md border border-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <p className="text-stone-800 text-xs sm:text-base font-medium leading-relaxed">
                  Explore residential, commercial and land listings to find the right opportunity for your next move.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Property Search Interface matching the exact uploaded screenshot */}
        <div className="relative z-20 w-full max-w-5xl mx-auto mt-auto pt-4 sm:pt-8">
          <div className="flex flex-col w-full">
            
            {/* Top Navigation Tabs - Tab Bar Integrated into Top Left of Search Box */}
            <div className="flex items-end">
              <div className="bg-white rounded-t-[18px] sm:rounded-t-[24px] pl-2 sm:pl-3 pr-3 sm:pr-4 pt-1.5 sm:pt-2.5 pb-1.5 sm:pb-2 flex items-center gap-1 shadow-[-2px_-2px_8px_rgba(0,0,0,0.04)]">
                <button
                  type="button"
                  onClick={() => setHeroTab('buy')}
                  className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    heroTab === 'buy'
                      ? 'bg-white text-stone-900 shadow-[0_2px_8px_rgba(0,0,0,0.12)] border border-stone-100 font-semibold'
                      : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setHeroTab('sell')}
                  className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    heroTab === 'sell'
                      ? 'bg-white text-stone-900 shadow-[0_2px_8px_rgba(0,0,0,0.12)] border border-stone-100 font-semibold'
                      : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  Sell
                </button>
                <button
                  type="button"
                  onClick={() => setHeroTab('rent')}
                  className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    heroTab === 'rent'
                      ? 'bg-white text-stone-900 shadow-[0_2px_8px_rgba(0,0,0,0.12)] border border-stone-100 font-semibold'
                      : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  Rent
                </button>
              </div>

              {/* Concave fillet curve connecting tab to search container */}
              <div className="w-6 h-6 -mb-[1px] -ml-[1px] overflow-hidden pointer-events-none hidden sm:block">
                <svg width="24" height="24" viewBox="0 0 24 24" className="w-full h-full fill-white">
                  <path d="M 0 24 L 0 0 A 24 24 0 0 0 24 24 Z" fill="#ffffff" />
                </svg>
              </div>
            </div>

            {/* Main White Search Container */}
            <div className="w-full bg-white rounded-b-[24px] sm:rounded-b-[32px] rounded-tr-[24px] sm:rounded-tr-[32px] p-2.5 sm:p-4 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.32)] border border-white/80">
              
              {/* Inner Light Grey Capsule Search Pill */}
              <div className="relative">
                <div className="flex items-center gap-2 sm:gap-4 bg-[#f0f2f5] hover:bg-[#eaecee] focus-within:bg-white focus-within:ring-2 focus-within:ring-stone-900/10 focus-within:border-stone-300 border border-stone-200/60 rounded-full pl-3.5 sm:pl-6 pr-1.5 sm:pr-3 py-1.5 sm:py-2.5 transition-all">
                  
                  {/* Search Input Box */}
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search city, locality, project..."
                    className="w-full bg-transparent text-xs sm:text-base text-stone-900 placeholder:text-stone-600 focus:outline-none font-normal"
                  />

                  {/* Circular Submit Upward Arrow Button */}
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-stone-50 active:scale-95 text-stone-900 shadow-[0_2px_8px_rgba(0,0,0,0.12)] border border-stone-200/60 flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
                    title="Search Properties"
                  >
                    <span className="material-symbols-outlined text-lg sm:text-2xl font-light">arrow_upward</span>
                  </button>
                </div>

                {/* Quick Filter Menu Popover (from Plus Icon) */}
                {showFilterMenu && (
                  <div className="absolute left-0 top-full mt-2 w-full sm:w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 z-50 text-xs text-stone-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <span className="font-bold text-stone-900">Explore by Category</span>
                      <button 
                        onClick={() => setShowFilterMenu(false)}
                        className="text-stone-400 hover:text-stone-600 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {['Luxury Villa', 'Penthouse', 'Gated Community', 'Sea Facing', '3+ BHK', 'Ready to Move'].map((item) => (
                        <button
                          key={item}
                          onClick={() => {
                            setSearchQuery(item);
                            setShowFilterMenu(false);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors cursor-pointer"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Voice Feedback Message */}
              {voiceFeedback && (
                <div className="text-xs text-stone-700 bg-stone-100 px-3.5 py-2 rounded-xl border border-stone-200/80 flex items-center gap-2 mt-3">
                  <span className="material-symbols-outlined text-base text-[#5e23dc]">info</span>
                  <span>{voiceFeedback}</span>
                </div>
              )}

            </div>

            {/* 4 Suggested Search Chips - Underneath Search Bar in Frosted Glass matching screenshot */}
            <div className="flex items-center gap-2 sm:gap-3.5 overflow-x-auto scrollbar-none pt-3 sm:pt-4 pb-1 w-full justify-start md:justify-center">
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChipClick(chip.query)}
                  className="px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-stone-900/50 hover:bg-stone-900/70 backdrop-blur-md text-white text-[11px] sm:text-[13px] font-normal border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-all cursor-pointer flex-shrink-0 whitespace-nowrap"
                >
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 3. Housing's Top Picks & Featured Projects (Redesigned per Reference Screenshot) */}
      <section className="w-full py-10 sm:py-16 bg-[#fbfbfe]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-4 sm:gap-8">
          
          {/* Header Row: Title on Left, Project Thumbnails on Right */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2.5 sm:gap-6 pb-1 sm:pb-2">
            <div>
              <h2 className="text-xl sm:text-3xl lg:text-[32px] font-bold text-[#1c1b1b] tracking-tight">
                Vindhya's top picks
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5 sm:mt-1">
                Explore top living options with us
              </p>
            </div>

            {/* Top-Right Project Preview Thumbnails for DESKTOP & TABLET - STRICTLY UNCHANGED */}
            <div className="hidden sm:flex items-end gap-2.5 sm:gap-4 overflow-x-auto scrollbar-none pb-1 max-w-full">
              {TOP_PICKS.map((item, idx) => {
                const isActive = activeTopPickIndex === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTopPick(idx)}
                    className="flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer group flex-shrink-0"
                  >
                    <div 
                      className={`relative w-20 sm:w-28 h-12 sm:h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        isActive 
                          ? 'border-[#5e23dc] shadow-md ring-2 ring-[#5e23dc]/25' 
                          : 'border-transparent opacity-80 hover:opacity-100 hover:border-stone-300'
                      }`}
                    >
                      <img 
                        src={item.thumbnail} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                    <span 
                      className={`text-[10px] sm:text-xs tracking-tight truncate max-w-[90px] sm:max-w-[120px] transition-colors ${
                        isActive 
                          ? 'text-[#1c1b1b] font-bold' 
                          : 'text-stone-500 group-hover:text-stone-800 font-medium'
                      }`}
                    >
                      {item.title}
                    </span>
                    {/* Active Purple Indicator Bar matching screenshot */}
                    <div 
                      className={`h-[3px] w-full rounded-full transition-all duration-300 ${
                        isActive ? 'bg-[#5e23dc]' : 'bg-transparent'
                      }`} 
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* MOBILE PREVIEW ONLY: Enlarged Project Thumbnails (Image 2 - "jo second image me h usse thoda bada kr do") */}
          <div className="sm:hidden flex items-start gap-3.5 overflow-x-auto scrollbar-none pb-2 pt-0.5 -mx-4 px-4">
            {TOP_PICKS.map((item, idx) => {
              const isActive = activeTopPickIndex === idx;
              return (
                <button
                  key={`mob-thumb-${item.id}`}
                  type="button"
                  onClick={() => handleSelectTopPick(idx)}
                  className="flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer shrink-0"
                >
                  <div 
                    className={`relative w-[114px] h-[72px] rounded-2xl overflow-hidden transition-all duration-200 ${
                      isActive 
                        ? 'p-0.5 border-2 border-[#5e23dc] ring-2 ring-[#5e23dc]/25 shadow-md scale-[1.02]' 
                        : 'border border-stone-200/90 opacity-80 hover:opacity-100 shadow-xs'
                    }`}
                  >
                    <img 
                      src={item.thumbnail} 
                      alt={item.title} 
                      className="w-full h-full object-cover rounded-[13px]" 
                    />
                  </div>
                  <span 
                    className={`text-xs tracking-tight truncate max-w-[114px] text-center ${
                      isActive 
                        ? 'text-stone-900 font-bold' 
                        : 'text-stone-500 font-medium'
                    }`}
                  >
                    {item.shortTitle || item.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* MOBILE PREVIEW ONLY: Property Cards designed exactly per User Reference Image 1 */}
          <div className="sm:hidden relative w-full">
            {/* Subtle Dotted Background Pattern Accent from Reference Screenshot */}
            <div 
              className="absolute -top-3 -bottom-3 -left-4 w-12 opacity-35 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px)',
                backgroundSize: '12px 12px'
              }}
            />
            <div 
              className="absolute -top-3 -bottom-3 -right-4 w-12 opacity-35 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px)',
                backgroundSize: '12px 12px'
              }}
            />

            <div 
              ref={mobileTopPicksScrollRef}
              onScroll={handleMobileCarouselScroll}
              className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth pb-3 pt-1 -mx-4 px-4 relative z-10"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {TOP_PICKS.map((project, idx) => {
                return (
                  <div
                    key={`mob-card-${project.id}`}
                    id={`mobile-top-pick-${idx}`}
                    data-card="mobile-top-pick"
                    className="snap-start shrink-0 w-[82vw] max-w-[315px] flex flex-col"
                  >
                    {/* A. Top Builder Speech-Bubble Card with downward notch */}
                    <div className="relative mb-3.5 bg-white rounded-2xl p-3 border border-indigo-200/90 shadow-[0_4px_16px_rgba(94,35,220,0.06)]">
                      <div className="flex items-center gap-2.5">
                        {/* Builder Brand Logo */}
                        <div className="w-11 h-11 rounded-xl bg-stone-50 border border-stone-200/60 p-1 flex items-center justify-center shrink-0 shadow-xs">
                          {project.developerType === 'anuhar' ? (
                            <svg viewBox="0 0 36 36" className="w-7 h-7">
                              <polygon points="6,6 30,18 16,30 14,21 23,18 14,15" fill="#f59e0b" />
                            </svg>
                          ) : project.developerType === 'allegro' ? (
                            <div className="w-8 h-8 rounded-full border border-emerald-600/40 flex items-center justify-center p-0.5">
                              <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-700 fill-current">
                                <path d="M12 2a4 4 0 0 0-4 4c0 1.6.9 3 2.2 3.6A4 4 0 0 0 8 16c1.6 0 3-.9 3.6-2.2A4 4 0 0 0 16 16a4 4 0 0 0 2.2-3.6 4 4 0 0 0-2.2-6.8A4 4 0 0 0 12 2zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm-4 6a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm8 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                              </svg>
                            </div>
                          ) : project.developerType === 'lansum' ? (
                            <div className="flex flex-col items-center justify-center text-center">
                              <span className="text-[10px] font-black tracking-tighter text-[#0f4c81] leading-none">LANSU</span>
                              <span className="text-[5px] tracking-widest text-[#0f4c81]/70 font-bold">PROPERTIES</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-center">
                              <svg viewBox="0 0 36 24" className="w-6 h-3.5">
                                <path d="M18 2 L30 14 L26 14 L18 6 L10 14 L6 14 Z" fill="#e11d48" />
                                <path d="M18 7 L28 17 L24 17 L18 11 L12 17 L8 17 Z" fill="#16a34a" />
                              </svg>
                              <span className="text-[5px] font-black tracking-tight text-stone-800 leading-tight">VENKATESH</span>
                            </div>
                          )}
                        </div>

                        {/* Developer Info & Key Metrics */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-[13px] font-bold text-stone-900 truncate">
                              {project.developerShort || project.developer}
                            </h4>
                            <button 
                              type="button" 
                              onClick={() => onNavigate('search')} 
                              className="text-stone-400 hover:text-[#5e23dc] shrink-0 p-0.5 cursor-pointer"
                              title="View Builder Projects"
                            >
                              <span className="material-symbols-outlined text-[16px] text-stone-500">open_in_new</span>
                            </button>
                          </div>

                          {/* Estd & Projects Metrics Columns */}
                          <div className="flex items-center gap-5 mt-1">
                            <div>
                              <span className="text-xs font-bold text-stone-900 block leading-tight">{project.yearEstd || '2005'}</span>
                              <span className="text-[10px] text-stone-500">Year estd.</span>
                            </div>
                            <div>
                              <span className="text-xs font-bold text-stone-900 block leading-tight">{project.projectsCount || '25'}</span>
                              <span className="text-[10px] text-stone-500">Projects</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Downward Speech Bubble Tail pointing to property card */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-2 overflow-hidden pointer-events-none">
                        <div className="w-2.5 h-2.5 bg-white border-r border-b border-indigo-200 rotate-45 transform origin-top-left translate-x-1.5 -translate-y-1 shadow-xs" />
                      </div>
                    </div>

                    {/* B. Bottom Full-Bleed Property Photo Card */}
                    <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.12)] bg-stone-900 h-[340px] flex flex-col justify-between border border-stone-800/10">
                      {/* Architectural background photo */}
                      <img
                        src={project.image}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />

                      {/* Top Center White Bar / Handle */}
                      <div className="relative z-10 pt-3 flex justify-center">
                        <div className="w-8 h-1 bg-white/90 rounded-full shadow-xs" />
                      </div>

                      {/* Bottom Dark Gradient Scrim & Info */}
                      <div className="relative z-10 mt-auto pt-16 pb-4 px-4 bg-gradient-to-t from-black/95 via-black/75 to-transparent text-white">
                        <h3 className="text-base font-bold text-white tracking-tight leading-snug truncate">
                          {project.shortTitle || project.title}
                        </h3>
                        <p className="text-xs text-stone-300 mt-0.5 truncate">
                          {project.location}
                        </p>
                        <p className="text-xs text-stone-300 mt-0.5 truncate">
                          {project.config}
                        </p>

                        {/* Price + White Contact Button with Purple Text */}
                        <div className="flex items-center justify-between gap-3 mt-3 pt-1">
                          <div className="text-base font-bold text-white tracking-tight">
                            {project.price}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenContact(project)}
                            className="px-4 py-1.5 bg-white text-[#5e23dc] font-bold text-xs rounded-xl shadow-md hover:bg-stone-50 active:scale-95 transition-all cursor-pointer"
                          >
                            Contact
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DESKTOP & TABLET ONLY: Main Horizontal Showcase Container - STRICTLY UNCHANGED */}
          <div className="hidden sm:block relative w-full group/carousel">
            <div 
              ref={topPicksScrollRef}
              onScroll={handleCarouselScroll}
              className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth pb-4 pt-1 px-1 -mx-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {TOP_PICKS.map((project, idx) => {
                const isVenkatesh = project.developerType === 'venkatesh';

                return (
                  <div
                    key={project.id}
                    id={`top-pick-${idx}`}
                    data-card="top-pick"
                    className="snap-start flex-shrink-0 w-[94vw] sm:w-[86vw] md:w-[840px] lg:w-[920px] md:h-[390px] bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.06)] border border-pink-100/60 flex flex-col md:flex-row transition-all duration-300"
                  >
                    {/* Left Column: Soft Lavender / Blush Gradient */}
                    <div className="w-full md:w-[320px] lg:w-[340px] bg-gradient-to-br from-[#f8f6fc] via-[#faf7f9] to-[#fbf0f4] p-4 sm:p-7 flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r border-purple-50">
                      <div>
                        {/* Developer Logo and Info */}
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white shadow-xs border border-stone-200/70 p-1.5 sm:p-2 flex items-center justify-center shrink-0">
                            {isVenkatesh ? (
                              <div className="flex flex-col items-center justify-center text-center">
                                <svg viewBox="0 0 36 24" className="w-7 h-4 sm:w-8 sm:h-5">
                                  <path d="M18 2 L30 14 L26 14 L18 6 L10 14 L6 14 Z" fill="#e11d48" />
                                  <path d="M18 7 L28 17 L24 17 L18 11 L12 17 L8 17 Z" fill="#16a34a" />
                                </svg>
                                <span className="text-[6px] sm:text-[6.5px] font-black tracking-tight text-stone-800 leading-tight">VENKATESH</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center text-center">
                                <span className="text-xs sm:text-[13px] font-black tracking-tighter text-[#0f4c81] leading-none">LANSU</span>
                                <span className="text-[5px] sm:text-[5.5px] tracking-widest text-[#0f4c81]/70 font-bold">PROPERTIES</span>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-[13px] font-bold text-stone-900 leading-snug truncate">
                              {project.developer}
                            </h4>
                            <button 
                              type="button"
                              onClick={() => onNavigate('search')}
                              className="text-[11px] sm:text-xs text-[#5e23dc] font-semibold hover:underline block mt-0.5 cursor-pointer text-left"
                            >
                              View Projects
                            </button>
                          </div>
                        </div>

                        {/* Project Title & Location */}
                        <div className="mt-4 sm:mt-6">
                          <h3 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                            {project.title.replace('...', '')}
                          </h3>
                          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
                            {project.location}
                          </p>
                        </div>

                        {/* Pricing & BHK Configuration */}
                        <div className="mt-3.5 sm:mt-6">
                          <div className="text-lg sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                            {project.price}
                          </div>
                          <div className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
                            {project.config}
                          </div>
                        </div>
                      </div>

                      {/* Contact Button */}
                      <div className="mt-4 sm:mt-6">
                        <button
                          type="button"
                          onClick={() => handleOpenContact(project)}
                          className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-[#5e23dc] hover:bg-[#4d1bb9] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center cursor-pointer min-h-[44px]"
                        >
                          Contact
                        </button>
                      </div>
                    </div>

                    {/* Right Column: Architectural Hero Render */}
                    <div className="flex-1 relative min-h-[200px] sm:min-h-[300px] md:min-h-[390px] overflow-hidden bg-stone-900 group/image">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none" />

                      {/* Top Right: MahaRERA Badge & Circular Pause Button */}
                      <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 flex items-center gap-1.5 sm:gap-2 z-10">
                        <div className="bg-black/65 backdrop-blur-md text-white rounded-lg px-2 sm:px-2.5 py-1 sm:py-1.5 flex items-center gap-1.5 sm:gap-2 border border-white/20 text-[9px] sm:text-[11px] shadow-lg">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white p-0.5 rounded shrink-0 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-full h-full fill-black">
                              <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v2h-4v-2zm0 4h4v2h-4v-2zm-4-4h2v6h-2v-6zm-2 2h2v2h-2v-2zm4-6h2v2h-2v-2zm2 2h2v2h-2v-2z" />
                            </svg>
                          </div>
                          <div className="leading-tight">
                            <div className="font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                              <span>MahaRERA: {project.reraId.substring(0, 9)}...</span>
                            </div>
                            <span className="text-white/60 text-[8px] sm:text-[9px] block">maharera.maharashtra.gov.in</span>
                          </div>
                        </div>

                        {/* Video Pause / Play Button */}
                        <button
                          type="button"
                          onClick={() => setIsMediaPlaying(!isMediaPlaying)}
                          title={isMediaPlaying ? "Pause preview" : "Play preview"}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md text-white flex items-center justify-center border border-white/20 shadow-md transition-all cursor-pointer"
                        >
                          {isMediaPlaying ? (
                            <span className="material-symbols-outlined text-sm sm:text-base">pause</span>
                          ) : (
                            <span className="material-symbols-outlined text-sm sm:text-base">play_arrow</span>
                          )}
                        </button>
                      </div>

                      {/* Center-Left: Luxury Project Insignia with Warm Glow matching screenshot */}
                      <div className="absolute top-1/2 left-4 sm:left-10 -translate-y-1/2 max-w-[260px] sm:max-w-[300px] pointer-events-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] flex flex-col items-center sm:items-start text-center sm:text-left">
                        {/* Soft Warm Halo */}
                        <div 
                          className="absolute -inset-6 -z-10 rounded-full blur-xl pointer-events-none"
                          style={{
                            background: 'radial-gradient(circle, rgba(254,240,138,0.35) 0%, rgba(251,191,36,0.15) 50%, transparent 80%)'
                          }}
                        />
                        <div className="text-amber-300 flex items-center justify-center mb-1">
                          <svg className="w-7 h-7 sm:w-10 sm:h-10 fill-amber-300" viewBox="0 0 40 40">
                            <path d="M20 4 C15 10, 8 16, 8 24 C8 31, 14 36, 20 36 C26 36, 32 31, 32 24 C32 16, 25 10, 20 4 Z M20 12 C23 16, 26 20, 26 24 C26 27, 23 30, 20 30 C17 30, 14 27, 14 24 C14 20, 17 16, 20 12 Z" opacity="0.95" />
                          </svg>
                        </div>
                        <div className="text-white font-black tracking-wider text-base sm:text-2xl uppercase">
                          {project.title.replace('...', '')}
                        </div>
                        <div className="text-amber-200/90 text-[10px] sm:text-[13px] font-semibold tracking-wide uppercase mt-0.5">
                          {project.tagline}
                        </div>
                      </div>

                      {/* Bottom Right: Developer Luxe Brand Badge */}
                      <div className="absolute bottom-2.5 right-2.5 sm:bottom-4 sm:right-4 bg-black/75 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg border border-white/15 text-right">
                        <div className="text-[9px] sm:text-[11px] font-extrabold tracking-wider text-white uppercase">
                          {project.badge}
                        </div>
                        <div className="text-[8px] sm:text-[9px] text-stone-300 tracking-tight">
                          {project.subBadge} • {project.website}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Floating Circular Right Arrow Navigation Button (Overlapping Card Edge as in Screenshot - hidden on mobile for clean touch swipe) */}
            <button
              type="button"
              onClick={() => handleScrollTopPicks('right')}
              className="hidden sm:flex absolute right-2 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white text-stone-800 shadow-[0_8px_30px_rgba(0,0,0,0.22)] hover:shadow-[0_10px_35px_rgba(0,0,0,0.28)] border border-stone-100 items-center justify-center hover:scale-110 active:scale-95 transition-all z-20 cursor-pointer"
              aria-label="Scroll right"
            >
              <span className="material-symbols-outlined text-2xl font-bold">arrow_forward</span>
            </button>

            {/* Floating Circular Left Arrow Button (Available when scrolled - hidden on mobile for clean touch swipe) */}
            {activeTopPickIndex > 0 && (
              <button
                type="button"
                onClick={() => handleScrollTopPicks('left')}
                className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white text-stone-800 shadow-[0_8px_30px_rgba(0,0,0,0.22)] hover:shadow-[0_10px_35px_rgba(0,0,0,0.28)] border border-stone-100 items-center justify-center hover:scale-110 active:scale-95 transition-all z-20 cursor-pointer"
                aria-label="Scroll left"
              >
                <span className="material-symbols-outlined text-2xl font-bold">arrow_back</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. NEW SECTIONS AS REQUESTED FROM REFERENCE IMAGES */}
      {/* ============================================================ */}

      {/* 4A. High-demand projects to invest now */}
      <section className="w-full pt-10 sm:pt-14 pb-8 sm:pb-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-[28px] font-bold text-stone-900 tracking-tight">
              High-demand projects to invest now
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5 sm:mt-1">
              Leading projects in high demand
            </p>
          </div>

          <div className="relative">
            <div 
              ref={highDemandScrollRef}
              className="grid grid-rows-2 grid-flow-col gap-3 sm:gap-4 auto-cols-[280px] sm:auto-cols-[370px] overflow-x-auto no-scrollbar scroll-smooth pb-3"
            >
              {/* Combine row 1 and row 2 in pairs to fill columns 1 to 5 */}
              {HIGH_DEMAND_PROJECTS_ROW_1.map((p1, idx) => {
                const p2 = HIGH_DEMAND_PROJECTS_ROW_2[idx];
                return (
                  <React.Fragment key={p1.id}>
                    {/* Top Row Card */}
                    <div 
                      onClick={() => setSelectedNewlyAdded({
                        id: p1.id,
                        title: p1.title,
                        config: p1.config,
                        location: p1.location,
                        price: p1.price,
                        image: p1.image
                      })}
                      className="bg-white border border-stone-200/90 rounded-xl overflow-hidden flex h-[120px] sm:h-[132px] shadow-xs hover:shadow-md transition-shadow cursor-pointer group"
                    >
                      <img 
                        src={p1.image} 
                        alt={p1.title} 
                        className="w-[105px] sm:w-[124px] h-full object-cover shrink-0 group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate group-hover:text-[#5e23dc] transition-colors">
                            {p1.title}
                          </h4>
                          <p className="text-[10px] sm:text-[11px] text-stone-500 truncate mt-0.5">
                            {p1.developer}
                          </p>
                          <p className="text-[11px] sm:text-xs text-stone-600 truncate mt-0.5 sm:mt-1">
                            {p1.config}
                          </p>
                          <p className="text-[10px] sm:text-xs text-stone-400 truncate">
                            {p1.location}
                          </p>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-stone-900">
                          {p1.price}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Row Card */}
                    {p2 && (
                      <div 
                        onClick={() => setSelectedNewlyAdded({
                          id: p2.id,
                          title: p2.title,
                          config: p2.config,
                          location: p2.location,
                          price: p2.price,
                          image: p2.image
                        })}
                        className="bg-white border border-stone-200/90 rounded-xl overflow-hidden flex h-[120px] sm:h-[132px] shadow-xs hover:shadow-md transition-shadow cursor-pointer group"
                      >
                        <img 
                          src={p2.image} 
                          alt={p2.title} 
                          className="w-[105px] sm:w-[124px] h-full object-cover shrink-0 group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1 min-w-0">
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate group-hover:text-[#5e23dc] transition-colors">
                              {p2.title}
                            </h4>
                            <p className="text-[10px] sm:text-[11px] text-stone-500 truncate mt-0.5">
                              {p2.developer}
                            </p>
                            <p className="text-[11px] sm:text-xs text-stone-600 truncate mt-0.5 sm:mt-1">
                              {p2.config}
                            </p>
                            <p className="text-[10px] sm:text-xs text-stone-400 truncate">
                              {p2.location}
                            </p>
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-stone-900">
                            {p2.price}
                          </p>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Floating Circular Right Arrow Button */}
            <button
              type="button"
              onClick={() => scrollHorizontally(highDemandScrollRef, 380)}
              className="hidden sm:flex absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg border border-stone-200 items-center justify-center text-stone-700 hover:text-stone-950 hover:shadow-xl hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer"
              aria-label="Scroll right"
            >
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </div>

        </div>
      </section>

      {/* 4B. Recommended sellers */}
      <section className="w-full py-8 sm:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-[28px] font-bold text-stone-900 tracking-tight">
              Recommended sellers
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5 sm:mt-1">
              Sellers with complete knowledge about locality
            </p>
          </div>

          <div className="relative">
            <div 
              ref={sellersScrollRef}
              className="grid grid-rows-2 grid-flow-col gap-3 sm:gap-4 auto-cols-[245px] sm:auto-cols-[290px] overflow-x-auto no-scrollbar scroll-smooth pb-3"
            >
              {RECOMMENDED_SELLERS_ROW_1.map((s1, idx) => {
                const s2 = RECOMMENDED_SELLERS_ROW_2[idx];
                return (
                  <React.Fragment key={s1.id}>
                    {/* Top Row Seller Card */}
                    <div className="bg-white border border-stone-200/90 rounded-xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
                      {/* Colored Top Header */}
                      <div className={`px-3 sm:px-3.5 py-2 sm:py-2.5 flex items-center justify-between ${s1.headerBg} ${s1.headerTextColor}`}>
                        <div className="flex items-center gap-2 min-w-0">
                          {s1.avatarType === 'pattern' && (
                            <div className="w-6 h-6 rounded-md bg-blue-400/30 flex items-center justify-center text-blue-800 text-[10px] font-bold shrink-0">
                              <span className="material-symbols-outlined text-sm">domain</span>
                            </div>
                          )}
                          {s1.avatarType === 'gold' && (
                            <div className="w-6 h-6 rounded-md bg-amber-400/20 flex items-center justify-center text-amber-300 text-[10px] font-bold shrink-0">
                              <span className="material-symbols-outlined text-sm">workspace_premium</span>
                            </div>
                          )}
                          {s1.avatarType === 'as' && (
                            <div className="w-6 h-6 rounded-md bg-amber-500 text-stone-950 flex items-center justify-center text-[10px] font-extrabold shrink-0">
                              {s1.avatarText || 'AS'}
                            </div>
                          )}
                          {s1.avatarType === 'crest' && (
                            <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                              <span className="material-symbols-outlined text-sm">shield</span>
                            </div>
                          )}
                          <span className="text-xs font-bold truncate">{s1.name}</span>
                        </div>
                        <span className="material-symbols-outlined text-sm shrink-0">chevron_right</span>
                      </div>

                      {/* Body */}
                      <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1 gap-2 sm:gap-2.5">
                        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-stone-600">
                          <span><strong className="text-stone-900 font-bold">{s1.experience}</strong> Exp</span>
                          <span className="text-stone-300">|</span>
                          <span><strong className="text-stone-900 font-bold">{s1.listings}</strong> listings</span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {s1.tags.map((t) => (
                            <span key={t} className="text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Show Contact Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedSeller(s1)}
                          className="w-full py-1.5 sm:py-2 rounded-lg border border-[#5e23dc] text-[#5e23dc] hover:bg-[#5e23dc] hover:text-white transition-colors text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer mt-1 min-h-[38px]"
                        >
                          <span className="material-symbols-outlined text-sm">call</span>
                          <span>Show Contact</span>
                        </button>
                      </div>
                    </div>

                    {/* Bottom Row Seller Card */}
                    {s2 && (
                      <div className="bg-white border border-stone-200/90 rounded-xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
                        {/* Header */}
                        <div className={`px-3 sm:px-3.5 py-2 sm:py-2.5 flex items-center justify-between ${s2.headerBg} ${s2.headerTextColor}`}>
                          <div className="flex items-center gap-2 min-w-0">
                            {s2.avatarType === 'yuga' && (
                              <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center text-[9px] font-extrabold shrink-0">
                                YUGA
                              </div>
                            )}
                            {s2.avatarType === 'dr' && (
                              <div className="w-6 h-6 rounded-md bg-amber-400 text-stone-950 flex items-center justify-center text-[10px] font-extrabold shrink-0">
                                DR
                              </div>
                            )}
                            {s2.avatarType === 'sr' && (
                              <div className="w-6 h-6 rounded-md bg-stone-900 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                                SR
                              </div>
                            )}
                            {s2.avatarType === 'vedanshu' && (
                              <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold shrink-0">
                                <span className="material-symbols-outlined text-sm">cottage</span>
                              </div>
                            )}
                            {s2.avatarType === 'as' && (
                              <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                                {s2.avatarText || 'PE'}
                              </div>
                            )}
                            <span className="text-xs font-bold truncate">{s2.name}</span>
                          </div>
                          <span className="material-symbols-outlined text-sm shrink-0">chevron_right</span>
                        </div>

                        {/* Body */}
                        <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1 gap-2 sm:gap-2.5">
                          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-stone-600">
                            <span><strong className="text-stone-900 font-bold">{s2.experience}</strong> Exp</span>
                            <span className="text-stone-300">|</span>
                            <span><strong className="text-stone-900 font-bold">{s2.listings}</strong> listings</span>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {s2.tags.map((t) => (
                              <span key={t} className="text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">
                                {t}
                              </span>
                            ))}
                          </div>

                          {/* Show Contact Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedSeller(s2)}
                            className="w-full py-1.5 sm:py-2 rounded-lg border border-[#5e23dc] text-[#5e23dc] hover:bg-[#5e23dc] hover:text-white transition-colors text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer mt-1 min-h-[38px]"
                          >
                            <span className="material-symbols-outlined text-sm">call</span>
                            <span>Show Contact</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Floating Circular Right Arrow Button */}
            <button
              type="button"
              onClick={() => scrollHorizontally(sellersScrollRef, 320)}
              className="hidden sm:flex absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg border border-stone-200 items-center justify-center text-stone-700 hover:text-stone-950 hover:shadow-xl hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer"
              aria-label="Scroll right"
            >
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </div>

        </div>
      </section>

      {/* 4C. Newly-added properties */}
      <section className="w-full py-8 sm:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-[28px] font-bold text-stone-900 tracking-tight">
              Newly-added properties
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5 sm:mt-1">
              Fresh listings to check out
            </p>
          </div>

          <div className="relative">
            <div 
              ref={newlyAddedScrollRef}
              className="flex gap-3.5 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-3"
            >
              {NEWLY_ADDED_PROPERTIES.map((prop) => (
                <div 
                  key={prop.id}
                  className="min-w-[240px] max-w-[240px] sm:min-w-[270px] sm:max-w-[270px] bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
                >
                  <div className="relative h-36 sm:h-44 w-full overflow-hidden bg-stone-100">
                    <img 
                      src={prop.image} 
                      alt={prop.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-3 sm:p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate group-hover:text-[#5e23dc] transition-colors">
                        {prop.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-stone-600 mt-0.5 sm:mt-1 truncate">
                        {prop.config}
                      </p>
                      <p className="text-[10px] sm:text-xs text-stone-400 truncate">
                        {prop.location}
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-stone-900 mt-1.5 sm:mt-2.5">
                        {prop.price}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedNewlyAdded(prop)}
                      className="mt-3 px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg border border-[#5e23dc] text-[#5e23dc] hover:bg-[#5e23dc] hover:text-white transition-colors text-xs font-bold w-fit cursor-pointer min-h-[36px]"
                    >
                      Contact
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Floating Circular Right Arrow Button */}
            <button
              type="button"
              onClick={() => scrollHorizontally(newlyAddedScrollRef, 300)}
              className="hidden sm:flex absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg border border-stone-200 items-center justify-center text-stone-700 hover:text-stone-950 hover:shadow-xl hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer"
              aria-label="Scroll right"
            >
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </div>

        </div>
      </section>

      {/* 4D. Have a property to sell? Banner */}
      <section className="w-full pt-4 pb-10 sm:pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          <h2 className="text-xl sm:text-[28px] font-bold text-stone-900 tracking-tight mb-3 sm:mb-5">
            Have a property to sell?
          </h2>

          <div className="w-full bg-[#faf8fd] rounded-2xl sm:rounded-3xl border border-stone-200/90 relative overflow-hidden shadow-xs flex flex-col md:flex-row items-center justify-between min-h-[150px] sm:min-h-[170px] p-5 sm:p-6 lg:px-10">
            
            {/* Left Graphic: Hand holding key over city skyline in purple tones */}
            <div className="hidden md:flex items-center shrink-0 w-64 lg:w-80 h-36 relative select-none">
              <svg viewBox="0 0 320 144" fill="none" className="w-full h-full">
                {/* Background City Skyline Silhouettes */}
                <path d="M10 144V90H35V144M40 144V60H75V144M80 144V80H110V144M115 144V100H145V144M150 144V70H185V144" fill="#e9e5fc" />
                <path d="M25 144V105H45V144M60 144V85H85V144M95 144V110H125V144M135 144V95H160V144" fill="#d9d2fa" />
                
                {/* Hand reaching out from left holding key */}
                <path 
                  d="M0 135L40 90C48 82 62 82 72 88L115 78C125 76 138 82 142 92C144 98 140 106 132 108L105 114L120 114C126 114 130 119 128 125C126 130 120 134 114 134L85 135" 
                  fill="#ff6b9d" 
                />
                {/* Sleeve / Arm */}
                <path d="M0 100L45 88L55 144H0V100Z" fill="#5e23dc" />
                
                {/* Key Ring and Key */}
                <circle cx="152" cy="115" r="9" stroke="#9333ea" strokeWidth="3" fill="none" />
                <rect x="150" y="123" width="5" height="18" rx="2" fill="#e11d48" />
                <rect x="155" y="132" width="6" height="3" rx="1" fill="#e11d48" />
                <rect x="155" y="137" width="4" height="3" rx="1" fill="#e11d48" />

                {/* Sparkling Star */}
                <path d="M175 75L177 82L184 84L177 86L175 93L173 86L166 84L173 82Z" fill="#a855f7" />
                <path d="M220 110L221 114L225 115L221 116L220 120L219 116L215 115L219 114Z" fill="#c084fc" />
              </svg>
            </div>

            {/* Center Call to Action */}
            <div className="flex flex-col items-center justify-center text-center z-10 py-3 px-4 max-w-md mx-auto">
              <p className="text-base sm:text-lg lg:text-xl font-medium text-stone-900 mb-4 tracking-tight">
                List your property &amp; connect with clients faster!
              </p>
              <button
                type="button"
                onClick={() => onNavigate('post-property')}
                className="px-8 py-2.5 rounded-xl border border-[#5e23dc] text-[#5e23dc] hover:bg-[#5e23dc] hover:text-white font-semibold text-sm transition-all shadow-xs cursor-pointer active:scale-95 bg-white"
              >
                Sell your property
              </button>
            </div>

            {/* Right Graphic: Cheerful clients/sellers in vibrant colors */}
            <div className="hidden md:flex items-center justify-end shrink-0 w-64 lg:w-80 h-36 relative select-none">
              <svg viewBox="0 0 320 144" fill="none" className="w-full h-full">
                {/* Background Soft Wave */}
                <path d="M80 144C140 100 240 105 320 144H80Z" fill="#ede8fb" />
                
                {/* Car Silhouette */}
                <path d="M140 144L170 125C190 120 230 120 260 126L300 144H140Z" fill="#c7d2fe" opacity="0.6" />

                {/* Character 1: Woman in blue */}
                {/* Head */}
                <circle cx="215" cy="62" r="11" fill="#fbcfe8" />
                <path d="M206 58C206 50 224 50 224 58C224 64 220 68 215 68C210 68 206 64 206 58Z" fill="#1e1b4b" />
                {/* Body/Jacket */}
                <path d="M202 85C202 75 228 75 228 85V144H202V85Z" fill="#3b82f6" />
                <rect x="210" y="75" width="10" height="20" rx="4" fill="#ffffff" />

                {/* Character 2: Man in vibrant magenta/pink */}
                {/* Head */}
                <circle cx="255" cy="56" r="13" fill="#fed7aa" />
                <path d="M243 52C243 42 267 42 267 52C267 58 261 62 255 62C249 62 243 58 243 52Z" fill="#312e81" />
                {/* Body */}
                <path d="M236 82C236 70 274 70 274 82V144H236V82Z" fill="#e11d48" />
                <path d="M248 80L255 95L262 80" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Housing Edge Solutions Redesigned */}
      <section id="edge-services" className="w-full py-8 sm:py-20 bg-[#eef1f6] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* Header */}
          <div className="mb-4 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2.5">
              <span className="material-symbols-outlined text-base sm:text-xl text-[#5e23dc]">domain_verification</span>
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-[#5e23dc]">
                DIGITAL REAL ESTATE SERVICES
              </span>
            </div>
            <h2 className="text-xl sm:text-4xl lg:text-[42px] font-extrabold text-stone-900 tracking-tight leading-tight">
              Vindhya Edge Ecosystem
            </h2>
            <p className="text-xs sm:text-base text-stone-500 mt-1 sm:mt-2 font-normal max-w-2xl">
              End-to-end digital assistance for mortgages, legal agreements, relocations, and valuation
            </p>
          </div>

          {/* 4 Clean Action Cards - Compact 2x2 grid on mobile for professional look, unchanged on desktop/tablet */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
            
            {/* Card 1: Pre-Approved Home Loans */}
            <div 
              onClick={() => onNavigate('product')}
              className="bg-white p-3 sm:p-8 rounded-xl sm:rounded-[28px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] sm:shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group border border-stone-200/60 sm:border-stone-200/50 cursor-pointer"
            >
              <div>
                <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-[#efeafc] flex items-center justify-center text-[#5e23dc] group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-base sm:text-2xl font-light">real_estate_agent</span>
                </div>
                <h3 className="text-xs sm:text-[20px] font-bold text-stone-900 mt-2 sm:mt-6 tracking-tight leading-snug group-hover:text-[#5e23dc] transition-colors line-clamp-2">
                  Pre-Approved Home Loans
                </h3>
                <p className="text-[10px] sm:text-[13px] text-stone-500 mt-1 sm:mt-3 leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                  Interest rates starting from <strong className="text-stone-900 font-bold">8.35% p.a.</strong> from SBI, HDFC, and ICICI with instant paperless sanction.
                </p>
              </div>
              <div className="mt-2.5 sm:mt-8 pt-2 sm:pt-5 flex items-center justify-between border-t border-stone-100">
                <span className="text-[10px] sm:text-sm font-bold text-[#5e23dc] truncate">Check Eligibility</span>
                <span className="material-symbols-outlined text-[#5e23dc] text-sm sm:text-xl group-hover:translate-x-1.5 transition-transform shrink-0">arrow_forward</span>
              </div>
            </div>

            {/* Card 2: Online Rent Agreement */}
            <div 
              onClick={() => onNavigate('search')}
              className="bg-white p-3 sm:p-8 rounded-xl sm:rounded-[28px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] sm:shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group border border-stone-200/60 sm:border-stone-200/50 cursor-pointer"
            >
              <div>
                <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-[#d5f9e6] flex items-center justify-center text-[#059669] group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-base sm:text-2xl font-light">description</span>
                </div>
                <h3 className="text-xs sm:text-[20px] font-bold text-stone-900 mt-2 sm:mt-6 tracking-tight leading-snug group-hover:text-[#059669] transition-colors line-clamp-2">
                  Online Rent Agreement
                </h3>
                <p className="text-[10px] sm:text-[13px] text-stone-500 mt-1 sm:mt-3 leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                  Legally compliant digital agreements with Aadhaar e-Sign and biometric doorstep verification delivery.
                </p>
              </div>
              <div className="mt-2.5 sm:mt-8 pt-2 sm:pt-5 flex items-center justify-between border-t border-stone-100">
                <span className="text-[10px] sm:text-sm font-bold text-[#059669] truncate">Create in 5 Mins</span>
                <span className="material-symbols-outlined text-[#059669] text-sm sm:text-xl group-hover:translate-x-1.5 transition-transform shrink-0">arrow_forward</span>
              </div>
            </div>

            {/* Card 3: Packers & Movers */}
            <div 
              onClick={() => onNavigate('search')}
              className="bg-white p-3 sm:p-8 rounded-xl sm:rounded-[28px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] sm:shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group border border-stone-200/60 sm:border-stone-200/50 cursor-pointer"
            >
              <div>
                <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-[#fee2e2] flex items-center justify-center text-[#991b1b] group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-base sm:text-2xl font-light">local_shipping</span>
                </div>
                <h3 className="text-xs sm:text-[20px] font-bold text-stone-900 mt-2 sm:mt-6 tracking-tight leading-snug group-hover:text-[#991b1b] transition-colors line-clamp-2">
                  Packers &amp; Movers
                </h3>
                <p className="text-[10px] sm:text-[13px] text-stone-500 mt-1 sm:mt-3 leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                  Guaranteed damage-free relocation with dedicated move manager and upfront transparent quotes.
                </p>
              </div>
              <div className="mt-2.5 sm:mt-8 pt-2 sm:pt-5 flex items-center justify-between border-t border-stone-100">
                <span className="text-[10px] sm:text-sm font-bold text-[#991b1b] truncate">Instant Quote</span>
                <span className="material-symbols-outlined text-[#991b1b] text-sm sm:text-xl group-hover:translate-x-1.5 transition-transform shrink-0">arrow_forward</span>
              </div>
            </div>

            {/* Card 4: Property Price Calculator */}
            <div 
              onClick={() => onNavigate('search')}
              className="bg-white p-3 sm:p-8 rounded-xl sm:rounded-[28px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] sm:shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group border border-stone-200/60 sm:border-stone-200/50 cursor-pointer"
            >
              <div>
                <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-[#eae7e7] flex items-center justify-center text-stone-900 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-base sm:text-2xl font-light">calculate</span>
                </div>
                <h3 className="text-xs sm:text-[20px] font-bold text-stone-900 mt-2 sm:mt-6 tracking-tight leading-snug group-hover:text-black transition-colors line-clamp-2">
                  Property Price Calculator
                </h3>
                <p className="text-[10px] sm:text-[13px] text-stone-500 mt-1 sm:mt-3 leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                  AI-driven comparative valuation model based on historical registry trends, demand curves, and local amenities.
                </p>
              </div>
              <div className="mt-2.5 sm:mt-8 pt-2 sm:pt-5 flex items-center justify-between border-t border-stone-100">
                <span className="text-[10px] sm:text-sm font-bold text-stone-900 truncate">Estimate Value</span>
                <span className="material-symbols-outlined text-stone-900 text-sm sm:text-xl group-hover:translate-x-1.5 transition-transform shrink-0">arrow_forward</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. High-Conversion Owner Property Call-to-Action */}
      <section className="w-full py-10 sm:py-16 bg-gradient-to-br from-[#4500b4] to-[#5e23dc] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-10">
          <div className="max-w-2xl space-y-3 sm:space-y-4">
            <span className="px-3 py-1 rounded-full bg-[#69f9e0] text-[#00201b] text-[11px] sm:text-xs uppercase tracking-wider font-extrabold inline-block">
              Zero Brokerage • 100% Free
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Post Your Property & Connect with 50,000+ Genuine Buyers
            </h2>
            <p className="text-sm sm:text-lg text-[#e8ddff] leading-relaxed">
              List your apartment, independent villa, or commercial space on India's most trusted real estate discovery platform. Zero hidden charges.
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-1 sm:pt-2 text-[11px] sm:text-xs font-semibold text-white">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="material-symbols-outlined text-[#66f6dd] text-base sm:text-lg">done_all</span>
                <span>Direct Buyer Enquiries</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="material-symbols-outlined text-[#66f6dd] text-base sm:text-lg">done_all</span>
                <span>Instant WhatsApp Alerts</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="material-symbols-outlined text-[#66f6dd] text-base sm:text-lg">done_all</span>
                <span>Free Photography</span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 sm:gap-4 w-full sm:w-auto">
            <button 
              onClick={() => onNavigate('post-property')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-[#4500b4] text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl shadow-xl hover:bg-[#f3f0fc] transition-all text-center cursor-pointer min-h-[44px]"
            >
              Post Property for Free
            </button>
            <button 
              onClick={() => onNavigate('product')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#5e23dc]/40 hover:bg-[#5e23dc]/60 text-white border border-[#e8ddff]/30 text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl transition-all text-center cursor-pointer min-h-[44px]"
            >
              Contact Relationship Manager
            </button>
          </div>
        </div>
      </section>

      {/* Top Pick Contact & Brochure Enquiry Modal */}
      {selectedTopPick && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedTopPick(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-40 w-full overflow-hidden bg-stone-900">
              <img 
                src={selectedTopPick.image} 
                alt={selectedTopPick.title} 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <button 
                type="button"
                onClick={() => setSelectedTopPick(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
              <div className="absolute bottom-3 left-4 text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                  {selectedTopPick.developer}
                </span>
                <h3 className="text-xl font-bold">{selectedTopPick.title}</h3>
                <p className="text-xs text-stone-300">{selectedTopPick.location} • {selectedTopPick.price}</p>
              </div>
            </div>

            <div className="p-6">
              {enquirySent ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                  </div>
                  <h4 className="text-lg font-bold text-stone-900">Enquiry Submitted!</h4>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto">
                    Thank you! A dedicated sales consultant from {selectedTopPick.developer} will reach out to you within 15 minutes.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendEnquiry} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Your Full Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={enquiryName}
                      onChange={(e) => setEnquiryName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#5e23dc] text-sm text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Phone Number</label>
                    <input 
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={enquiryPhone}
                      onChange={(e) => setEnquiryPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#5e23dc] text-sm text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Email (Optional)</label>
                    <input 
                      type="email"
                      placeholder="e.g. rahul@example.com"
                      value={enquiryEmail}
                      onChange={(e) => setEnquiryEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#5e23dc] text-sm text-stone-900"
                    />
                  </div>
                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#5e23dc] hover:bg-[#4d1bb9] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                    >
                      Request Immediate Callback
                    </button>
                    <a
                      href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hello, I am interested in ${selectedTopPick.title} located at ${selectedTopPick.location}. Please share the digital brochure and floor plans.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <span>Connect via WhatsApp</span>
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal for Seller Contact */}
      {selectedSeller && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => {
            setSelectedSeller(null);
            setSellerLeadSuccess(false);
          }}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-6 ${selectedSeller.headerBg} ${selectedSeller.headerTextColor} relative`}>
              <button 
                type="button"
                onClick={() => {
                  setSelectedSeller(null);
                  setSellerLeadSuccess(false);
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-black/10 text-[10px] font-bold uppercase tracking-wider">
                  Verified Local Expert
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight">{selectedSeller.name}</h3>
              <p className="text-xs opacity-80 mt-1">
                {selectedSeller.experience} Experience • {selectedSeller.listings} active properties
              </p>
            </div>

            <div className="p-6">
              {sellerLeadSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                  </div>
                  <h4 className="text-lg font-bold text-stone-900">Contact Request Sent!</h4>
                  <p className="text-xs text-stone-600 max-w-xs mx-auto">
                    {selectedSeller.name} will call you shortly on your provided phone number.
                  </p>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!leadContactName || !leadContactPhone) return;
                    setSellerLeadSuccess(true);
                    setTimeout(() => {
                      setSelectedSeller(null);
                      setSellerLeadSuccess(false);
                      setLeadContactName('');
                      setLeadContactPhone('');
                    }, 2500);
                  }} 
                  className="space-y-4"
                >
                  <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-stone-400 font-medium block">Direct Phone</span>
                      <span className="text-base font-bold text-stone-900">{selectedSeller.phone}</span>
                    </div>
                    <a
                      href={`tel:${selectedSeller.phone}`}
                      className="px-3.5 py-2 rounded-xl bg-[#5e23dc] text-white text-xs font-bold flex items-center gap-1 shadow-sm hover:bg-[#4d1bb9] transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">call</span> Call
                    </a>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Your Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={leadContactName}
                      onChange={(e) => setLeadContactName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#5e23dc] text-sm text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Your Mobile Number</label>
                    <input 
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={leadContactPhone}
                      onChange={(e) => setLeadContactPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#5e23dc] text-sm text-stone-900"
                    />
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#5e23dc] hover:bg-[#4d1bb9] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                    >
                      Request Callback
                    </button>
                    <a
                      href={`https://wa.me/919823045112?text=${encodeURIComponent(`Hello ${selectedSeller.name}, I am looking for properties in ${selectedSeller.tags.join(', ')}. Please share available options.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal for Newly-Added Property / Project Contact */}
      {selectedNewlyAdded && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => {
            setSelectedNewlyAdded(null);
            setNewlyAddedLeadSuccess(false);
          }}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-44 w-full overflow-hidden bg-stone-900">
              <img 
                src={selectedNewlyAdded.image} 
                alt={selectedNewlyAdded.title} 
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <button 
                type="button"
                onClick={() => {
                  setSelectedNewlyAdded(null);
                  setNewlyAddedLeadSuccess(false);
                }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
              <div className="absolute bottom-3 left-4 text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                  {selectedNewlyAdded.config}
                </span>
                <h3 className="text-xl font-bold">{selectedNewlyAdded.title}</h3>
                <p className="text-xs text-stone-300">{selectedNewlyAdded.location} • {selectedNewlyAdded.price}</p>
              </div>
            </div>

            <div className="p-6">
              {newlyAddedLeadSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                  </div>
                  <h4 className="text-lg font-bold text-stone-900">Brochure & Callback Requested!</h4>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto">
                    Thank you! The sales desk for {selectedNewlyAdded.title} will share the PDF brochure and call you shortly.
                  </p>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!leadContactName || !leadContactPhone) return;
                    setNewlyAddedLeadSuccess(true);
                    setTimeout(() => {
                      setSelectedNewlyAdded(null);
                      setNewlyAddedLeadSuccess(false);
                      setLeadContactName('');
                      setLeadContactPhone('');
                    }, 2500);
                  }} 
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Your Full Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Vikram Malhotra"
                      value={leadContactName}
                      onChange={(e) => setLeadContactName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#5e23dc] text-sm text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Phone Number</label>
                    <input 
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={leadContactPhone}
                      onChange={(e) => setLeadContactPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#5e23dc] text-sm text-stone-900"
                    />
                  </div>
                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#5e23dc] hover:bg-[#4d1bb9] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                    >
                      Get Instant Callback & Brochure
                    </button>
                    <a
                      href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hello, I want to inquire about ${selectedNewlyAdded.title} (${selectedNewlyAdded.config}) priced at ${selectedNewlyAdded.price}. Please share details.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <span>Direct WhatsApp Enquiry</span>
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
