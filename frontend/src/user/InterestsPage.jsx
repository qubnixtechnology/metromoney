import React from 'react';
import { Check, Heart, MessageCircle, Phone, Star, Video, X } from 'lucide-react';

export default function InterestsPage({ profiles, interests, shortlist, onInterest, onShortlist, onMessage, onCall }) {
  const interestProfiles = profiles.filter((profile) => interests.includes(profile.id) || shortlist.includes(profile.id));
  const suggestions = profiles.filter((profile) => profile.status === 'approved').slice(0, 4);

  return (
    <section className="product-page">
      <div className="section-heading">
        <span>Interest center</span>
        <h2>Manage sent, received, and family introduction requests</h2>
      </div>
      <div className="workflow-grid">
        {['Sent interests', 'Received interests', 'Super interests', 'Family introductions'].map((title, index) => (
          <article className="workflow-card" key={title}>
            <Heart />
            <strong>{title}</strong>
            <p>{index === 0 ? `${interests.length} sent` : 'Demo queue ready for backend sync'}</p>
          </article>
        ))}
      </div>
      <div className="table-panel">
        <h3>Action queue</h3>
        {(interestProfiles.length ? interestProfiles : suggestions).map((profile) => (
          <article className="queue-row" key={profile.id}>
            <img src={profile.photo} alt={profile.name} />
            <div>
              <strong>{profile.name}</strong>
              <p>{profile.city} - {profile.community} - {profile.match || 84}% match</p>
            </div>
            <button className="primary-button" onClick={() => onInterest(profile)}><Check size={16} /> Send</button>
            <button className="ghost-button" onClick={() => onMessage(profile, `Hi ${profile.name}, our family would like to connect.`)}><MessageCircle size={16} /> Message</button>
            <button className="icon-button" onClick={() => onCall(profile, 'audio')} aria-label="Audio call"><Phone size={17} /></button>
            <button className="icon-button" onClick={() => onCall(profile, 'family_video')} aria-label="Family video call"><Video size={17} /></button>
            <button className="icon-button" onClick={() => onShortlist(profile)} aria-label="Shortlist"><Star size={17} /></button>
            <button className="icon-button" aria-label="Reject"><X size={17} /></button>
          </article>
        ))}
      </div>
    </section>
  );
}
