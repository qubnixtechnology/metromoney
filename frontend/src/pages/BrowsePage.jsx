import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProfileCard from '../components/ProfileCard';
import { Button, EmptyState } from '../components/ui';
const defaultFilters = { query: '', city: 'Any', religion: 'Any', minAge: 24, maxAge: 32 };

export default function BrowsePage({ filters, setFilters, profiles, interests, shortlist, onInterest, onShortlist, onMessage, onCall }) {
  const update = (key, value) => setFilters({ ...filters, [key]: value });

  return (
    <section className="browse-layout">
      <aside className="filters">
        <h2>Find matches</h2>
        <label>Search<input value={filters.query} onChange={(event) => update('query', event.target.value)} placeholder="Name, city, profession" /></label>
        <label>City<select value={filters.city} onChange={(event) => update('city', event.target.value)}>{['Any', 'Mumbai', 'Delhi', 'Bengaluru', 'Ahmedabad', 'Hyderabad'].map((city) => <option key={city}>{city}</option>)}</select></label>
        <label>Religion<select value={filters.religion} onChange={(event) => update('religion', event.target.value)}>{['Any', 'Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain'].map((item) => <option key={item}>{item}</option>)}</select></label>
        <div className="range-row">
          <label>Min age<input value={filters.minAge} onChange={(event) => update('minAge', Number(event.target.value))} type="number" min="18" /></label>
          <label>Max age<input value={filters.maxAge} onChange={(event) => update('maxAge', Number(event.target.value))} type="number" max="70" /></label>
        </div>
        <Button variant="ghost" onClick={() => setFilters(defaultFilters)}><SlidersHorizontal size={17} /> Reset</Button>
      </aside>
      <div className="profile-grid">
        {profiles.map((profile) => <ProfileCard key={profile.id} profile={profile} interested={interests.includes(profile.id)} shortlisted={shortlist.includes(profile.id)} onInterest={onInterest} onShortlist={onShortlist} onMessage={onMessage} onCall={onCall} />)}
        {!profiles.length && <EmptyState icon={Search} title="No profiles found"><p>Try relaxing the filters.</p></EmptyState>}
      </div>
    </section>
  );
}
