import React, { useState } from 'react';
import { MessageCircle, Phone, Video } from 'lucide-react';
import { Button } from '../components/ui';

export default function MessagesPage({ messages, calls = [], setMessages }) {
  const [draft, setDraft] = useState('');

  return (
    <section className="content-section two-column">
      <div>
        <h2>Messages</h2>
        <div className="conversation-list">
          {messages.map((message) => (
            <article className="message-item" key={message.id}>
              <strong>{message.from}</strong>
              <p>{message.text}</p>
              <span>{message.time}</span>
            </article>
          ))}
        </div>
      </div>
      <form className="quick-message" onSubmit={(event) => { event.preventDefault(); if (!draft.trim()) return; setMessages([{ id: Date.now(), from: 'You', text: draft, time: 'Now' }, ...messages]); setDraft(''); }}>
        <h3>Quick note</h3>
        <textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message" rows="6" />
        <Button type="submit"><MessageCircle size={17} /> Send note</Button>
        <div className="call-list">
          <h3>Scheduled calls</h3>
          {calls.map((call) => (
            <article key={call.id}>
              {call.call_type === 'audio' ? <Phone size={17} /> : <Video size={17} />}
              <div>
                <strong>{call.with || `Profile #${call.receiver_id}`}</strong>
                <p>{call.call_type?.replace('_', ' ')} - {call.scheduled_at}</p>
              </div>
              <span>{call.status}</span>
            </article>
          ))}
          {!calls.length && <p>No calls scheduled yet.</p>}
        </div>
      </form>
    </section>
  );
}
