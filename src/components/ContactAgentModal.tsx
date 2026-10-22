import React, { useState } from 'react';
import { 
  X, 
  PhoneCall, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Send,
  Building
} from 'lucide-react';
import { Property } from '../types/property';

interface ContactAgentModalProps {
  property: Property | null;
  onClose: () => void;
}

export const ContactAgentModal: React.FC<ContactAgentModalProps> = ({ property, onClose }) => {
  if (!property) return null;

  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [isCallbackSent, setIsCallbackSent] = useState(false);

  const handleCallbackRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerPhone.trim()) return;
    setIsCallbackSent(true);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello ${property.agent.name}, I am interested in "${property.title}" listed on PropTech Horizon for ${property.locality}. Please share more details and brochure.`
    );
    window.open(`https://api.whatsapp.com/send?phone=${property.agent.phone.replace(/[^0-9]/g, '')}&text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-3xl border border-[#e5e7eb] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:px-6 py-4 border-b border-[#e5e7eb] flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-base font-extrabold text-[#191919]">
              Contact {property.agent.role}
            </h2>
            <p className="text-xs text-[#6b7280]">
              Direct connection with zero mediator commission
            </p>
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
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Agent Profile Card */}
          <div className="p-4 rounded-2xl bg-[#f8f9fd] border border-[#e5e7eb] flex items-center gap-3">
            <img
              src={property.agent.avatar}
              alt={property.agent.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[#191919] text-sm truncate">{property.agent.name}</span>
                <span className="bg-[#10b981] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                  Verified
                </span>
              </div>
              <p className="text-xs text-[#6b7280] truncate">{property.agent.company}</p>
              <div className="flex items-center gap-3 text-[11px] text-[#6b7280] mt-1">
                <span>⭐ 4.9 Rating</span>
                <span>·</span>
                <span className="text-[#5e23dc] font-semibold">⚡ Responds in {property.agent.responseTimeMin}m</span>
              </div>
            </div>
          </div>

          {/* Quick Direct Actions: WhatsApp & Phone Reveal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={handleWhatsApp}
              className="py-3 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer min-h-[44px]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </button>

            <button
              onClick={() => setPhoneRevealed(true)}
              className="py-3 px-3 rounded-xl bg-[#5e23dc] hover:bg-[#4d1cb8] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-[#66f6dd]" />
              <span>{phoneRevealed ? property.agent.phone : 'Show Number'}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-[#e5e7eb]" />
            <span className="absolute bg-white px-2 text-[11px] font-bold text-[#6b7280] uppercase">
              Or Request Instant Callback
            </span>
          </div>

          {/* Instant Callback Form */}
          {isCallbackSent ? (
            <div className="p-4 rounded-xl bg-[#10b981]/10 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#10b981] mx-auto" />
              <div className="font-extrabold text-[#006f61] text-sm">Callback Request Transmitted!</div>
              <p className="text-xs text-[#434343]">
                {property.agent.name} has been notified and will call you on {buyerPhone} within {property.agent.responseTimeMin} minutes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleCallbackRequest} className="space-y-3">
              <div>
                <label className="block font-bold text-[#191919] mb-1 uppercase tracking-wider text-[11px]">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold text-[#191919] focus:outline-none focus:border-[#5e23dc]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#191919] mb-1 uppercase tracking-wider text-[11px]">
                  Your Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="+91 98200 00000"
                  className="w-full p-2.5 rounded-xl border border-[#e5e7eb] font-semibold text-[#191919] focus:outline-none focus:border-[#5e23dc]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#00bda6] hover:bg-[#00a38f] text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Get Instant Free Callback</span>
              </button>
            </form>
          )}

          <div className="text-[11px] text-[#6b7280] text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Your contact details are encrypted and shared only with this seller.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
