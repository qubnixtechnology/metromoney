import React from 'react';
import { Heart } from 'lucide-react';
import ProfileCard from '../components/ProfileCard';
import { EmptyState } from '../components/ui';

export default function MatchesPage({ profiles, onInterest, onShortlist, onMessage, onCall }) {
  return (
    <section className="content-section">
      <h2>Shortlisted and contacted profiles</h2>
      <div className="profile-grid compact">
        {profiles.map((profile) => <ProfileCard key={profile.id} profile={profile} interested shortlisted onInterest={onInterest} onShortlist={onShortlist} onMessage={onMessage} onCall={onCall} />)}
        {!profiles.length && <EmptyState icon={Heart} title="No saved matches yet"><p>Browse profiles and save the ones you like.</p></EmptyState>}
      </div>
    </section>
  );
}
