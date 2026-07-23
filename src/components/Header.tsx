import React, { useState } from 'react';
import { Film, Tv, Sparkles, ShoppingBag, ShieldCheck, Search, Flame, Menu, X, User, Palette, Share2 } from 'lucide-react';
import { ShopSettings, ThemeType } from '../types';

interface HeaderProps {
  activeTab: 'home' | 'top_series' | 'top_films' | 'nouveautes' | 'catalog';
  setActiveTab: (tab: 'home' | 'top_series' | 'top_films' | 'nouveautes' | 'catalog') => void;
  cartCount: number;
  cartTotalUsd: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenCustomer: () => void;
  onOpenThemeSwitcher: () => void;
  onOpenShareModal: () => void;
  customerName: string;
  isAdminLoggedIn: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  settings: ShopSettings;
  topSeriesCount: number;
  topFilmsCount: number;
  nouveautesCount: number;
  currentTheme: ThemeType;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  cartTotalUsd,
  onOpenCart,
  onOpenAdmin,
  onOpenCustomer,
  onOpenThemeSwitcher,
  onOpenShareModal,
  customerName,
  isAdminLoggedIn,
  searchQuery,
  setSearchQuery,
  settings,
  topSeriesCount,
  topFilmsCount,
  nouveautesCount,
  currentTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleNavClick = (tab: 'home' | 'top_series' | 'top_films' | 'nouveautes' | 'catalog') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 text-slate-300 text-xs py-1.5 px-4 text-center flex items-center justify-between border-b border-red-900/30">
        <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-red-600 text-white font-bold tracking-wider uppercase">
              Bukavu / Bagira
            </span>
            <span>Service à Bukavu/Bagira, Kasha, Kadutu, Ibanda & expédition en RDC</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400">
            <span>Taux du jour : <strong className="text-amber-400">1 $ = {settings.currencyRateFc.toLocaleString('fr-FR')} FC</strong></span>
            <span className="hidden md:inline text-green-400 flex items-center gap-1">
              WhatsApp : <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^\d]/g, '')}`} target="_blank" rel="noreferrer" className="hover:underline">{settings.whatsappNumber}</a>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="h-11 px-2 py-1 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center shadow-lg shadow-red-600/20 ring-1 ring-white/10 overflow-hidden">
              <img 
                src="/logo.jpg" 
                alt="DIEUME-MOVIE Logo" 
                className="h-full object-contain rounded" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-2xl tracking-tight text-white">
                  DIEUME-<span className="text-red-500">MOVIE</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-amber-500/30">
                  Bukavu/Bagira
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wider uppercase font-medium">
                FILMS & SÉRIES HD & 4K
              </p>
            </div>
          </div>

          {/* Search bar Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un film, une série, un acteur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/70 focus:border-red-500 rounded-full pl-10 pr-10 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'home'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Accueil
            </button>

            <button
              onClick={() => handleNavClick('top_series')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'top_series'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Tv className="w-4 h-4 text-purple-400" />
              <span>Top Séries</span>
              {topSeriesCount > 0 && (
                <span className="text-[10px] bg-purple-500/30 text-purple-300 px-1.5 py-0.2 rounded-full font-bold">
                  {topSeriesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('top_films')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'top_films'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Film className="w-4 h-4 text-amber-400" />
              <span>Top Films</span>
              {topFilmsCount > 0 && (
                <span className="text-[10px] bg-amber-500/30 text-amber-300 px-1.5 py-0.2 rounded-full font-bold">
                  {topFilmsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('nouveautes')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'nouveautes'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Flame className="w-4 h-4 text-red-400 animate-pulse" />
              <span>Nouveautés</span>
              {nouveautesCount > 0 && (
                <span className="text-[10px] bg-red-500/30 text-red-300 px-1.5 py-0.2 rounded-full font-bold">
                  {nouveautesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('catalog')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'catalog'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Tout le Catalogue
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme Switcher Button */}
            <button
              onClick={onOpenThemeSwitcher}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 text-xs font-bold transition-all"
              title="Changer le style / Design du site"
            >
              <Palette className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline text-[11px]">Design</span>
            </button>

            {/* Share Site Link Button */}
            <button
              onClick={onOpenShareModal}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 text-xs font-bold transition-all"
              title="Partager le lien du site"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline text-[11px]">Partager</span>
            </button>

            {/* Customer Space Button */}
            <button
              onClick={onOpenCustomer}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                customerName
                  ? 'bg-red-950/80 border-red-500/60 text-red-300 hover:bg-red-900 shadow-md shadow-red-900/20'
                  : 'bg-slate-900 border-slate-700/80 text-slate-200 hover:text-white hover:border-slate-500'
              }`}
              title="Mon Espace Client (Se connecter avec son nom)"
            >
              <User className={`w-4 h-4 ${customerName ? 'text-red-400' : 'text-amber-400'}`} />
              <span className="max-w-[90px] truncate hidden sm:inline">
                {customerName ? customerName : 'Espace Client'}
              </span>
            </button>

            {/* Search Trigger for mobile/tablet */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
              aria-label="Rechercher"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Admin Button (Desktop & Mobile) */}
            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isAdminLoggedIn
                  ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900 shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-900 border-slate-700/80 text-amber-300 hover:text-white hover:border-amber-500/50'
              }`}
              title={isAdminLoggedIn ? "Espace Admin Connecté" : "Se connecter comme Admin"}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${isAdminLoggedIn ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className="text-[11px] font-bold hidden sm:inline">
                {isAdminLoggedIn ? 'Admin' : 'Admin'}
              </span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-600/25 hover:from-red-500 hover:to-red-600 transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Panier</span>
              {cartCount > 0 && (
                <span className="bg-white text-red-600 text-xs font-extrabold px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search input popup */}
        {searchOpen && (
          <div className="lg:hidden pb-4 pt-1 px-1">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un film ou une série..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-red-500"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800/80 space-y-2 animate-fadeIn">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-between ${
                activeTab === 'home' ? 'bg-red-600 text-white font-bold' : 'text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span>Accueil</span>
            </button>

            <button
              onClick={() => handleNavClick('top_series')}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-between ${
                activeTab === 'top_series' ? 'bg-red-600 text-white font-bold' : 'text-slate-200 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-purple-400" />
                <span>Top Séries</span>
              </div>
              <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full font-bold">
                {topSeriesCount}
              </span>
            </button>

            <button
              onClick={() => handleNavClick('top_films')}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-between ${
                activeTab === 'top_films' ? 'bg-red-600 text-white font-bold' : 'text-slate-200 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-amber-400" />
                <span>Top Films</span>
              </div>
              <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full font-bold">
                {topFilmsCount}
              </span>
            </button>

            <button
              onClick={() => handleNavClick('nouveautes')}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-between ${
                activeTab === 'nouveautes' ? 'bg-red-600 text-white font-bold' : 'text-slate-200 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-400" />
                <span>Nouveautés</span>
              </div>
              <span className="bg-red-500/20 text-red-300 text-xs px-2 py-0.5 rounded-full font-bold">
                {nouveautesCount}
              </span>
            </button>

            <button
              onClick={() => handleNavClick('catalog')}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-between ${
                activeTab === 'catalog' ? 'bg-red-600 text-white font-bold' : 'text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span>Tout le Catalogue</span>
            </button>

            {/* Account & Admin & Theme & Share in Mobile Drawer */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenThemeSwitcher();
                }}
                className="w-full text-left px-4 py-3 rounded-xl font-bold text-sm bg-slate-900 border border-slate-800 text-amber-400 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span>Changer le Style / Design du site</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md font-extrabold uppercase">
                  5 Thèmes
                </span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenShareModal();
                }}
                className="w-full text-left px-4 py-3 rounded-xl font-bold text-sm bg-slate-900 border border-slate-800 text-emerald-400 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span>Partager le Lien du Site</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-extrabold uppercase">
                  Tous Téléphones
                </span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCustomer();
                }}
                className="w-full text-left px-4 py-3 rounded-xl font-bold text-sm bg-slate-900 border border-slate-700/80 text-amber-300 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span>{customerName ? `Espace Client (${customerName})` : 'Mon Espace Client'}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full text-left px-4 py-3 rounded-xl font-bold text-sm bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Espace Administration</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
