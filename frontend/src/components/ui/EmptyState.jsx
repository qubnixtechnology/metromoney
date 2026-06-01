import React from 'react';

export default function EmptyState({ icon: Icon, title, children, page = false, action }) {
  return (
    <section className={page ? 'empty-state page' : 'empty-state'}>
      {Icon && <Icon />}
      {title && <h3>{title}</h3>}
      {children}
      {action}
    </section>
  );
}
