import { CreditCard, Home, Search, Settings, ShieldCheck, Sparkles, Users } from 'lucide-react';

export const userNavItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'dashboard', label: 'My Account', icon: Sparkles },
  { id: 'profile', label: 'Profile', icon: Settings }
];

export const adminNavItems = [
  { id: 'admin', label: 'Dashboard', icon: ShieldCheck },
  { id: 'admin-analytics', label: 'Analytics', icon: Sparkles },
  { id: 'admin-verification', label: 'Verification', icon: ShieldCheck },
  { id: 'admin-subscriptions', label: 'Subscriptions', icon: CreditCard },
  { id: 'admin-moderation', label: 'Moderation', icon: Search },
  { id: 'admin-users', label: 'Users', icon: Users },
  { id: 'admin-cms', label: 'CMS', icon: Settings }
];
