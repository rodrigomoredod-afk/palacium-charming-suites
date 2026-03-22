
import React from 'react';
import { galleryImages } from '../images';
import { ViewType } from '../types';

interface GalleryProps {
  navigateTo: (view: ViewType) => void;
}

const Gallery: React.FC<GalleryProps> = ({ navigateTo }) => {
  const images = galleryImages;

  return (
    <div className="bg-bone min-h-screen pt-32 pb-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center">
          <span className="text-gold uppercase tracking-[0.6em] text-xs font-semibold block mb-6">Visual Journey</span>
          <h1 className="font-serif text-5xl md:text-7xl text-charcoal">Galeria de <span className="italic">Imagens</span></h1>
          <p className="text-charcoal/40 mt-4 font-light italic">A harmonia entre a herança de 1905 e o design contemporâneo.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, i) => (
            <div key={i} className="aspect-square overflow-hidden group cursor-pointer scroll-reveal shadow-sm hover:shadow-xl transition-shadow duration-500 bg-charcoal/5" style={{transitionDelay: `${i * 50}ms`}}>
              <img 
                src={img.src} 
                loading="lazy" 
                alt={img.alt} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" 
              />
              <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-4">
                 <p className="text-white text-[10px] uppercase tracking-widest text-center font-bold">{img.alt}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
           <p className="text-charcoal/30 text-[10px] uppercase tracking-[0.3em] font-bold">A essência de Figueiró dos Vinhos</p>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
