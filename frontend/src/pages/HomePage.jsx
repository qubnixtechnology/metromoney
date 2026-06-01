import React from 'react';
import {
  BadgeCheck,
  CalendarHeart,
  Crown,
  HeartHandshake,
  Lock,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  UserPlus,
  Users
} from 'lucide-react';
import { Card, SectionHeading } from '../components/ui';

const iconMap = {
  badge: BadgeCheck,
  calendar: CalendarHeart,
  crown: Crown,
  heart: HeartHandshake,
  lock: Lock,
  message: MessageCircle,
  search: Search,
  shield: ShieldCheck,
  sliders: SlidersHorizontal,
  sparkles: Sparkles,
  star: Star,
  user: UserPlus,
  users: Users
};

const readJson = (page, fallback) => {
  if (!page?.content) return fallback;
  try {
    return JSON.parse(page.content);
  } catch {
    return fallback;
  }
};

export default function HomePage({ setView, cmsPages = [], subscriptionPlans = [] }) {
  const cms = (slug) => cmsPages.find((page) => page.slug === slug && page.status !== 'draft');
  const homeBanner = cms('home-banner');
  const featuredProfiles = readJson(cms('home-showcase'), []).slice(0, 5);
  const galleryProfiles = readJson(cms('home-showcase'), []).slice(1, 6);
  const marriageMoments = readJson(cms('marriage-moments'), []);
  const quickSearchFilters = readJson(cms('quick-search-filters'), []);
  const journeySteps = readJson(cms('journey-cards'), []);
  const trustCards = readJson(cms('trust-cards'), []);
  const weddingServices = readJson(cms('wedding-services'), []);
  const featureCards = readJson(cms('feature-cards'), []);
  const storiesContent = cms('success-stories');
  const storyRows = storiesContent?.content
    ? storiesContent.content.split('\n').map((row) => row.split('|').map((part) => part.trim())).filter((parts) => parts.length >= 3)
    : [];

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={16} /> Pink-themed premium matchmaking</div>
          <h1>{homeBanner?.title || 'Bharat Matrimony'}</h1>
          <p>{homeBanner?.content || 'Discover graceful, verified profiles in a beautiful matchmaking experience designed for families, meaningful conversations, and confident life decisions.'}</p>
          <div className="hero-actions">
            <button className="primary-button big" onClick={() => setView('register')}><UserPlus /> Create profile</button>
            <button className="ghost-button big" onClick={() => setView('discover')}><Search /> Browse matches</button>
          </div>
          <div className="hero-search-card" aria-label="Quick partner search">
            <div>
              <span>Find your partner</span>
              <strong>Start with city, profession, or verified profiles</strong>
            </div>
            <div className="quick-filter-row">
              {quickSearchFilters.map((filter) => <button key={filter} onClick={() => setView('discover')}>{filter}</button>)}
            </div>
            <button className="primary-button" onClick={() => setView('discover')}><Search size={17} /> Search now</button>
          </div>
          <div className="trust-row">
            <span><ShieldCheck size={16} /> Verified profiles</span>
            <span><HeartHandshake size={16} /> Serious connections</span>
            <span><Sparkles size={16} /> Premium experience</span>
          </div>
          <div className="metric-strip">
            <span><strong>25K+</strong> verified members</span>
            <span><strong>120+</strong> communities</span>
            <span><strong>24/7</strong> admin review</span>
          </div>
        </div>
        <div className="hero-visual" aria-label="Featured matrimonial profile collage">
          <div className="hero-floating-card top">
            <BadgeCheck size={18} />
            <span>Verified family profiles</span>
          </div>
          <div className="hero-floating-card bottom">
            <MapPin size={18} />
            <span>Top cities: Mumbai, Delhi, Bengaluru</span>
          </div>
          {featuredProfiles.map((profile, index) => (
            <Card key={profile.id} className={`photo-card card-${index + 1}`}>
              <img src={profile.photo} alt={profile.name} />
              <span>{profile.name}<small>{profile.city} - {profile.profession}</small></span>
            </Card>
          ))}
        </div>
      </section>
      <section className="aesthetic-gallery" aria-label="Featured aesthetic profiles">
        <SectionHeading eyebrow="Curated profiles" title="Elegant matches with verified details" />
        <div className="gallery-grid">
          {galleryProfiles.map((profile) => (
            <Card className="gallery-card" key={profile.id}>
              <img src={profile.cover || profile.photo} alt={`${profile.name} profile mood`} />
              <div>
                <strong>{profile.name}</strong>
                <p>{profile.age} yrs - {profile.city} - {profile.community}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
      <section className="marriage-moments" aria-label="Marriage related images">
        <div className="section-heading centered">
          <span>Wedding inspiration</span>
          <h2>Moments that make marriage beautiful</h2>
          <p>From wedding rings to floral decor and sacred ceremonies, Bharat Matrimony now carries a softer marriage-inspired visual story.</p>
        </div>
        <div className="moments-grid">
          {marriageMoments.map((moment) => (
            <Card className="moment-card" key={moment.title}>
              <img src={moment.image} alt={moment.title} />
              <div>
                <strong>{moment.title}</strong>
                <p>{moment.text}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
      <section className="home-info-section" aria-label="How Bharat Matrimony works">
        <div className="section-heading centered">
          <span>Simple journey</span>
          <h2>From profile creation to family conversations</h2>
          <p>Every important matrimony step is designed to feel clear, safe, and premium for both users and families.</p>
        </div>
        <div className="journey-grid">
          {journeySteps.map(({ title, icon, text }, index) => {
            const Icon = iconMap[icon] || Sparkles;
            return (
            <Card className="journey-card" key={title}>
              <div className="step-number">0{index + 1}</div>
              <Icon />
              <h3>{title}</h3>
              <p>{text}</p>
            </Card>
            );
          })}
        </div>
      </section>
      <section className="trust-section" aria-label="Trust and safety features">
        <div className="trust-panel">
          <div className="section-heading">
            <span>Built for trust</span>
            <h2>A safer place for serious matchmaking</h2>
            <p>Bharat Matrimony combines profile verification, privacy controls, admin review, and family involvement so users can move forward with confidence.</p>
          </div>
          <div className="trust-metrics">
            <span><strong>92%</strong> average trust score</span>
            <span><strong>4-step</strong> profile review</span>
            <span><strong>24/7</strong> report handling</span>
          </div>
        </div>
        <div className="trust-card-grid">
          {trustCards.map(({ title, icon, text }) => {
            const Icon = iconMap[icon] || ShieldCheck;
            return (
            <Card className="trust-card" key={title}>
              <Icon />
              <h3>{title}</h3>
              <p>{text}</p>
            </Card>
            );
          })}
        </div>
      </section>
      <section className="premium-preview" aria-label="Premium membership preview">
        <div className="section-heading centered">
          <span>Memberships</span>
          <h2>Choose the support level your search needs</h2>
          <p>Free users can begin searching, while premium members unlock deeper communication, visibility, and family features.</p>
        </div>
        <div className="premium-preview-grid">
          {subscriptionPlans.map((plan) => (
            <Card className={`premium-card ${plan.id === 'premium' ? 'featured-plan' : ''}`} key={plan.id}>
              <Crown />
              <span>{plan.name}</span>
              <h3>{plan.price === '0' ? 'Free' : `Rs. ${plan.price}`}</h3>
              <p>{plan.period}</p>
              <ul>
                {plan.features.slice(0, 3).map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
            </Card>
          ))}
        </div>
      </section>
      <section className="stories-section" aria-label="Success stories">
        <div className="section-heading">
          <span>Success stories</span>
          <h2>{storiesContent?.title || 'Real journeys, meaningful beginnings'}</h2>
        </div>
        <div className="story-grid">
          {storyRows.map(([names, location, text]) => (
            <Card className="story-card" key={names}>
              <Star />
              <h3>{names}</h3>
              <strong>{location}</strong>
              <p>{text}</p>
            </Card>
          ))}
        </div>
      </section>
      <section className="wedding-ecosystem" aria-label="Wedding services">
        <div>
          <div className="eyebrow"><CalendarHeart size={16} /> Wedding ecosystem</div>
          <h2>Support after the match is successful</h2>
          <p>Beyond matchmaking, the platform can guide couples and families toward trusted wedding services for the next chapter.</p>
        </div>
        <div className="service-pill-grid">
          {weddingServices.map((service) => <span key={service}>{service}</span>)}
        </div>
      </section>
      <section className="home-cta-band" aria-label="Create matrimonial profile">
        <div>
          <span>Ready for a meaningful match?</span>
          <h2>Create a premium profile and meet verified families</h2>
          <p>Begin with your details, add photos, set partner preferences, and start receiving thoughtful recommendations.</p>
        </div>
        <div className="home-cta-actions">
          <button className="primary-button big" onClick={() => setView('register')}><UserPlus /> Register free</button>
          <button className="ghost-button big" onClick={() => setView('discover')}><Search /> View matches</button>
        </div>
      </section>
      <section className="feature-band">
        {featureCards.map(({ title, icon, text }) => {
          const Icon = iconMap[icon] || Sparkles;
          return (
          <Card className="feature" key={title}>
            <Icon />
            <h3>{title}</h3>
            <p>{text}</p>
          </Card>
          );
        })}
      </section>
    </>
  );
}
