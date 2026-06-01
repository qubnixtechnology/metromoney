import React from 'react';
import { BarChart3, Bell, Check, CreditCard, Image, ShieldCheck, Users } from 'lucide-react';
import { Button, Card } from '../components/ui';

export default function AdminPage({ profiles, stats = {}, onApprove, onBlock, setView }) {
  const users = profiles.filter((profile) => profile.role !== 'admin');
  const value = (key, fallback = 0) => stats[key] ?? fallback;
  const pending = value('pending_profiles', users.filter((profile) => profile.status === 'pending').length);
  const approved = value('approved_profiles', users.filter((profile) => profile.status === 'approved').length);
  const blocked = value('blocked_profiles', users.filter((profile) => profile.status === 'blocked').length);
  const premium = value('premium_profiles', users.filter((profile) => profile.premium).length);
  const adminSections = [
    { id: 'admin-users', title: 'Users', icon: Users, metrics: [['Total', value('total_profiles', users.length)], ['Approved', approved], ['Blocked', blocked]] },
    { id: 'admin-analytics', title: 'Analytics', icon: BarChart3, metrics: [['Interests', value('interests')], ['Messages', value('messages')], ['Reports', value('reports')]] },
    { id: 'admin-verification', title: 'Verification', icon: ShieldCheck, metrics: [['Pending', pending], ['Verified', value('verified_profiles')], ['Blocked', blocked]] },
    { id: 'admin-subscriptions', title: 'Subscriptions', icon: CreditCard, metrics: [['Premium', premium], ['Subscriptions', value('subscriptions')], ['Payments', value('payments')]] },
    { id: 'admin-moderation', title: 'Moderation', icon: Image, metrics: [['Reports', value('reports')], ['Pending', pending], ['Blocked', blocked]] }
  ];

  return (
    <section className="admin-layout">
      <div className="admin-dashboard-hero">
        <span><ShieldCheck size={16} /> Admin side</span>
        <h1>Admin Dashboard</h1>
      </div>

      <div className="admin-section-grid">
        {adminSections.map((section) => {
          const Icon = section.icon;
          const targetView = section.id === 'dashboard' ? 'admin' : `admin-${section.id}`;
          return (
            <Card className="admin-section-card" key={section.id}>
              <div className="admin-section-title">
                <Icon />
                <strong>{section.title}</strong>
              </div>
              <div className="admin-mini-metrics">
                {section.metrics.map(([label, value]) => (
                  <span key={label}><b>{value}</b>{label}</span>
                ))}
              </div>
              <Button variant="ghost" onClick={() => setView(targetView)}>Open</Button>
            </Card>
          );
        })}
      </div>

      <div className="admin-stats">
        <Card><Users /><span>{value('total_profiles', users.length)}</span><p>Total users</p></Card>
        <Card><ShieldCheck /><span>{approved}</span><p>Approved</p></Card>
        <Card><Bell /><span>{pending}</span><p>Pending verification</p></Card>
      </div>

      <div className="admin-table">
        <h2>Profile approval queue</h2>
        {users.map((profile) => (
          <Card className="admin-row" key={profile.id}>
            <img src={profile.photo} alt={profile.name} />
            <div>
              <strong>{profile.name}</strong>
              <p>{profile.city} - {profile.profession} - {profile.status}</p>
            </div>
            <Button variant="ghost" onClick={() => onApprove(profile.id)}><Check size={17} /> Approve</Button>
            <Button variant="danger" onClick={() => onBlock(profile.id)}>{profile.status === 'blocked' ? 'Unblock' : 'Block'}</Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
