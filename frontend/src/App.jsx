import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Toast from './components/Toast';
import { API_BASE, apiRequest, apiUpload } from './services/api';
import { storageGet, storageSet } from './utils/storage';
import { calculateCompatibility, calculateFraudRisk } from './utils/matchmaking';
import AdminPage from './pages/AdminPage';
import BrowsePage from './pages/BrowsePage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MatchesPage from './pages/MatchesPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import AdminConsolePage from './admin/AdminConsolePage';
import DashboardPage from './user/DashboardPage';
import InterestsPage from './user/InterestsPage';
import NotificationsPage from './user/NotificationsPage';
import SafetyCenterPage from './user/SafetyCenterPage';
import SettingsPage from './user/SettingsPage';
import SubscriptionPage from './user/SubscriptionPage';

export default function App() {
  const isAdminPath = window.location.pathname.startsWith('/admin');
  const defaultFilters = { query: '', city: 'Any', religion: 'Any', minAge: 24, maxAge: 32 };
  const [profiles, setProfiles] = useState(() => storageGet('bharat_profiles', []));
  const [currentUser, setCurrentUser] = useState(() => storageGet('bharat_user', null));
  const [view, setView] = useState(() => {
    if (isAdminPath) {
      const user = storageGet('bharat_user', null);
      return user?.role === 'admin' ? 'admin' : 'admin-login';
    }
    return 'home';
  });
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [interests, setInterests] = useState(() => storageGet('bharat_interests', []));
  const [shortlist, setShortlist] = useState(() => storageGet('bharat_shortlist', []));
  const [messages, setMessages] = useState(() => storageGet('bharat_messages', []));
  const [calls, setCalls] = useState(() => storageGet('bharat_calls', []));
  const [cmsPages, setCmsPages] = useState(() => storageGet('bharat_cms_pages', []));
  const [adminStats, setAdminStats] = useState(() => storageGet('bharat_admin_stats', {}));
  const [subscriptionPlans, setSubscriptionPlans] = useState(() => storageGet('bharat_subscription_plans', []));
  const [notifications, setNotifications] = useState(() => storageGet('bharat_notifications', []));
  const adminArea = view === 'admin-login' || view === 'admin' || view.startsWith('admin-');

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  };

  const persist = (key, value, setter) => {
    setter(value);
    storageSet(key, value);
  };

  useEffect(() => {
    if (!API_BASE) return;
    apiRequest('/profiles/index.php')
      .then((payload) => {
        if (Array.isArray(payload.profiles)) {
          persist('bharat_profiles', payload.profiles, setProfiles);
        }
      })
      .catch(() => notify('Running in offline demo mode'));
  }, []);

  useEffect(() => {
    if (!API_BASE) return;
    apiRequest('/subscriptions/index.php')
      .then((payload) => {
        if (Array.isArray(payload.plans)) {
          const plans = payload.plans.map((plan) => ({
            id: plan.code,
            code: plan.code,
            name: plan.name,
            price: Number(plan.price || 0),
            period: Number(plan.duration_days || 0) >= 90 ? 'quarter' : Number(plan.duration_days || 0) === 0 ? 'forever' : 'month',
            features: typeof plan.features === 'string' ? JSON.parse(plan.features || '[]') : plan.features || []
          }));
          persist('bharat_subscription_plans', plans, setSubscriptionPlans);
        }
      })
      .catch(() => notify('Subscription plans could not be loaded'));
  }, []);

  useEffect(() => {
    if (!API_BASE || !currentUser || currentUser.role === 'admin') return;
    apiRequest('/notifications/index.php')
      .then((payload) => {
        if (Array.isArray(payload.notifications)) {
          persist('bharat_notifications', payload.notifications, setNotifications);
        }
      })
      .catch(() => notify('Notifications could not be loaded'));
  }, [currentUser]);

  useEffect(() => {
    if (!API_BASE || currentUser?.role !== 'admin') return;

    apiRequest('/admin/users.php')
      .then((payload) => {
        if (Array.isArray(payload.users)) {
          persist('bharat_profiles', payload.users, setProfiles);
        }
      })
      .catch(() => notify('Admin users could not be loaded'));

    apiRequest('/admin/stats.php')
      .then((payload) => {
        if (payload.stats) {
          persist('bharat_admin_stats', payload.stats, setAdminStats);
        }
      })
      .catch(() => notify('Admin stats could not be loaded'));
  }, [currentUser]);

  useEffect(() => {
    if (!API_BASE) return;
    apiRequest('/cms/index.php')
      .then((payload) => {
        if (Array.isArray(payload.pages)) {
          persist('bharat_cms_pages', payload.pages, setCmsPages);
        }
      })
      .catch(() => notify('CMS content is using local fallback'));
  }, []);

  useEffect(() => {
    if (view === 'admin-login' || view === 'admin' || view.startsWith('admin-')) {
      if (!window.location.pathname.startsWith('/admin')) {
        window.history.pushState({}, '', '/admin');
      }
      return;
    }

    if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState({}, '', '/');
    }
  }, [view]);

  useEffect(() => {
    const protectedViews = ['dashboard', 'profile', 'matches', 'interests', 'messages', 'subscription', 'notifications', 'safety', 'settings'];
    if (!currentUser && protectedViews.includes(view)) {
      setView('login');
    }
  }, [currentUser, view]);

  const login = async (email, password, role) => {
    if (role === 'admin' && !adminArea) {
      notify('Admin login is available only at /admin');
      return;
    }

    try {
      const payload = await apiRequest('/auth/login.php', { method: 'POST', body: { email, password, role } });
      persist('bharat_user', payload.user, setCurrentUser);
      setView(payload.user.role === 'admin' ? 'admin' : 'dashboard');
      notify(`Welcome back, ${payload.user.name}`);
    } catch {
      if (API_BASE) {
        notify('Login failed. Please check backend/database credentials.');
        return;
      }
      notify('Backend is not connected. Start PHP backend and set VITE_API_BASE_URL.');
    }
  };

  const register = async (form) => {
    const { photoFile, introVideoFile, ...profileForm } = form;
    const newUser = {
      id: Date.now(),
      role: 'user',
      status: 'pending',
      ...profileForm,
      match: 80,
      verified: false,
      premium: false,
      photo: profileForm.photo || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80'
    };

    try {
      const payload = await apiRequest('/auth/register.php', { method: 'POST', body: newUser });
      let registeredUser = payload.user;
      if (photoFile) {
        const formData = new FormData();
        formData.append('media', photoFile);
        formData.append('type', 'photo');
        const uploadPayload = await apiUpload('/media/index.php', formData);
        registeredUser = { ...registeredUser, photo: uploadPayload.media.url };
      }
      if (introVideoFile) {
        const formData = new FormData();
        formData.append('media', introVideoFile);
        formData.append('type', 'video');
        const uploadPayload = await apiUpload('/media/index.php', formData);
        registeredUser = { ...registeredUser, intro_video: uploadPayload.media.url };
      }
      persist('bharat_user', registeredUser, setCurrentUser);
    } catch {
      if (API_BASE) {
        notify('Registration failed. Please check backend/database connection.');
        return;
      }
      persist('bharat_user', newUser, setCurrentUser);
      persist('bharat_profiles', [newUser, ...profiles], setProfiles);
    }
    setView('dashboard');
    notify('Registration successful. You can update your profile anytime.');
  };

  const logout = async () => {
    try {
      await apiRequest('/auth/logout.php', { method: 'POST' });
    } catch {
      // Demo mode needs no network cleanup.
    }
    localStorage.removeItem('bharat_user');
    setCurrentUser(null);
    setView(window.location.pathname.startsWith('/admin') ? 'admin-login' : 'home');
    notify('Signed out');
  };

  const updateProfile = async (form) => {
    let updated = { ...currentUser, ...form };
    try {
      const payload = await apiRequest('/profiles/index.php', { method: 'PUT', body: form });
      updated = payload.user;
    } catch {
      if (API_BASE) {
        notify('Profile update failed. Please check backend/database connection.');
        return;
      }
      // Local demo mode keeps the profile editor functional without PHP/MySQL.
    }
    persist('bharat_user', updated, setCurrentUser);
    persist('bharat_profiles', profiles.map((profile) => (profile.id === updated.id ? { ...profile, ...updated } : profile)), setProfiles);
    notify('Profile updated');
  };

  const uploadMedia = async (file, type = 'photo') => {
    if (!currentUser || !file) return null;

    try {
      const formData = new FormData();
      formData.append('media', file);
      formData.append('type', type);
      const payload = await apiUpload('/media/index.php', formData);
      const updated = type === 'video'
        ? { ...currentUser, intro_video: payload.media.url }
        : { ...currentUser, photo: payload.media.url };
      persist('bharat_user', updated, setCurrentUser);
      persist('bharat_profiles', profiles.map((profile) => (profile.id === updated.id ? { ...profile, ...updated } : profile)), setProfiles);
      notify(`${type === 'video' ? 'Video' : 'Photo'} uploaded`);
      return payload.media.url;
    } catch {
      if (API_BASE) {
        notify('Media upload failed. Please check backend upload permissions.');
        return null;
      }
      const url = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const updated = type === 'video' ? { ...currentUser, intro_video: url } : { ...currentUser, photo: url };
      persist('bharat_user', updated, setCurrentUser);
      persist('bharat_profiles', profiles.map((profile) => (profile.id === updated.id ? { ...profile, ...updated } : profile)), setProfiles);
      notify(`${type === 'video' ? 'Video' : 'Photo'} saved locally`);
      return url;
    }
  };

  const approveProfile = async (id) => {
    try {
      await apiRequest('/admin/profiles.php', { method: 'POST', body: { id, action: 'approve' } });
    } catch {
      // Demo mode applies the same state transition locally.
    }
    persist('bharat_profiles', profiles.map((profile) => (profile.id === id ? { ...profile, status: 'approved', verified: true } : profile)), setProfiles);
    notify('Profile approved');
  };

  const toggleBlock = async (id) => {
    const profile = profiles.find((item) => item.id === id);
    const action = profile?.status === 'blocked' ? 'unblock' : 'block';
    try {
      await apiRequest('/admin/profiles.php', { method: 'POST', body: { id, action } });
    } catch {
      // Demo mode applies the same state transition locally.
    }
    persist('bharat_profiles', profiles.map((item) => (item.id === id ? { ...item, status: item.status === 'blocked' ? 'approved' : 'blocked' } : item)), setProfiles);
    notify('Profile status changed');
  };

  const sendInterest = async (profile) => {
    if (!currentUser) {
      setView('login');
      notify('Please login to send interest');
      return;
    }
    if (interests.includes(profile.id)) {
      notify('Interest already sent');
      return;
    }
    try {
      await apiRequest('/interests/index.php', { method: 'POST', body: { receiver_id: profile.id } });
    } catch {
      if (API_BASE) {
        notify('Could not send interest. Please check backend connection.');
        return;
      }
      // Demo mode stores interests in localStorage.
    }
    persist('bharat_interests', [...interests, profile.id], setInterests);
    notify(`Interest sent to ${profile.name}`);
  };

  const toggleShortlist = (profile) => {
    if (!currentUser) {
      setView('login');
      notify('Please login to shortlist');
      return;
    }
    const next = shortlist.includes(profile.id)
      ? shortlist.filter((id) => id !== profile.id)
      : [...shortlist, profile.id];
    persist('bharat_shortlist', next, setShortlist);
    notify(shortlist.includes(profile.id) ? 'Removed from shortlist' : 'Added to shortlist');
  };

  const sendMessage = async (profile, text) => {
    if (!currentUser) {
      setView('login');
      notify('Please login to message');
      return;
    }
    try {
      await apiRequest('/messages/index.php', { method: 'POST', body: { receiver_id: profile.id, body: text } });
    } catch {
      if (API_BASE) {
        notify('Could not send message. Please check backend connection.');
        return;
      }
      // Demo mode stores messages in localStorage.
    }
    persist('bharat_messages', [{ id: Date.now(), from: profile.name, text, time: 'Now' }, ...messages], setMessages);
    notify(`Message sent to ${profile.name}`);
  };

  const scheduleCall = async (profile, callType = 'family_video') => {
    if (!currentUser) {
      setView('login');
      notify('Please login to schedule a call');
      return;
    }

    const scheduledAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
    const call = {
      id: Date.now(),
      with: profile.name,
      receiver_id: profile.id,
      call_type: callType,
      scheduled_at: scheduledAt,
      status: 'scheduled'
    };

    try {
      await apiRequest('/calls/index.php', { method: 'POST', body: { receiver_id: profile.id, call_type: callType, scheduled_at: scheduledAt } });
    } catch {
      if (API_BASE) {
        notify('Could not schedule call. Please check backend connection.');
        return;
      }
      // Demo mode stores call requests locally.
    }
    persist('bharat_calls', [call, ...calls], setCalls);
    notify(`${callType.replace('_', ' ')} scheduled with ${profile.name}`);
  };

  const selectPlan = async (plan) => {
    try {
      await apiRequest('/subscriptions/index.php', { method: 'POST', body: { plan_id: plan.id } });
    } catch {
      if (API_BASE) {
        notify('Plan update failed. Payment gateway is intentionally not connected yet.');
        return;
      }
      // Demo mode keeps plan selection local.
    }
    const updated = { ...currentUser, plan: plan.id, premium: plan.id !== 'free' };
    persist('bharat_user', updated, setCurrentUser);
    notify(`${plan.name} plan selected`);
  };

  const saveCmsPage = async (page) => {
    try {
      const payload = await apiRequest('/admin/cms.php', { method: 'POST', body: page });
      const saved = payload.page;
      persist('bharat_cms_pages', [saved, ...cmsPages.filter((item) => item.slug !== saved.slug)], setCmsPages);
      notify(`${saved.title} updated`);
    } catch {
      if (API_BASE) {
        notify('CMS update failed. Please check admin session/backend.');
        return;
      }
      const saved = { ...page, updated_at: new Date().toISOString() };
      persist('bharat_cms_pages', [saved, ...cmsPages.filter((item) => item.slug !== saved.slug)], setCmsPages);
      notify(`${saved.title} updated locally`);
    }
  };

  const scoredProfiles = useMemo(() => profiles.map((profile) => {
    const compatibility = calculateCompatibility(currentUser || {}, profile);
    const fraudRisk = calculateFraudRisk(profile);
    return { ...profile, match: compatibility.score, compatibilitySummary: compatibility.summary, fraudRisk };
  }), [profiles, currentUser]);

  const visibleProfiles = useMemo(() => {
    return scoredProfiles.filter((profile) => {
      if (profile.role === 'admin' || profile.status === 'blocked') return false;
      if (currentUser?.role !== 'admin' && profile.status !== 'approved') return false;
      const searchText = `${profile.name} ${profile.city} ${profile.profession} ${profile.community}`.toLowerCase();
      const queryHit = searchText.includes(filters.query.toLowerCase());
      const cityHit = filters.city === 'Any' || profile.city === filters.city;
      const religionHit = filters.religion === 'Any' || profile.religion === filters.religion;
      return queryHit && cityHit && religionHit && profile.age >= filters.minAge && profile.age <= filters.maxAge;
    });
  }, [scoredProfiles, filters, currentUser]);

  return (
    <div className="app">
      <Toast message={toast} />
      <Header currentUser={currentUser} view={view} setView={setView} onLogout={logout} mobileNav={mobileNav} setMobileNav={setMobileNav} adminArea={adminArea} />

      <main className={adminArea && currentUser?.role === 'admin' ? 'admin-main' : ''}>
        {view === 'home' && <HomePage setView={setView} cmsPages={cmsPages} subscriptionPlans={subscriptionPlans} />}
        {(view === 'login' || view === 'admin-login') && <LoginPage onLogin={login} defaultRole={view === 'admin-login' ? 'admin' : 'user'} adminOnly={view === 'admin-login'} />}
        {view === 'register' && <RegisterPage onRegister={register} />}
        {view === 'dashboard' && <DashboardPage user={currentUser} setView={setView} profiles={scoredProfiles} interests={interests} shortlist={shortlist} messages={messages} calls={calls} notifications={notifications} notify={notify} />}
        {(view === 'discover' || view === 'browse') && <BrowsePage filters={filters} setFilters={setFilters} profiles={visibleProfiles} interests={interests} shortlist={shortlist} onInterest={sendInterest} onShortlist={toggleShortlist} onMessage={sendMessage} onCall={scheduleCall} />}
        {view === 'matches' && <MatchesPage profiles={scoredProfiles.filter((profile) => shortlist.includes(profile.id) || interests.includes(profile.id))} onInterest={sendInterest} onShortlist={toggleShortlist} onMessage={sendMessage} onCall={scheduleCall} />}
        {view === 'interests' && <InterestsPage profiles={scoredProfiles} interests={interests} shortlist={shortlist} onInterest={sendInterest} onShortlist={toggleShortlist} onMessage={sendMessage} onCall={scheduleCall} />}
        {view === 'messages' && <MessagesPage messages={messages} calls={calls} setMessages={(next) => persist('bharat_messages', next, setMessages)} />}
        {view === 'subscription' && <SubscriptionPage plans={subscriptionPlans} onSelectPlan={selectPlan} />}
        {view === 'notifications' && <NotificationsPage notifications={notifications} />}
        {view === 'safety' && <SafetyCenterPage notify={notify} cmsPages={cmsPages} />}
        {view === 'settings' && <SettingsPage notify={notify} />}
        {view === 'profile' && <ProfilePage user={currentUser} onSave={updateProfile} onUploadMedia={uploadMedia} setView={setView} />}
        {view === 'admin' && <AdminPage profiles={profiles} stats={adminStats} onApprove={approveProfile} onBlock={toggleBlock} setView={setView} />}
        {view.startsWith('admin-') && <AdminConsolePage view={view} profiles={profiles} stats={adminStats} onApprove={approveProfile} onBlock={toggleBlock} notify={notify} cmsPages={cmsPages} onSaveCmsPage={saveCmsPage} />}
      </main>
    </div>
  );
}
