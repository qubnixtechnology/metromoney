import React from 'react';
import { CalendarHeart, Lock, LogOut, Menu, UserPlus, X } from 'lucide-react';
import { adminNavItems, userNavItems } from '../config/navigation';
import { Button } from './ui';

export default function Header({ currentUser, view, setView, onLogout, mobileNav, setMobileNav, adminArea = false }) {
  const isAdminLoggedIn = adminArea && currentUser?.role === 'admin';
  const userNav = isAdminLoggedIn ? adminNavItems : adminArea ? [] : userNavItems;
  const visibleUser = adminArea && !isAdminLoggedIn ? null : currentUser;

  const goHome = () => {
    if (adminArea) {
      setView(isAdminLoggedIn ? 'admin' : 'admin-login');
      return;
    }
    setView('home');
  };

  if (isAdminLoggedIn) {
    return (
      <>
        <aside className="admin-sidebar">
          <button className="admin-sidebar-brand" onClick={goHome}>
            <CalendarHeart />
            <span>Bharat Matrimony</span>
          </button>
          <nav className="admin-sidebar-nav">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => setView(item.id)}>
                  <Icon size={19} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="admin-sidebar-footer">
            <span className="admin-role-badge">Admin</span>
          <button className="admin-logout-button" onClick={onLogout}><LogOut size={18} /> Logout</button>
          </div>
        </aside>
        <header className="admin-topbar">
          <div>Hello, <strong>{currentUser?.name || 'Admin User'}</strong></div>
          <div className="admin-topbar-user">
            <span>{(currentUser?.name || 'Admin User').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</span>
            <b>ADMIN</b>
          </div>
        </header>
      </>
    );
  }

  return (
    <header className="site-header">
      <Button variant="icon" className="mobile-only" onClick={() => setMobileNav(!mobileNav)} aria-label="Menu">
        {mobileNav ? <X /> : <Menu />}
      </Button>
      <button className="brand" onClick={goHome}>
        <CalendarHeart />
        <span>Bharat Matrimony</span>
      </button>
      <nav className={mobileNav ? 'nav open' : 'nav'}>
        {userNav.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => { setView(item.id); setMobileNav(false); }}>
              <Icon size={17} /> <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="header-actions">
        {visibleUser ? (
          <>
            <span className="user-chip">{visibleUser.role}</span>
            <Button variant="ghost" onClick={onLogout}><LogOut size={17} /> Logout</Button>
          </>
        ) : !adminArea ? (
          <>
            <Button variant="ghost" onClick={() => setView('login')}><Lock size={17} /> Login</Button>
            <Button onClick={() => setView('register')}><UserPlus size={17} /> Register</Button>
          </>
        ) : null}
      </div>
    </header>
  );
}
