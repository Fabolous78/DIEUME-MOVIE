import React from 'react';
import { Film, MessageSquare, Phone, MapPin, ShieldCheck, CreditCard, Sparkles, Tv, Flame, Palette, Share2 } from 'lucide-react';
import { ShopSettings } from '../types';

interface FooterProps {
  settings: ShopSettings;
  onOpenAdmin: () => void;
  onOpenThemeSwitcher: () => void;
  onOpenShareModal: () => void;
  onNavigateTab: (tab: 'home' | 'top_series' | 'top_films' | 'nouveautes' | 'catalog') => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  settings, 
  onOpenAdmin, 
  onOpenThemeSwitcher, 
  onOpenShareModal, 
  onNavigateTab 
}) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs mt-16">
      
      {/* Top Value Props Bar */}
      <div className="border-b border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 bg-slate-900/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div className="p-3 rounded-xl bg-red-600/20 text-red-500">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-white text-sm">Commande Directe WhatsApp</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Envoyez vos choix instantanément au <strong className="text-emerald-400">{settings.whatsappNumber}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div className="p-3 rounded-xl bg-amber-600/20 text-amber-400">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-white text-sm">Localisé à Bukavu / Bagira</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Bagira, Kasha, Kadutu, Ibanda, Panzi & expédition Sud-Kivu
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-white text-sm">Paiements Mobile Money</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                M-Pesa, Airtel Money, Orange Money & Cash à la livraison
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Col 1: Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <img 
              src="/logo.jpg" 
              alt="DIEUME-MOVIE Logo" 
              className="h-9 object-contain rounded bg-slate-900 border border-slate-700/60 p-0.5" 
              referrerPolicy="no-referrer"
            />
            <span className="font-heading font-black text-xl text-white">
              DIEUME-<span className="text-red-500">MOVIE</span>
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Plateforme e-commerce DIEUME-MOVIE pour commander vos films et séries à Bukavu/Bagira. Transfert sur Clé USB, Téléphone ou Téléchargement direct.
          </p>
          <div className="text-slate-300 font-medium">
            Contact direct : <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^\d]/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline font-bold">{settings.whatsappNumber}</a>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-2">
          <h4 className="font-heading font-bold text-white uppercase text-xs tracking-wider mb-2">
            Navigation Rapide
          </h4>
          <ul className="space-y-1.5 font-medium">
            <li>
              <button onClick={() => onNavigateTab('home')} className="hover:text-red-400 transition-colors">
                Accueil
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateTab('top_series')} className="hover:text-red-400 transition-colors flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-purple-400" /> Top Séries
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateTab('top_films')} className="hover:text-red-400 transition-colors flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-amber-400" /> Top Films
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateTab('nouveautes')} className="hover:text-red-400 transition-colors flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-400" /> Nouveautés
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateTab('catalog')} className="hover:text-red-400 transition-colors">
                Tout le Catalogue
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Delivery Options */}
        <div className="space-y-2">
          <h4 className="font-heading font-bold text-white uppercase text-xs tracking-wider mb-2">
            Formats de Réception
          </h4>
          <ul className="space-y-1.5 text-slate-400">
            <li>• Transfert sur Clé USB (32GB / 64GB)</li>
            <li>• Transfert direct sur Téléphone (OTG)</li>
            <li>• Liens de Téléchargement Direct (Drive)</li>
            <li>• Copie sur Disque Dur Externe</li>
            <li>• Gravure DVD / Blu-Ray</li>
          </ul>
        </div>

        {/* Col 4: Personalization & Admin Access */}
        <div className="space-y-3">
          <h4 className="font-heading font-bold text-white uppercase text-xs tracking-wider mb-2">
            Personnalisation & Admin
          </h4>
          <p className="text-[11px] text-slate-400">
            Changer le design visuel du site ou partager le lien officiel à vos clients.
          </p>

          <div className="space-y-2">
            <button
              onClick={onOpenThemeSwitcher}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-amber-400 font-bold text-xs flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-400" />
                <span>Thèmes & Design Visuel</span>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-extrabold">
                5 Styles
              </span>
            </button>

            <button
              onClick={onOpenShareModal}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-emerald-400 font-bold text-xs flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-400" />
                <span>Partager le Lien du Site</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-extrabold">
                Lien Web
              </span>
            </button>

            <button
              onClick={onOpenAdmin}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-slate-500 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Espace Administration</span>
            </button>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-slate-800/80 py-4 px-4 text-center text-slate-500 text-[11px]">
        © {new Date().getFullYear()} DIEUME-MOVIE (Bukavu/Bagira). Tous droits réservés. Commandes expédiées au {settings.whatsappNumber}.
      </div>
    </footer>
  );
};
