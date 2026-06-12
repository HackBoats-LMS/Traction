import { 
  Utensils, Laptop, Home, Wrench, Shield, Briefcase, Activity, 
  Stethoscope, Landmark, Car, Heart, Scissors, Shirt, Users, 
  Dumbbell, Music, Plane, Anchor, ShoppingCart, ShoppingBag, 
  Book, Coffee, Camera, Palette, Zap, Cpu, GraduationCap, 
  Megaphone, PiggyBank, Receipt, PenTool, Truck, Hammer, 
  Building2, Monitor, Phone, Printer, ScissorsSquare, Star, 
  Umbrella, Watch, Wifi, Gamepad2, Gift, Video, Wallet,
  Factory, Sprout, Store, Paintbrush,
  Hotel, Bed, ChefHat, Pizza, Wine, Smartphone, TabletSmartphone, Settings, Tv
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface BusinessCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
}

export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  { id: 'restaurant', name: 'Restaurant & Dining', icon: Utensils, color: '#ef4444' },
  { id: 'cafe', name: 'Cafe & Bakery', icon: Coffee, color: '#f97316' },
  { id: 'it_services', name: 'IT Services & Tech', icon: Laptop, color: '#3b82f6' },
  { id: 'real_estate', name: 'Real Estate', icon: Home, color: '#10b981' },
  { id: 'construction', name: 'Construction', icon: Hammer, color: '#8b5cf6' },
  { id: 'plumbing', name: 'Plumbing', icon: Wrench, color: '#64748b' },
  { id: 'electrical', name: 'Electrical', icon: Zap, color: '#eab308' },
  { id: 'legal', name: 'Legal Services', icon: Landmark, color: '#1e293b' },
  { id: 'accounting', name: 'Accounting', icon: Receipt, color: '#0ea5e9' },
  { id: 'consulting', name: 'Consulting', icon: Briefcase, color: '#475569' },
  { id: 'marketing', name: 'Marketing & PR', icon: Megaphone, color: '#ec4899' },
  { id: 'healthcare', name: 'Healthcare & Clinic', icon: Stethoscope, color: '#14b8a6' },
  { id: 'fitness', name: 'Fitness & Gym', icon: Dumbbell, color: '#f43f5e' },
  { id: 'wellness', name: 'Spa & Wellness', icon: Heart, color: '#fb7185' },
  { id: 'salon', name: 'Salon & Beauty', icon: Scissors, color: '#d946ef' },
  { id: 'automotive', name: 'Automotive & Garage', icon: Car, color: '#334155' },
  { id: 'logistics', name: 'Logistics & Transport', icon: Truck, color: '#f59e0b' },
  { id: 'retail', name: 'Retail Store', icon: Store, color: '#84cc16' },
  { id: 'grocery', name: 'Grocery & Supermarket', icon: ShoppingCart, color: '#22c55e' },
  { id: 'clothing', name: 'Clothing & Apparel', icon: Shirt, color: '#c026d3' },
  { id: 'education', name: 'Education & Tutors', icon: GraduationCap, color: '#6366f1' },
  { id: 'bookstore', name: 'Bookstore', icon: Book, color: '#8b5cf6' },
  { id: 'entertainment', name: 'Entertainment & Events', icon: Music, color: '#f43f5e' },
  { id: 'travel', name: 'Travel & Tourism', icon: Plane, color: '#0ea5e9' },
  { id: 'photography', name: 'Photography', icon: Camera, color: '#64748b' },
  { id: 'art_design', name: 'Art & Design', icon: Palette, color: '#d946ef' },
  { id: 'insurance', name: 'Insurance', icon: Umbrella, color: '#0284c7' },
  { id: 'finance', name: 'Finance & Banking', icon: Landmark, color: '#0f766e' },
  { id: 'cleaning', name: 'Cleaning Services', icon: Sprout, color: '#10b981' },
  { id: 'manufacturing', name: 'Manufacturing', icon: Factory, color: '#475569' },
  { id: 'architecture', name: 'Architecture', icon: Building2, color: '#3b82f6' },
  { id: 'agriculture', name: 'Agriculture & Farming', icon: Sprout, color: '#84cc16' },
  { id: 'interior_design', name: 'Interior Design', icon: Paintbrush, color: '#c026d3' },
  { id: 'hotel', name: 'Hotel & Lodging', icon: Hotel, color: '#6366f1' },
  { id: 'bed_breakfast', name: 'Bed & Breakfast', icon: Bed, color: '#8b5cf6' },
  { id: 'chef', name: 'Catering & Chef', icon: ChefHat, color: '#ef4444' },
  { id: 'pizzeria', name: 'Pizzeria & Fast Food', icon: Pizza, color: '#f97316' },
  { id: 'bar', name: 'Bar & Lounge', icon: Wine, color: '#be123c' },
  { id: 'mobile_repair', name: 'Mobile Repair', icon: Smartphone, color: '#3b82f6' },
  { id: 'device_repair', name: 'Electronics Repair', icon: TabletSmartphone, color: '#0ea5e9' },
  { id: 'appliance_repair', name: 'Appliance Repair', icon: Tv, color: '#64748b' },
  { id: 'general_service', name: 'General Service', icon: Settings, color: '#475569' },
  { id: 'other', name: 'Other Business', icon: Star, color: '#94a3b8' },
];

export function getCategoryById(id: string): BusinessCategory {
  return BUSINESS_CATEGORIES.find(c => c.id === id) || BUSINESS_CATEGORIES[BUSINESS_CATEGORIES.length - 1];
}
