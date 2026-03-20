
import React from 'react';
import { ViewType } from '../types';

interface GalleryProps {
  navigateTo: (view: ViewType) => void;
}

const Gallery: React.FC<GalleryProps> = ({ navigateTo }) => {
  const images = [
    {
       src: "https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/RUDn7frltezngjknJFk8oafCqxNJmaaG.jpg",
       alt: "Árvore de comentários dos hóspedes na receção"
    },
    {
       src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/744509767.jpg?k=a633bc3c998f3cbadf643cf5beddc3c18494bea371af45301d915c9525cf1a3a&o=",
       alt: "Casa de banho espaçosa da Suite Familiar"
    },
    {
       src: "https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/vHQIg6sBl0n0xKagz59hqz5JGLQd6cmC.jpg",
       alt: "Lateral do edifício e piscina coberta"
    },
    {
       src: "https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/TPmBHEfVzvUvIh8grCr4o0XFXYFRI24o.jpg",
       alt: "Acesso exterior às áreas comuns"
    },
    {
       src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/745177471.jpg?k=c24dff0e6f8a5161a7d5f2c8dc1794f4a5e2f2958356bc1dade0b749143bacf3&o=",
       alt: "Interiores luminosos das Suites"
    },
    {
       src: "https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/Q2Zd6YdLShYaXMeDZDwfMKl90qsYkNl6.jpg",
       alt: "Placa em alumínio com o logótipo Palacium"
    },
    {
       src: "https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/OFvAUGIyeS9gNq3a1l9QRC7iSphQz1ZZ.jpg",
       alt: "Estacionamento com carregador para veículos elétricos"
    },
    {
       src: "https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/xuPEoilWulnJ48ZjV23kGAC09UEbDn7Z.jpg",
       alt: "Cozinha de apoio na área comum"
    },
    {
       src: "https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/fRqFOINaSiIXOmnjgyuoKDHGHB1s1Npp.jpg",
       alt: "Bar de apoio perto da piscina"
    },
    {
       src: "https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/oRrKQVbo12p7CE5IfE8cil3ZgH8qzJJx.jpg",
       alt: "Sala de estar e convívio comum"
    },
    {
       src: "https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/Gm07t0KClUs9cwKsFuIbcJJMcpImNRib.jpg",
       alt: "Corredor das suites do primeiro andar"
    },
    {
       src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/734586937.jpg?k=2c223cdecb570f33772fde1e5d981377f980aa294e079653d5f1ad0705bb5e90&o=",
       alt: "Conforto e design nos quartos"
    },
    {
       src: "https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/PFdeDYljiydNBNSfsMoicUfYlOSbb0eO.jpg",
       alt: "Perspetiva lateral da piscina aquecida"
    },
    {
      src: "https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/coZSh9JBdk9eUhhIFse3GCnvtZHCLktq.jpg",
      alt: "Escadaria de acesso à receção"
    },
    {
       src: "https://palacium.pt/Imgs/L2o20PBZHHX399n4O197jE3IcEgL3jaY/AboutUs/MewUPOsd8pccbf69vyVdY96qr4qgAOiu.jpg",
       alt: "Detalhes da decoração clássica"
    }
  ];

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
