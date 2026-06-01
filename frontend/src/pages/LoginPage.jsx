import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { Button, FormField } from '../components/ui';

export default function LoginPage({ onLogin, defaultRole = 'user', adminOnly = false }) {
  const [role, setRole] = useState(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <section className="auth-shell">
      <form className="auth-panel" onSubmit={(event) => { event.preventDefault(); onLogin(email, password, role); }}>
        <h2>{adminOnly ? 'Admin login' : 'Welcome back'}</h2>
        <p>{adminOnly ? 'Use admin credentials to access dashboard, analytics, verification, subscriptions, and moderation.' : 'Login to continue your matchmaking journey.'}</p>
        <FormField label="Email"><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder={adminOnly ? 'Enter admin email' : 'Enter your email'} autoComplete="email" required /></FormField>
        <FormField label="Password"><input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Enter password" autoComplete="current-password" required /></FormField>
        <Button type="submit"><Lock size={17} /> Login</Button>
      </form>
    </section>
  );
}
