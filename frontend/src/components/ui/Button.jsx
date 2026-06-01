import React from 'react';

const variantClass = {
  primary: 'primary-button',
  ghost: 'ghost-button',
  icon: 'icon-button',
  danger: 'danger-button'
};

export default function Button({
  children,
  variant = 'primary',
  size,
  done = false,
  className = '',
  type = 'button',
  ...props
}) {
  const classes = [variantClass[variant] || variantClass.primary, size, done ? 'done' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
