
import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';

// Declaration to satisfy TS since we are using CDN
declare const L: any;

const LOCATIONS = [
  {
    id: 'palacium',
    name: "Palacium Charming Suites",
    lat: 39.9045,
    lng: -8.2755,
    type: 'main',
    desc: "O seu refúgio de luxo.",
    color: '#B89352' // Gold
  },
  {
    id: 'paris',
    name: "Paris by Palacium Group",
    lat: 39.9055,
    lng: -8.2725,
    type: 'highlight',
    desc: "Alojamento Local (Brevemente Snack-Bar).",
    color: '#1A1A1A' // Charcoal
  },
  {
    id: 'renatos',
    name: "Pastelaria Renatos",
    lat: 39.9060,
    lng: -8.2770,
    type: 'poi',
    desc: "Doçaria conventual local.",
    color: '#9CA3AF'
  },
  {
    id: 'tricana',
    name: "Restaurante Tricana",
    lat: 39.9020,
    lng: -8.2780,
    type: 'poi',
    desc: "Sabores tradicionais.",
    color: '#9CA3AF'
  },
  {
    id: 'jardim',
    name: "Jardim Municipal",
    lat: 39.9035,
    lng: -8.2740,
    type: 'poi',
    desc: "O pulmão verde da vila.",
    color: '#9CA3AF'
  }
];

const Map: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Initialize Map centered on Figueiró dos Vinhos
    const map = L.map(mapContainerRef.current, {
      center: [39.9045, -8.2755],
      zoom: 15,
      scrollWheelZoom: false,
      zoomControl: false,
      attributionControl: false
    });

    // Custom Tile Layer (CartoDB Positron for clean, luxury look)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Add Zoom Control at bottom right
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    // Custom Icons
    const createCustomIcon = (color: string, size: 'large' | 'medium' | 'small') => {
      const dim = size === 'large' ? 48 : size === 'medium' ? 36 : 24;
      const html = `
        <div style="
          width: 100%; 
          height: 100%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.3));
        ">
          <svg viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.5" style="width: 100%; height: 100%;">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3" fill="white"></circle>
          </svg>
        </div>
      `;
      return L.divIcon({
        className: 'custom-pin',
        html: html,
        iconSize: [dim, dim],
        iconAnchor: [dim / 2, dim],
        popupAnchor: [0, -dim]
      });
    };

    // Add Markers
    LOCATIONS.forEach(loc => {
      const size = loc.type === 'main' ? 'large' : loc.type === 'highlight' ? 'medium' : 'small';
      const marker = L.marker([loc.lat, loc.lng], {
        icon: createCustomIcon(loc.color, size)
      }).addTo(map);

      // Custom Popup
      const popupContent = `
        <div class="p-4 font-sans text-center min-w-[200px]">
          <h3 class="font-serif text-lg text-charcoal mb-1 ${loc.type === 'main' ? 'text-gold' : ''}">${loc.name}</h3>
          <p class="text-[10px] uppercase tracking-widest text-gray-500 mb-3">${loc.desc}</p>
          ${loc.type !== 'poi' ? `
            <a href="https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}" target="_blank" class="inline-block bg-charcoal text-white text-[9px] uppercase tracking-widest px-4 py-2 rounded-sm hover:bg-gold transition-colors">
              Como Chegar
            </a>
          ` : ''}
        </div>
      `;

      marker.bindPopup(popupContent);

      if (loc.type === 'main') {
        marker.openPopup();
      }
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <section className="relative h-[600px] w-full bg-bone border-t border-charcoal/5">
       <div className="absolute top-0 left-0 w-full h-full z-0" ref={mapContainerRef}></div>
       
       {/* Overlay Content */}
       <div className="absolute top-10 left-6 md:left-16 z-[1000] bg-white/90 backdrop-blur-md p-8 max-w-sm rounded-sm shadow-xl border border-white/20">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-gold text-white rounded-full shrink-0">
               <Navigation className="w-6 h-6" />
            </div>
            <div>
               <span className="text-gold uppercase tracking-[0.3em] text-[10px] font-bold block mb-2">Localização</span>
               <h3 className="font-serif text-2xl text-charcoal">No Coração de <br/><span className="italic">Figueiró.</span></h3>
            </div>
          </div>
          <p className="text-charcoal/60 text-sm leading-relaxed mb-6">
             Estrategicamente posicionado para explorar as Aldeias do Xisto e as praias fluviais do Zêzere, com a melhor gastronomia a poucos passos de distância.
          </p>
          <div className="space-y-3">
             <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gold" />
                <span className="text-xs font-bold text-charcoal">R. Teófilo Braga 85, Figueiró dos Vinhos</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-charcoal"></div>
                <span className="text-xs font-bold text-charcoal">400m do Paris by Palacium Group</span>
             </div>
          </div>
       </div>
    </section>
  );
};

export default Map;
