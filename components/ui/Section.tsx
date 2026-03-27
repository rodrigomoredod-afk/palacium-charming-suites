import React from 'react';

interface SectionProps {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

export default function Section({ id, className = '', containerClassName = '', children }: SectionProps) {
  return (
    <section id={id} className={className}>
      <div className={`max-w-7xl mx-auto ${containerClassName}`}>{children}</div>
    </section>
  );
}
