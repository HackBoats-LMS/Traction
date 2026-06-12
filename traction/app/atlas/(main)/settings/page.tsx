'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, LogOut, Loader2, Check, Sparkles, User, Briefcase, Building2, AlignLeft, MapPin, Phone, Link, Lock } from 'lucide-react';
import { useAuthStore } from '@/atlas-stores/atlas-auth-store';
import { useLocationStore } from '@/atlas-stores/atlas-location-store';
import { Avatar } from '@/components/atlas-ui/avatar';
import { LocationPickerView } from '@/components/atlas-map/location-picker-view';
import { BUSINESS_CATEGORIES } from '@/lib/atlas-categories';


export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading, setUser, logout } = useAuthStore();
  const { coords, updateLocation } = useLocationStore();
  const [form, setForm] = useState({ 
    name: '', 
    profession: '', 
    company: '', 
    bio: '',
    category: '',
    customCategory: '',
    latitude: null as number | null,
    longitude: null as number | null,
    city: '',
    address: '',
    phone: '',
    googleMapsLink: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [extractingMap, setExtractingMap] = useState(false);
  const [extractSuccess, setExtractSuccess] = useState<boolean | null>(null);

  async function handleExtractMapLink(url: string) {
    if (!url) return;
    setExtractingMap(true);
    setExtractSuccess(null);
    try {
      const res = await fetch('/atlas/api/geocode/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (res.ok && data.success && data.latitude && data.longitude) {
        let city = form.city;
        let address = form.address;
        
        try {
          const revRes = await fetch(`/atlas/api/geocode/reverse?lat=${data.latitude}&lng=${data.longitude}`);
          if (revRes.ok) {
            const revData = await revRes.json();
            city = revData.address?.city || revData.address?.town || revData.address?.village || revData.address?.county || city;
            const road = revData.address?.road || '';
            const suburb = revData.address?.suburb || revData.address?.neighbourhood || '';
            address = [road, suburb, city].filter(Boolean).join(', ') || revData.display_name || address;
          }
        } catch (e) {
          console.error('Reverse geocode error:', e);
        }

        setForm(prev => ({ ...prev, latitude: data.latitude, longitude: data.longitude, city, address }));
        setExtractSuccess(true);
      } else {
        setExtractSuccess(false);
      }
    } catch {
      setExtractSuccess(false);
    } finally {
      setExtractingMap(false);
    }
  }

  // Trigger geolocation on mount if user doesn't have a pinned address
  useEffect(() => {
    if (user && (user.latitude === null || user.latitude === undefined)) {
      updateLocation();
    }
  }, [user, updateLocation]);

  // Sync geolocated coordinates to form if user doesn't have a base set yet
  useEffect(() => {
    if (user && (user.latitude === null || user.latitude === undefined) && coords) {
      Promise.resolve().then(() => {
        setForm(prev => {
          // If not modified yet, or set to fallback, sync with GPS
          if (prev.latitude === null || prev.latitude === 12.9352) {
            return {
              ...prev,
              latitude: coords.latitude,
              longitude: coords.longitude,
            };
          }
          return prev;
        });
      });
    }
  }, [coords, user]);

  useEffect(() => {
    if (!isLoading && !user) router.push('/atlas/login');
    if (user) {
      Promise.resolve().then(() => {
        setForm(prev => {
          if (
            prev.name === user.name &&
            prev.profession === user.profession &&
            prev.company === user.company &&
            prev.bio === user.bio &&
            prev.category === (user.category || '') &&
            prev.customCategory === (user.customCategory || '') &&
            prev.latitude === (user.latitude ?? coords?.latitude ?? null) &&
            prev.longitude === (user.longitude ?? coords?.longitude ?? null) &&
            prev.city === (user.city || '') &&
            prev.address === (user.address || '') &&
            prev.phone === (user.phone || '') &&
            prev.googleMapsLink === (user.googleMapsLink || '')
          ) {
            return prev;
          }
          return {
            name: user.name,
            profession: user.profession,
            company: user.company,
            bio: user.bio,
            category: user.category || '',
            customCategory: user.customCategory || '',
            latitude: user.latitude ?? coords?.latitude ?? null,
            longitude: user.longitude ?? coords?.longitude ?? null,
            city: user.city || '',
            address: user.address || '',
            phone: user.phone || '',
            googleMapsLink: user.googleMapsLink || '',
          };
        });
      });
    }
  }, [user, isLoading, router]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/atlas/api/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok && data.user) { setUser(data.user); setSaved(true); setTimeout(() => setSaved(false), 2000); }
    } catch {} finally { setSaving(false); }
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 size={32} className="animate-spin text-[#e62e3d]" />
      </div>
    );
  }

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', icon: User, placeholder: 'e.g. John Doe' },
    { key: 'profession', label: 'Profession', type: 'text', icon: Briefcase, placeholder: 'e.g. Architect, Corporate Lawyer, Fitness Trainer' },
    { key: 'company', label: 'Company', type: 'text', icon: Building2, placeholder: 'e.g. Dream Homes Realty, Legal Associates' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      
      {/* Mobile Top Header (hidden on desktop) */}
      <div className="bg-white border-b border-gray-150 px-6 py-4 sticky top-0 z-30 lg:hidden">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-sm font-bold text-gray-800">Settings</h1>
        </div>
      </div>

      <div className="px-4 py-6 lg:p-8">
        <div className="max-w-[700px] mx-auto space-y-6">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* User Profile Card Summary */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 flex items-center gap-4 shadow-sm">
              <Avatar name={form.name || user.name} size="lg" showStatus status={user.availability} />
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-lg leading-tight truncate">{user.name}</p>
                <p className="text-xs text-gray-400 font-semibold truncate mt-1">{user.email}</p>
              </div>
            </div>

            {/* Profile Fields Container */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Edit Details</h3>
              
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">{f.label}</label>
                  <div className="relative">
                    <f.icon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text"
                      value={form[f.key as 'name' | 'profession' | 'company'] || ''} 
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} 
                      placeholder={f.placeholder}
                      className="w-full px-4 py-2.5 pl-11 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#e62e3d] focus:ring-2 focus:ring-[#e62e3d]/15 transition-all text-gray-900 placeholder:text-gray-400" 
                    />
                  </div>
                </div>
              ))}

              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Service Category Name</label>
                  <p className="text-[10px] text-gray-500 mb-2 leading-relaxed">Enter your exact service or business type as you want it to appear.</p>
                  <div className="relative">
                    <AlignLeft size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text"
                      value={form.customCategory || ''} 
                      onChange={(e) => setForm({ ...form, customCategory: e.target.value })} 
                      className="w-full px-4 py-2.5 pl-11 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#e62e3d] focus:ring-2 focus:ring-[#e62e3d]/15 transition-all text-gray-900 placeholder:text-gray-400" 
                      placeholder="e.g. Vintage Watch Restoration, Freelance Designer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Map Icon</label>
                  <p className="text-[10px] text-gray-500 mb-3 leading-relaxed">Select the icon that best represents your business on the Atlas map.</p>
                  <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 gap-2 max-h-[180px] overflow-y-auto p-2 border border-gray-200 rounded-xl bg-gray-50/50 scrollbar-thin scrollbar-thumb-gray-200">
                    {BUSINESS_CATEGORIES.map(c => {
                      const Icon = c.icon;
                      const isSelected = form.category === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setForm({ ...form, category: c.id })}
                          className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
                            isSelected 
                              ? 'bg-white shadow-md border-2 border-[#e62e3d] scale-110 z-10' 
                              : 'bg-white border border-gray-150 hover:border-gray-300 hover:bg-gray-100 text-gray-500'
                          }`}
                          style={isSelected ? { color: c.color } : {}}
                          title={c.name}
                        >
                          <Icon size={20} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Phone Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text"
                    value={form.phone} 
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                    className="w-full px-4 py-2.5 pl-11 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#e62e3d] focus:ring-2 focus:ring-[#e62e3d]/15 transition-all text-gray-900" 
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Google Maps Link</label>
                <div className="relative">
                  <Link size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text"
                    value={form.googleMapsLink} 
                    onChange={(e) => {
                      setForm({ ...form, googleMapsLink: e.target.value });
                      setExtractSuccess(null);
                    }} 
                    onBlur={(e) => handleExtractMapLink(e.target.value)}
                    className="w-full px-4 py-2.5 pl-11 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#e62e3d] focus:ring-2 focus:ring-[#e62e3d]/15 transition-all text-gray-900" 
                    placeholder="https://maps.app.goo.gl/..."
                  />
                  {extractingMap && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                      <Loader2 size={16} className="animate-spin text-gray-400" />
                    </div>
                  )}
                </div>
                {extractSuccess === true && (
                  <p className="text-[10px] font-bold text-green-600 mt-1.5 flex items-center gap-1"><Check size={12}/> Auto-selected map location from link!</p>
                )}
                {extractSuccess === false && (
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 mt-2">
                    <p className="text-[11px] font-bold text-orange-600 mb-1">Could not extract coordinates from this link.</p>
                    <p className="text-[10px] text-orange-700 leading-relaxed font-medium">
                      Google Maps app links often hide exact locations. For an accurate pin:
                      <br/>• Open Google Maps in your <b>web browser</b>, click <b>Directions</b>, and share that link instead.
                      <br/>• Or, simply use the map below to pinpoint your location manually!
                    </p>
                  </div>
                )}
                {extractSuccess === null && !extractingMap && (
                  <p className="text-[10px] font-medium text-gray-500 mt-1.5">Your pin location will be auto-selected from this map link.</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Detailed Address</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3.5 top-5 text-gray-400" />
                  <textarea 
                    value={form.address} 
                    onChange={(e) => setForm({ ...form, address: e.target.value })} 
                    rows={2} 
                    className="w-full px-4 py-3 pl-11 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#e62e3d] focus:ring-2 focus:ring-[#e62e3d]/15 transition-all text-gray-900 resize-none" 
                    placeholder="Floor, Building, Street..." 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Bio</label>
                <div className="relative">
                  <AlignLeft size={18} className="absolute left-3.5 top-5 text-gray-400" />
                  <textarea 
                    value={form.bio} 
                    onChange={(e) => setForm({ ...form, bio: e.target.value })} 
                    rows={4} 
                    className="w-full px-4 py-3 pl-11 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#e62e3d] focus:ring-2 focus:ring-[#e62e3d]/15 transition-all text-gray-900 resize-none" 
                    placeholder="Tell others about yourself..." 
                  />
                </div>
              </div>
            </div>
            
            {/* Business Base Location Picker (Uber/Rapido style) */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <MapPin size={15} className="text-[#e62e3d]" />
                  Select Business Base Location
                </h3>
                <button 
                  onClick={() => {
                    setForm(prev => ({ ...prev, latitude: null, longitude: null, city: '', address: '' }));
                    setExtractSuccess(null);
                  }}
                  className="text-xs font-bold text-gray-500 hover:text-red-500 transition-colors"
                >
                  Clear Location
                </button>
              </div>
              <p className="text-xs text-gray-400 font-semibold leading-normal">
                Other users will see this location as your primary office address on their maps. Move the map to position your office precisely at the center pin, or search.
              </p>
              <div className="relative rounded-2xl overflow-hidden">
                {extractSuccess === true && (
                  <div className="absolute inset-0 z-[2000] bg-white/70 backdrop-blur-[3px] flex flex-col items-center justify-center p-6 text-center border-2 border-green-500/30 rounded-2xl">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3 shadow-sm">
                      <MapPin size={24} />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">Locked to Google Maps Link</h4>
                    <p className="text-xs font-semibold text-gray-600 mb-4 max-w-xs">We automatically pinned your location from the link you provided. Click below if you need to adjust it manually.</p>
                    <button 
                      onClick={() => setExtractSuccess(null)}
                      className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                    >
                      <Lock size={14} /> Unlock Map
                    </button>
                  </div>
                )}
                <LocationPickerView 
                  initialLatitude={form.latitude}
                  initialLongitude={form.longitude}
                  onChange={({ latitude, longitude, city, address }) => {
                    // Do not update form if locked by extract
                    if (extractSuccess === true) return;
                    setForm(prev => ({ ...prev, latitude, longitude, city, address }));
                  }}
                />
              </div>
            </div>



            {/* Save & Logout Actions Panel */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button 
                onClick={handleSave} 
                disabled={saving} 
                className="w-full sm:flex-1 py-3 bg-[#e62e3d] hover:bg-[#d02432] text-white text-sm font-bold rounded-xl active:scale-[0.98] transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : saved ? (
                  <><Check size={16} /> Changes Saved!</>
                ) : (
                  <><Save size={16} /> Save Changes</>
                )}
              </button>
              
              <button 
                onClick={() => { logout(); router.push('/atlas'); }} 
                className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-200 text-[#e62e3d] hover:bg-red-50/30 text-sm font-bold rounded-xl active:scale-[0.98] transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <LogOut size={16} /> 
                <span>Sign Out</span>
              </button>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
