import React, { useState } from 'react';
import { Check, Crown, Heart, Mail, MessageCircle, Phone, ShieldAlert, ShieldCheck, Star, Video } from 'lucide-react';
import { Button, Card } from './ui';

export default function ProfileCard({ profile, interested, shortlisted, onInterest, onShortlist, onMessage, onCall }) {
  const [messageOpen, setMessageOpen] = useState(false);
  const [text, setText] = useState(`Hi ${profile.name}, I liked your profile and would like to connect.`);
  const risk = profile.fraudRisk || { level: 'Low', score: 0, flags: [] };

  return (
    <Card className="profile-card">
      <div className="profile-photo">
        <img src={profile.photo} alt={profile.name} />
        {profile.premium && <span className="premium"><Crown size={14} /> Premium</span>}
      </div>
      <div className="profile-body">
        <div className="profile-title">
          <div>
            <h3>{profile.name}</h3>
            <p>{profile.age} yrs, {profile.height}, {profile.city}</p>
          </div>
          <span className="match">{profile.match || 80}%</span>
        </div>
        <p className="match-summary">{profile.compatibilitySummary || 'Compatibility is calculated from profile details.'}</p>
        <div className="safety-row">
          <span className={risk.level === 'Low' ? 'risk-low' : risk.level === 'Medium' ? 'risk-medium' : 'risk-high'}>
            {risk.level === 'Low' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />} {risk.level} risk
          </span>
          <small>{risk.flags?.length ? risk.flags.slice(0, 2).join(', ') : 'No major flags'}</small>
        </div>
        <p className="bio">{profile.bio}</p>
        <div className="tags">
          {[profile.religion, profile.community, profile.profession, profile.education].filter(Boolean).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className="card-actions">
          <Button done={interested} onClick={() => onInterest(profile)}>
            {interested ? <Check size={17} /> : <Heart size={17} />} {interested ? 'Sent' : 'Interest'}
          </Button>
          <Button variant="icon" onClick={() => onShortlist(profile)} aria-label="Shortlist">{shortlisted ? <Star fill="currentColor" /> : <Star />}</Button>
          <Button variant="icon" onClick={() => setMessageOpen(!messageOpen)} aria-label="Message"><Mail /></Button>
          <Button variant="icon" onClick={() => onCall?.(profile, 'audio')} aria-label="Audio call"><Phone /></Button>
          <Button variant="icon" onClick={() => onCall?.(profile, 'family_video')} aria-label="Video call"><Video /></Button>
        </div>
        {messageOpen && (
          <div className="message-box">
            <textarea value={text} onChange={(event) => setText(event.target.value)} rows="3" />
            <Button variant="ghost" onClick={() => { onMessage(profile, text); setMessageOpen(false); }}><MessageCircle size={17} /> Send</Button>
          </div>
        )}
      </div>
    </Card>
  );
}
