import React from 'react';
import { Bell, Mail, MessageCircle, Smartphone } from 'lucide-react';
import { Card, SectionHeading } from '../components/ui';

export default function NotificationsPage({ notifications = [] }) {
  return (
    <section className="product-page">
      <SectionHeading eyebrow="Notifications" title="Push, email, SMS, and account alerts" />
      <div className="workflow-grid">
        {[
          ['Push notifications', Smartphone, 'New interests, messages, profile views'],
          ['Email reports', Mail, 'Weekly match reports and premium alerts'],
          ['Chat alerts', MessageCircle, 'Typing, read receipts, contact requests'],
          ['Safety alerts', Bell, 'Suspicious activity and account security']
        ].map(([title, Icon, text]) => (
          <Card className="workflow-card" key={title}>
            <Icon />
            <strong>{title}</strong>
            <p>{text}</p>
          </Card>
        ))}
      </div>
      <div className="table-panel">
        <h3>Recent alerts</h3>
        {notifications.map((item) => (
          <Card className="queue-row" key={item.id}>
            <Bell />
            <div>
              <strong>{item.title}</strong>
              <p>{item.body || item.text}</p>
            </div>
            <span className="status-pill">{item.status || item.time}</span>
          </Card>
        ))}
      </div>
    </section>
  );
}
