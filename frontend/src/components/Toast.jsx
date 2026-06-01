import React from 'react';
import { Bell } from 'lucide-react';

export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="toast">
      <Bell size={16} />
      {message}
    </div>
  );
}
