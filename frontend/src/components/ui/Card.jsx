import React from 'react';

export default function Card({ as: Element = 'article', className = '', children, ...props }) {
  return (
    <Element className={className} {...props}>
      {children}
    </Element>
  );
}
