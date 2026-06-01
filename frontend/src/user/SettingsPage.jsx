import React from 'react';
import { EyeOff, Lock, ShieldCheck, Smartphone, Trash2 } from 'lucide-react';

export default function SettingsPage({ notify }) {
  return (
    <section className="product-page">
      <div className="section-heading">
        <span>Settings & privacy</span>
        <h2>Control privacy, devices, visibility, and account safety</h2>
      </div>
      <div className="settings-grid">
        {[
          ['Private profile mode', EyeOff, 'Hide profile from non-premium users'],
          ['Two-factor authentication', Lock, 'Require OTP for sensitive login'],
          ['Device management', Smartphone, 'Review active sessions and login history'],
          ['Hide contact details', ShieldCheck, 'Control phone, income, last seen, photos'],
          ['Pause account', EyeOff, 'Temporarily hide from discovery'],
          ['Delete account', Trash2, 'Request permanent deletion with grace period']
        ].map(([title, Icon, text]) => (
          <article className="settings-card" key={title}>
            <Icon />
            <div>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
            <button className="ghost-button" onClick={() => notify(`${title} updated`)}>Toggle</button>
          </article>
        ))}
      </div>
    </section>
  );
}

