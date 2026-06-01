import React from 'react';

export default function SectionHeading({ eyebrow, title, children, centered = false }) {
  return (
    <div className={centered ? 'section-heading centered' : 'section-heading'}>
      {eyebrow && <span>{eyebrow}</span>}
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
}
