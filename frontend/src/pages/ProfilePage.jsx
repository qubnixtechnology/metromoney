import React, { useEffect, useState } from 'react';
import { Check, Lock, Upload, Video } from 'lucide-react';
import { Button, EmptyState } from '../components/ui';

export default function ProfilePage({ user, onSave, onUploadMedia, setView }) {
  const [form, setForm] = useState(user || {});
  const [uploading, setUploading] = useState('');

  useEffect(() => {
    setForm(user || {});
  }, [user]);

  if (!user) {
    return <EmptyState page icon={Lock} title="Login required" action={<Button onClick={() => setView('login')}>Login</Button>} />;
  }

  const update = (key, value) => setForm({ ...form, [key]: value });
  const upload = async (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(type);
    const url = await onUploadMedia(file, type);
    if (url) update(type === 'video' ? 'intro_video' : 'photo', url);
    setUploading('');
  };

  return (
    <section className="form-shell">
      <form className="wide-form" onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
        <h2>Update profile</h2>
        <div className="profile-editor">
          <div className="media-editor">
            <img src={form.photo || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80'} alt={form.name} />
            {form.intro_video && <video src={form.intro_video} controls />}
            <label className="upload-tile">
              <Upload size={17} /> {uploading === 'photo' ? 'Uploading photo...' : 'Upload profile photo'}
              <input type="file" accept="image/*" onChange={(event) => upload(event, 'photo')} />
            </label>
            <label className="upload-tile">
              <Video size={17} /> {uploading === 'video' ? 'Uploading video...' : 'Upload intro video'}
              <input type="file" accept="video/*" onChange={(event) => upload(event, 'video')} />
            </label>
          </div>
          <div className="form-grid">
            {['name', 'email', 'city', 'religion', 'community', 'profession', 'education', 'income'].map((field) => (
              <label key={field}>{field.replace(/\b\w/g, (letter) => letter.toUpperCase())}
                <input value={form[field] || ''} onChange={(event) => update(field, event.target.value)} />
              </label>
            ))}
            <label>Age<input value={form.age || ''} onChange={(event) => update('age', Number(event.target.value))} type="number" /></label>
          </div>
        </div>
        <label>Bio<textarea value={form.bio || ''} onChange={(event) => update('bio', event.target.value)} rows="4" /></label>
        <Button type="submit"><Check size={17} /> Update profile</Button>
      </form>
    </section>
  );
}
