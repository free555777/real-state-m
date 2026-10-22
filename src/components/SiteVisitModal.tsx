import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Car, 
  Video, 
  ShieldCheck 
} from 'lucide-react';
import { Property } from '../types/property';

interface SiteVisitModalProps {
  property: Property | null;
  onClose: () => void;
}

export const SiteVisitModal: React.FC<SiteVisitModalProps> = ({ property, onClose }) => {
  if (!property) return null;

  const [visitType, setVisitType] = useState<'in-person' | 'video'>('in-person');
  const [selectedDate, setSelectedDate] = useState('Tomorrow');
  const [selectedSlot, setSelectedSlot] = useState('11:00 AM - 01:00 PM');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [needCabPickup, setNeedCabPickup] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const dates = [
    { label: 'Today', sub: 'Urgent Slot' },
    { label: 'Tomorrow', sub: 'Recommended' },
    { label: 'This Weekend', sub: 'Saturday' },
    { label: 'Custom Date', sub: 'Pick Any' },
  ];

  const slots = [
    '10:00 AM - 12:00 PM',
    '12:00 PM - 02:00 PM',
    '03:00 PM - 05:00 PM',
    '05:00 PM - 07:00 PM (Sunset View)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setIsBooked(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl border border-[#e5e7eb] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:px-6 py-4 border-b border-[#e5e7eb] flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00bda6] text-white flex items-center justify-center shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#191919]">
                Book Free Site Visit
              </h2>
              <p className="text-xs text-[#6b7280]">
                {property.project || property.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#f2f3f8] text-[#6b7280] hover:text-[#191919] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isBooked ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-[#10b981]/15 text-[#10b981] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-[#191919]">Site Visit Confirmed!</h3>
            <div className="p-4 rounded-2xl bg-[#f8f9fd] border border-[#e5e7eb] text-xs text-left space-y-1.5 max-w-sm mx-auto">
              <div className="flex justify-between font-bold text-[#191919]">
                <span>Pass Code:</span>
                <span className="font-mono text-[#5e23dc]">VISIT-HP-{Math.floor(1000 + Math.random() * 9000)}</span>
              </div>
              <div className="flex justify-between text-[#434343]">
                <span>Date & Time:</span>
                <span className="font-semibold text-[#191919]">{selectedDate}, {selectedSlot}</span>
              </div>
              <div className="flex justify-between text-[#434343]">
                <span>Escort Agent:</span>
                <span className="font-semibold text-[#191919]">{property.agent.name}</span>
              </div>
              {needCabPickup && (
                <div className="text-[11px] text-[#00bda6] font-bold pt-1">
                  ✓ Complimentary doorstep cab pickup scheduled.
                </div>
              )}
            </div>
            <p className="text-xs text-[#6b7280]">
              Confirmation SMS & WhatsApp directions have been sent to {phone}.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#5e23dc] text-white font-bold text-xs hover:bg-[#4d1cb8] transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-4 flex-1 text-xs">
            {/* Visit mode: In person vs Virtual 3D Tour */}
            <div>
              <label className="block font-bold text-[#191919] mb-1.5 uppercase tracking-wider text-[11px]">
                Select Visit Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVisitType('in-person')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    visitType === 'in-person'
                      ? 'bg-[#f3f0fc] border-[#5e23dc] text-[#5e23dc] font-bold'
                      : 'bg-white border-[#e5e7eb] text-[#434343]'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-[#5e23dc] shrink-0" />
                  <div>
                    <span className="block text-xs font-bold">Physical Site Visit</span>
                    <span className="text-[10px] text-[#6b7280]">Walk property in person</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setVisitType('video')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    visitType === 'video'
                      ? 'bg-[#f3f0fc] border-[#5e23dc] text-[#5e23dc] font-bold'
                      : 'bg-white border-[#e5e7eb] text-[#434343]'
                  }`}
                >
                  <Video className="w-4 h-4 text-[#00bda6] shrink-0" />
                  <div>
                    <span className="block text-xs font-bold">Live Video Walkthrough</span>
                    <span className="text-[10px] text-[#6b7280]">Guided 1-on-1 virtual</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Date selection */}
            <div>
              <label className="block font-bold text-[#191919] mb-1.5 uppercase tracking-wider text-[11px]">
                Preferred Day
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {dates.map((d) => (
                  <button
                    key={d.label}
                    type="button"
                    onClick={() => setSelectedDate(d.label)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedDate === d.label
                        ? 'bg-[#5e23dc] text-white border-[#5e23dc] font-bold shadow-xs'
                        : 'bg-[#f8f9fd] border-[#e5e7eb] text-[#434343] hover:border-[#5e23dc]'
                    }`}
                  >
                    <span className="block font-bold text-xs">{d.label}</span>
                    <span className={`text-[10px] ${selectedDate === d.label ? 'text-white/80' : 'text-[#6b7280]'}`}>{d.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot */}
            <div>
              <label className="block font-bold text-[#191919] mb-1.5 uppercase tracking-wider text-[11px]">
                Preferred Time Slot
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {slots.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSlot(s)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      selectedSlot === s
                        ? 'bg-[#f3f0fc] border-[#5e23dc] text-[#5e23dc] font-bold'
                        : 'bg-white border-[#e5e7eb] text-[#434343] hover:border-[#5e23dc]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-[#5e23dc]" />
                    <span className="text-xs">{s}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 pt-2 border-t border-[#e5e7eb]">
              <div>
                <label className="block font-bold text-[#191919] mb-1 uppercase tracking-wider text-[11px]">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold text-[#191919] focus:outline-none focus:border-[#5e23dc]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#191919] mb-1 uppercase tracking-wider text-[11px]">
                  Mobile Number (For Gate Entry Pass) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold text-[#191919] focus:outline-none focus:border-[#5e23dc]"
                />
              </div>

              {/* Complimentary Cab Checkbox */}
              {visitType === 'in-person' && (
                <label className="flex items-center gap-2 p-3 rounded-xl bg-[#00bda6]/10 border border-[#00bda6]/30 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needCabPickup}
                    onChange={(e) => setNeedCabPickup(e.target.checked)}
                    className="w-4 h-4 rounded text-[#00bda6] focus:ring-0"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-[#006f61] flex items-center gap-1">
                      <Car className="w-3.5 h-3.5" /> Request Free Doorstep Cab Pickup
                    </span>
                    <span className="text-[10px] text-[#6b7280]">Complimentary chauffeur ride from your current location</span>
                  </div>
                </label>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#00bda6] hover:bg-[#00a38f] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#00bda6]/20 transition-all cursor-pointer mt-2"
            >
              Confirm Site Visit Reservation
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
