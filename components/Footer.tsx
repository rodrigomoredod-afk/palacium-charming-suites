
import React from 'react';
import { Instagram, Facebook, Mail, Phone, MapPin, Info, Lock } from 'lucide-react';
import { ViewType } from '../types';
import Logo from './Logo';

interface FooterProps {
  navigateTo: (view: ViewType) => void;
}

const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
  return (
    <footer className="bg-charcoal text-white/80 pt-20 pb-10 px-8 md:px-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="space-y-8">
          <div 
            onClick={() => navigateTo('home')} 
            className="cursor-pointer flex justify-start -ml-4"
          >
            <Logo className="h-24" color="white" />
          </div>
          <p className="text-sm leading-relaxed text-white/50">
            Um refúgio de luxo onde a história portuguesa é celebrada em cada detalhe. O seu retiro exclusivo no coração de Figueiró dos Vinhos.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gold transition-colors" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="hover:text-gold transition-colors" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">Navegação</h3>
          <ul className="space-y-4 text-sm">
            <li><button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">Sobre Nós</button></li>
            <li><button onClick={() => navigateTo('suites')} className="hover:text-white transition-colors">Royal Suites</button></li>
            <li><button onClick={() => navigateTo('experiences')} className="hover:text-white transition-colors">Parceiros</button></li>
            <li><button onClick={() => navigateTo('gallery')} className="hover:text-white transition-colors">Galeria</button></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">Localização e Contacto</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold" />
                <a href="tel:+351965795859" className="hover:text-white transition-colors font-medium">+351 965 795 859</a>
              </div>
              <span className="text-[9px] text-white/30 ml-7 leading-none uppercase tracking-tighter">(chamada para a rede móvel nacional)</span>
            </li>
            <li className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold" />
                <a href="tel:+351236553117" className="hover:text-white transition-colors font-medium">+351 236 553 117</a>
              </div>
              <span className="text-[9px] text-white/30 ml-7 leading-none uppercase tracking-tighter">(chamada para a rede fixa nacional)</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gold" />
              <a href="mailto:geral@palacium.pt" className="hover:text-white transition-colors">geral@palacium.pt</a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gold mt-1 shrink-0" />
              <span className="leading-relaxed">R. Teófilo Braga 85,<br />3260-424 Figueiró dos Vinhos, Portugal</span>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">Informação Legal</h3>
          <div className="space-y-6 flex flex-col items-start">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40 font-bold">
                <Info className="w-3 h-3 text-gold" />
                <span>Dados da Empresa</span>
              </div>
              <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] leading-relaxed font-medium">
                Ibericador, Unipessoal Lda<br />
                NIPC: 507221214<br />
                Capital Social: 100.000,00 €<br />
                Sede: Rua Do Carameleiro, Lt. Hd<br />
                3260-308 Figueiró dos Vinhos
              </p>
            </div>

            <div className="space-y-4 pt-2 border-t border-white/5 w-full">
              <a 
                href="https://www.livroreclamacoes.pt" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-4 hover:bg-white/5 p-2 -ml-2 rounded-sm transition-colors"
                aria-label="Aceder ao Livro de Reclamações Eletrónico"
              >
                <div className="shrink-0">
                  <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60 group-hover:opacity-100 transition-opacity">
                    <rect x="2" y="2" width="44" height="44" rx="4" stroke="white" strokeWidth="2"/>
                    <path d="M14 14H34V34H14V14Z" fill="white"/>
                    <path d="M14 14L20 14V20L14 20V14Z" fill="#1A1A1A"/>
                    <rect x="22" y="16" width="10" height="2" fill="#1A1A1A"/>
                    <rect x="22" y="20" width="10" height="2" fill="#1A1A1A"/>
                    <rect x="16" y="24" width="16" height="2" fill="#1A1A1A"/>
                    <rect x="16" y="28" width="16" height="2" fill="#1A1A1A"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-white group-hover:text-gold transition-colors">Livro de</span>
                  <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-white group-hover:text-gold transition-colors">Reclamações</span>
                </div>
              </a>
              
              <p className="text-[10px] text-white/30 uppercase tracking-widest leading-relaxed">
                Turismo de Portugal<br />RNET: [A aguardar registo]
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <p className="text-[10px] uppercase tracking-widest text-white/20">© 2024 Palacium Charming Suites. Todos os direitos reservados.</p>
        <div className="flex flex-wrap justify-center items-center gap-8 text-[10px] uppercase tracking-widest text-white/30">
          <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
          <a href="#" className="hover:text-white transition-colors">Termos e Condições</a>
          <button onClick={() => navigateTo('admin')} className="hover:text-gold transition-colors flex items-center gap-1 group">
             <Lock className="w-3 h-3 group-hover:text-gold" /> Área Reservada
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
