import React, { useState } from 'react';
import { ImagePlus, UserPlus, Video } from 'lucide-react';

const cityOptions = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Ahmedabad', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata',
  'Jaipur', 'Lucknow', 'Surat', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
  'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
  'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad',
  'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur',
  'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Guwahati',
  'Chandigarh', 'Mysuru', 'Noida', 'Gurugram', 'Dehradun', 'Dubai', 'Singapore', 'London', 'Toronto'
];
const religionOptions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist'];

export default function RegisterPage({ onRegister }) {
  const [preview, setPreview] = useState({ photo: '', intro_video: '' });
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    age: 25,
    height: '5ft 5in',
    city: 'Mumbai',
    religion: 'Hindu',
    community: '',
    profession: '',
    education: '',
    income: '',
    bio: '',
    photo: '',
    intro_video: '',
    photoFile: null,
    introVideoFile: null
  });

  const update = (key, value) => setForm({ ...form, [key]: value });
  const pickMedia = (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'photo') {
      setPreview({ ...preview, photo: url });
      setForm({ ...form, photo: url, photoFile: file });
      return;
    }
    setPreview({ ...preview, intro_video: url });
    setForm({ ...form, intro_video: url, introVideoFile: file });
  };

  return (
    <section className="form-shell">
      <form className="wide-form" onSubmit={(event) => { event.preventDefault(); onRegister(form); }}>
        <h2>Create your profile</h2>
        <div className="registration-media">
          <div className="media-preview-card">
            {preview.photo ? <img src={preview.photo} alt="Profile preview" /> : <div className="empty-media">Profile photo</div>}
            <label className="upload-tile">
              <ImagePlus size={17} /> Upload profile photo
              <input type="file" accept="image/*" onChange={(event) => pickMedia(event, 'photo')} />
            </label>
          </div>
          <div className="media-preview-card">
            {preview.intro_video ? <video src={preview.intro_video} controls /> : <div className="empty-media">Intro video</div>}
            <label className="upload-tile">
              <Video size={17} /> Upload intro video
              <input type="file" accept="video/*" onChange={(event) => pickMedia(event, 'video')} />
            </label>
          </div>
        </div>
        <div className="form-grid">
          {['name', 'email', 'password', 'community', 'profession', 'education', 'income'].map((field) => (
            <label key={field}>{field.replace(/\b\w/g, (letter) => letter.toUpperCase())}
              <input value={form[field]} onChange={(event) => update(field, event.target.value)} type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'} required={field !== 'photo'} />
            </label>
          ))}
          <label>Age<input value={form.age} onChange={(event) => update('age', Number(event.target.value))} type="number" min="18" max="70" /></label>
          <label>Height<input value={form.height} onChange={(event) => update('height', event.target.value)} /></label>
          <label>City<select value={form.city} onChange={(event) => update('city', event.target.value)}>{cityOptions.map((city) => <option key={city}>{city}</option>)}</select></label>
          <label>Religion<select value={form.religion} onChange={(event) => update('religion', event.target.value)}>{religionOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
        </div>
        <label>About you<textarea value={form.bio} onChange={(event) => update('bio', event.target.value)} rows="4" required /></label>
        <button className="primary-button" type="submit"><UserPlus size={17} /> Submit profile</button>
      </form>
    </section>
  );
}
