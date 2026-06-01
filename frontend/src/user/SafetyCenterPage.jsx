import React from 'react';
import { AlertTriangle, BadgeCheck, Bot, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function SafetyCenterPage({ notify, cmsPages = [] }) {
  const safetyContent = cmsPages.find((page) => page.slug === 'safety-center' && page.status !== 'draft');

  return (
    <section className="product-page">
      <div className="page-hero compact-hero">
        <span><ShieldCheck size={16} /> Trust & safety</span>
        <h1>{safetyContent?.title || 'Verification, moderation, and fraud protection'}</h1>
        <p>{safetyContent?.content || 'Government ID, PAN, employment, income, selfie, face match, content moderation, scam reporting, and emergency support workflows are represented here.'}</p>
      </div>
      <div className="workflow-grid">
        {[
          ['Government ID verification', BadgeCheck, 'Aadhaar, PAN, passport, and manual KYC review'],
          ['Face match verification', ShieldCheck, 'Selfie/live photo status and confidence score'],
          ['Fraud detection', Bot, 'Fake profile, spam, toxic behavior, and scam risk flags'],
          ['Emergency reporting', ShieldAlert, 'Report scam, abuse, harassment, or suspicious account']
        ].map(([title, Icon, text]) => (
          <article className="workflow-card" key={title}>
            <Icon />
            <strong>{title}</strong>
            <p>{text}</p>
            <button className="ghost-button" onClick={() => notify(`${title} request submitted`)}><AlertTriangle size={16} /> Start</button>
          </article>
        ))}
      </div>
    </section>
  );
}
