import React, { useEffect, useState } from 'react';
import { FileText, Save, ShieldCheck } from 'lucide-react';
import { Button, Card } from '../components/ui';

const moduleTitles = {
  'admin-users': 'Users',
  'admin-verification': 'Verification',
  'admin-reports': 'Reports',
  'admin-moderation': 'Moderation',
  'admin-payments': 'Payments',
  'admin-subscriptions': 'Subscriptions',
  'admin-analytics': 'Analytics',
  'admin-cms': 'CMS',
  'admin-marketing': 'Marketing'
};

const cmsTemplates = [
  ['home-banner', 'Homepage banner', 'Bharat Matrimony', 'Main homepage hero title and description.'],
  ['about-us', 'About us page', 'About Bharat Matrimony', 'Company/about page content.'],
  ['success-stories', 'Success stories', 'Real journeys, meaningful beginnings', 'Homepage and success stories page content.'],
  ['blog', 'Blog posts', 'Matrimony Blog', 'Blog intro/content managed by admin.'],
  ['faq', 'FAQ', 'Frequently Asked Questions', 'Questions and answers for users.'],
  ['help-center', 'Help center', 'Help Center', 'Support and help content.'],
  ['terms-and-conditions', 'Terms and conditions', 'Terms and Conditions', 'Legal terms content.'],
  ['privacy-policy', 'Privacy policy', 'Privacy Policy', 'Privacy and data handling content.'],
  ['safety-center', 'Safety center content', 'Verification, moderation, and fraud protection', 'User safety center page content.'],
  ['seo-pages', 'SEO pages', 'SEO Pages', 'SEO landing page content and metadata notes.'],
  ['home-showcase', 'Homepage images', 'Homepage showcase profiles', 'JSON list for homepage profile names and image URLs.'],
  ['marriage-moments', 'Marriage images', 'Marriage moments', 'JSON list for wedding image cards.'],
  ['quick-search-filters', 'Quick filters', 'Quick search filters', 'JSON list for homepage quick filter buttons.'],
  ['journey-cards', 'Journey cards', 'Homepage journey cards', 'JSON list for homepage process cards.'],
  ['trust-cards', 'Trust cards', 'Homepage trust cards', 'JSON list for homepage trust cards.'],
  ['wedding-services', 'Wedding services', 'Wedding services', 'JSON list for service pills.'],
  ['feature-cards', 'Feature cards', 'Homepage feature cards', 'JSON list for feature cards.']
];

function AdminCmsEditor({ cmsPages = [], onSaveCmsPage }) {
  const [selectedSlug, setSelectedSlug] = useState('home-banner');
  const selectedTemplate = cmsTemplates.find(([slug]) => slug === selectedSlug) || cmsTemplates[0];
  const existing = cmsPages.find((page) => page.slug === selectedSlug);
  const [form, setForm] = useState({ slug: selectedSlug, title: selectedTemplate[2], content: '', status: 'published' });

  useEffect(() => {
    const template = cmsTemplates.find(([slug]) => slug === selectedSlug) || cmsTemplates[0];
    const page = cmsPages.find((item) => item.slug === selectedSlug);
    setForm({
      slug: selectedSlug,
      title: page?.title || template[2],
      content: page?.content || '',
      status: page?.status || 'published'
    });
  }, [selectedSlug, cmsPages]);

  return (
    <section className="cms-editor-grid">
      <aside className="cms-page-list">
        <h3>Editable website content</h3>
        {cmsTemplates.map(([slug, label, , help]) => (
          <button key={slug} className={selectedSlug === slug ? 'active' : ''} onClick={() => setSelectedSlug(slug)}>
            <FileText size={17} />
            <span>{label}<small>{help}</small></span>
          </button>
        ))}
      </aside>
      <form className="cms-editor-panel" onSubmit={(event) => { event.preventDefault(); onSaveCmsPage(form); }}>
        <div>
          <span className="status-pill"><FileText size={16} /> {selectedTemplate[1]}</span>
          <h2>Edit content</h2>
          <p>Changes are saved in MySQL CMS pages, so website content can be updated without touching React or PHP files.</p>
        </div>
        <label>Slug<input value={form.slug} readOnly /></label>
        <label>Title<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
        <label>Content<textarea value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} rows="10" /></label>
        <label>Status
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </label>
        <Button type="submit"><Save size={17} /> Save CMS content</Button>
      </form>
    </section>
  );
}

export default function AdminConsolePage({ view, profiles, stats = {}, onApprove, onBlock, notify, cmsPages, onSaveCmsPage }) {
  const users = profiles.filter((profile) => profile.role !== 'admin');
  const value = (key, fallback = 0) => stats[key] ?? fallback;
  const title = moduleTitles[view] || 'Admin';
  const cardsByView = {
    'admin-users': [['Total users', value('total_profiles', users.length)], ['Approved', value('approved_profiles')], ['Premium', value('premium_profiles')]],
    'admin-verification': [['Pending', value('pending_profiles')], ['Verified', value('verified_profiles')], ['Blocked', value('blocked_profiles')]],
    'admin-reports': [['Reports', value('reports')], ['Blocked', value('blocked_profiles')], ['Pending users', value('pending_profiles')]],
    'admin-moderation': [['Reports', value('reports')], ['Blocked', value('blocked_profiles')], ['Messages', value('messages')]],
    'admin-payments': [['Payments', value('payments')], ['Subscriptions', value('subscriptions')], ['Premium users', value('premium_profiles')]],
    'admin-subscriptions': [['Subscriptions', value('subscriptions')], ['Premium users', value('premium_profiles')], ['Payments', value('payments')]],
    'admin-analytics': [['Users', value('total_profiles', users.length)], ['Interests', value('interests')], ['Messages', value('messages')]],
    'admin-marketing': [['Campaigns', value('campaigns')], ['CMS pages', value('cms_pages')], ['Users', value('total_profiles', users.length)]]
  };
  const cards = cardsByView[view] || cardsByView['admin-users'];

  if (view === 'admin-cms') {
    return (
      <section className="admin-shell">
        <div className="admin-console-hero">
          <span><ShieldCheck size={16} /> CMS management</span>
          <h1>CMS</h1>
        </div>
        <AdminCmsEditor cmsPages={cmsPages} onSaveCmsPage={onSaveCmsPage} />
      </section>
    );
  }

  return (
    <section className="admin-shell">
      <div className="admin-console-hero">
        <span><ShieldCheck size={16} /> Admin</span>
        <h1>{title}</h1>
      </div>
      <div className="admin-stats">
        {cards.map(([label, value]) => (
          <Card key={label}>
            <ShieldCheck />
            <span>{value}</span>
            <p>{label}</p>
          </Card>
        ))}
      </div>
      <div className="admin-table">
        <h2>{view === 'admin-users' ? 'Actual users' : 'User records'}</h2>
        {users.map((profile) => (
          <Card className="admin-row" key={profile.id}>
            <img src={profile.photo || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80'} alt={profile.name} />
            <div>
              <strong>{profile.name}</strong>
              <p>{profile.email} - {profile.city || 'No city'} - {profile.status}</p>
            </div>
            <Button variant="ghost" onClick={() => onApprove(profile.id)}>Approve</Button>
            <Button variant="danger" onClick={() => onBlock(profile.id)}>{profile.status === 'blocked' ? 'Unblock' : 'Block'}</Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
