import React from 'react';
import { CalendarDays, Camera, CheckCircle, Crown, Heart, HeartHandshake, MessageCircle, Phone, Search, ShieldAlert, ShieldCheck, Sparkles, Star, UserRound, Video } from 'lucide-react';
import { Button, Card, SectionHeading } from '../components/ui';
import { profileCompletion } from '../utils/matchmaking';

export default function DashboardPage({ user, setView, profiles, interests, shortlist, messages, calls = [], notifications = [], notify }) {
  const recommendations = profiles.filter((profile) => profile.status === 'approved').slice(0, 3);
  const userProfile = profiles.find((profile) => profile.id === user?.id) || user;
  const dashboardCards = [
    { label: 'Profile completion', value: `${profileCompletion(userProfile)}%`, text: 'Complete profile details and media.' },
    { label: 'New matches', value: recommendations.length, text: 'Recommendations from actual approved profiles.' },
    { label: 'Interests sent', value: interests.length, text: 'Profiles contacted by this account.' },
    { label: 'Trust score', value: userProfile?.verified ? 'Verified' : 'Pending', text: 'Based on account verification status.' }
  ];
  const userTools = [
    {
      title: 'Create profile',
      text: userProfile?.bio ? 'Profile created. Edit details anytime.' : 'Complete your profile details and partner preferences.',
      value: userProfile?.bio ? 'Active' : 'Pending',
      icon: UserRound,
      action: () => setView('profile')
    },
    {
      title: 'Upload photos/videos',
      text: 'Add profile photos, intro video, voice intro, and privacy controls.',
      value: userProfile?.photo ? 'Photo added' : 'Add media',
      icon: Camera,
      action: () => setView('profile')
    },
    {
      title: 'Search matches',
      text: 'Use filters for age, city, religion, profession, and verified profiles.',
      value: `${recommendations.length}+ today`,
      icon: Search,
      action: () => setView('discover')
    },
    {
      title: 'Chat/call',
      text: 'Message matches and schedule audio, video, or family meetings.',
      value: `${messages.length} chats, ${calls.length} calls`,
      icon: MessageCircle,
      action: () => setView('messages')
    },
    {
      title: 'Send interests',
      text: 'Send interest, super interest, and personalized introduction messages.',
      value: `${interests.length} sent`,
      icon: Heart,
      action: () => setView('interests')
    },
    {
      title: 'Upgrade plans',
      text: 'Unlock contact details, unlimited messaging, and priority listing.',
      value: user?.premium || user?.plan === 'premium' || user?.plan === 'elite' ? 'Premium' : 'Free',
      icon: Crown,
      action: () => setView('subscription')
    },
    {
      title: 'Shortlist users',
      text: 'Save profiles you like and revisit them from your matches page.',
      value: `${shortlist.length} saved`,
      icon: Star,
      action: () => setView('matches')
    },
    {
      title: 'Block/report users',
      text: 'Report scam, abuse, fake profiles, or block unsafe users.',
      value: 'Safety ready',
      icon: ShieldAlert,
      action: () => setView('safety')
    }
  ];

  return (
    <section className="product-page dashboard-page">
      <div className="page-hero compact-hero">
        <span><Sparkles size={16} /> Your matrimony dashboard</span>
        <h1>Welcome{user?.name ? `, ${user.name}` : ''}</h1>
        <p>Track profile strength, review smart matches, respond to interests, and move toward family-approved conversations.</p>
        <div className="hero-actions">
          <Button onClick={() => setView('discover')}><HeartHandshake size={17} /> Discover matches</Button>
          <Button variant="ghost" onClick={() => setView('subscription')}><ShieldCheck size={17} /> Upgrade plan</Button>
        </div>
      </div>

      <div className="stat-grid">
        {dashboardCards.map((card) => (
          <Card className="stat-card" key={card.label}>
            <strong>{card.value}</strong>
            <span>{card.label}</span>
            <p>{card.text}</p>
          </Card>
        ))}
      </div>

      <section className="panel user-tools-panel">
        <SectionHeading eyebrow="Your account tools" title={`Everything available for ${user?.name || 'this user'}`}>
          <p>These actions belong to the logged-in user account and update or navigate only within that user journey.</p>
        </SectionHeading>
        <div className="user-tool-grid">
          {userTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card className="user-tool-card" key={tool.title}>
                <div>
                  <Icon />
                  <span>{tool.value}</span>
                </div>
                <strong>{tool.title}</strong>
                <p>{tool.text}</p>
                <Button variant="ghost" onClick={tool.action}>Open</Button>
              </Card>
            );
          })}
        </div>
      </section>

      <div className="dashboard-split">
        <section className="panel">
          <h2>Recommended today</h2>
          <div className="mini-profile-list">
            {recommendations.map((profile) => (
              <article key={profile.id}>
                <img src={profile.photo} alt={profile.name} />
                <div>
                  <strong>{profile.name}</strong>
                  <p>{profile.age} yrs - {profile.city} - {profile.profession}</p>
                </div>
                <span>{profile.match || 86}%</span>
              </article>
            ))}
          </div>
        </section>
        <section className="panel">
          <h2>Activity</h2>
          <div className="activity-list">
            {notifications.map((item) => (
              <article key={item.id}>
                <CheckCircle size={18} />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
                <small>{item.time}</small>
              </article>
            ))}
            <article>
              <Phone size={18} />
              <div>
                <strong>Audio/video call</strong>
                <p>{calls.length ? `${calls.length} call request scheduled.` : 'Call requests are ready after interest acceptance.'}</p>
              </div>
              <small>{calls.length ? 'Scheduled' : 'Ready'}</small>
            </article>
            <article>
              <Video size={18} />
              <div>
                <strong>Intro video</strong>
                <p>Upload an introduction video from profile media.</p>
              </div>
              <small>Optional</small>
            </article>
            <article>
              <CalendarDays size={18} />
              <div>
                <strong>Family meeting scheduler</strong>
                <p>Pick a date and create a family video meeting request.</p>
              </div>
              <small>Ready</small>
            </article>
          </div>
        </section>
      </div>
    </section>
  );
}
