import React from 'react';

type SmartImageProps = {
  src: string;
  alt?: string;
  loading?: string;
  className?: string;
  overlay?: boolean;
  qualityMode?: 'cover' | 'contain';
  // Allow passing through additional <img> attributes without fighting React type inference
  // (e.g. decoding, width/height, ref-related props).
  [key: string]: unknown;
};

export default function SmartImage({
  className = '',
  overlay = false,
  qualityMode = 'cover',
  ...props
}: SmartImageProps) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <img
        {...(props as React.ImgHTMLAttributes<HTMLImageElement>)}
        className={`w-full h-full ${qualityMode === 'cover' ? 'object-cover' : 'object-contain'} ${className}`}
      />
      {overlay && <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-charcoal/20 via-transparent to-charcoal/30" />}
    </div>
  );
}
