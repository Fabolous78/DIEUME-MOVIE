import React, { useState, useEffect, useMemo } from 'react';
import { MediaItem, CartItem, DeliveryFormat, ShopSettings, ThemeType } from './types';
import {
  getStoredMedia,
  saveStoredMedia,
  getStoredSettings,
  saveStoredSettings,
  calculateCartTotal,
  getStoredCustomerName,
  setStoredCustomerName,
  clearStoredCustomerName,
} from './utils/helpers';
import { INITIAL_MEDIA_ITEMS } from './data/initialData';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { MediaCard } from './components/MediaCard';
import { MediaDetailModal } from './components/MediaDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminModal } from './components/AdminModal';
import { CustomerModal } from './components/CustomerModal';
import { FilterBar } from './components/FilterBar';
import { TrailerModal } from './components/TrailerModal';
import { Footer } from './components/Footer';
import { ThemeSwitcherModal } from './components/ThemeSwitcher';
import { ShareModal } from './components/ShareModal';
import { Film, Tv, Flame, Sparkles, Search, Layers } from 'lucide-react';

export default function App() {
  // Theme State (5 visual design styles)
  const [currentTheme, setCurrentThemeState] = useState<ThemeType>(() => {
    try {
      return (localStorage.getItem('cinefab_theme_v1') as ThemeType) || 'classic_red';
    } catch {
      return 'classic_red';
    }
  });

  const setCurrentTheme = (theme: ThemeType) => {
    setCurrentThemeState(theme);
    try {
      localStorage.setItem('cinefab_theme_v1', theme);
    } catch (e) {
      console.error('Error saving theme', e);
    }
  };

  const [themeSwitcherOpen, setThemeSwitcherOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  // Catalog State
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(getStoredMedia);
  const [settings, setSettings] = useState<ShopSettings>(getStoredSettings);

  // Customer State (Identifié uniquement avec son Nom)
  const [customerName, setCustomerName] = useState<string>(getStoredCustomerName);
  const [customerOpen, setCustomerOpen] = useState(false);

  // App Views & Tabs
  const [activeTab, setActiveTab] = useState<'home' | 'top_series' | 'top_films' | 'nouveautes' | 'catalog'>('home');

  // Filters & Search
  const [selectedType, setSelectedType] = useState<'all' | 'film' | 'serie'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price_asc' | 'price_desc' | 'rating'>('popular');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Admin state with persistent login session
  const [adminOpen, setAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedInState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('cinefab_admin_logged_in_v1') === 'true';
    } catch {
      return false;
    }
  });

  const setIsAdminLoggedIn = (status: boolean) => {
    setIsAdminLoggedInState(status);
    try {
      if (status) {
        localStorage.setItem('cinefab_admin_logged_in_v1', 'true');
      } else {
        localStorage.removeItem('cinefab_admin_logged_in_v1');
      }
    } catch (e) {
      console.error('Error saving admin auth state', e);
    }
  };

  const [editingItemForAdmin, setEditingItemForAdmin] = useState<MediaItem | null>(null);

  // Modals state
  const [detailItem, setDetailItem] = useState<MediaItem | null>(null);
  const [trailerItem, setTrailerItem] = useState<MediaItem | null>(null);

  // Save media items changes to localStorage
  useEffect(() => {
    saveStoredMedia(mediaItems);
  }, [mediaItems]);

  // Save settings changes to localStorage
  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  // Cart Operations
  const handleAddToCart = (
    media: MediaItem, 
    format: DeliveryFormat = 'Téléchargement Direct', 
    quantity: number = 1,
    seasons: number = 1
  ) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (ci) => ci.media.id === media.id && ci.selectedFormat === format && ci.selectedSeasons === seasons
      );
      if (existingIdx >= 0) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prevCart, { media, quantity, selectedFormat: format, selectedSeasons: seasons }];
    });
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    setCart((prevCart) => {
      const updated = [...prevCart];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleUpdateCartFormat = (index: number, newFormat: DeliveryFormat) => {
    setCart((prevCart) => {
      const updated = [...prevCart];
      updated[index].selectedFormat = newFormat;
      return updated;
    });
  };

  const handleUpdateCartSeasons = (index: number, newSeasons: number) => {
    setCart((prevCart) => {
      const updated = [...prevCart];
      updated[index].selectedSeasons = newSeasons;
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Admin Catalog Operations
  const handleSaveMediaItem = (newItem: MediaItem) => {
    setMediaItems((prev) => {
      const idx = prev.findIndex((i) => i.id === newItem.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newItem;
        return copy;
      }
      return [newItem, ...prev];
    });
  };

  const handleDeleteMediaItem = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce titre du catalogue ?')) {
      setMediaItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const handleToggleAdminBadge = (id: string, badgeType: 'isTopFilm' | 'isTopSerie' | 'isNouveaute') => {
    setMediaItems((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          return { ...i, [badgeType]: !i[badgeType] };
        }
        return i;
      })
    );
  };

  const handleResetCatalog = () => {
    if (confirm('Réinitialiser le catalogue avec les titres de démo ?')) {
      setMediaItems(INITIAL_MEDIA_ITEMS);
    }
  };

  const handleImportCatalog = (imported: MediaItem[]) => {
    setMediaItems(imported);
  };

  // All unique genres from current catalog
  const allGenres = useMemo(() => {
    const genreSet = new Set<string>();
    mediaItems.forEach((m) => {
      m.genres.forEach((g) => genreSet.add(g));
    });
    return Array.from(genreSet).sort();
  }, [mediaItems]);

  // Derived filtered subsets
  const topFilmsList = useMemo(() => {
    return mediaItems.filter((m) => m.type === 'film' && (m.isTopFilm || m.rating >= 4.7));
  }, [mediaItems]);

  const topSeriesList = useMemo(() => {
    return mediaItems.filter((m) => m.type === 'serie' && (m.isTopSerie || m.rating >= 4.7));
  }, [mediaItems]);

  const nouveautesList = useMemo(() => {
    return mediaItems.filter((m) => m.isNouveaute || m.year >= 2024);
  }, [mediaItems]);

  const featuredList = useMemo(() => {
    const items = mediaItems.filter((m) => m.featured || m.rating >= 4.8);
    return items.length > 0 ? items : mediaItems.slice(0, 4);
  }, [mediaItems]);

  // Filtered catalogue list based on active tab, search, type, genre, sort
  const displayItems = useMemo(() => {
    let list = [...mediaItems];

    // Apply active tab pre-filter
    if (activeTab === 'top_films') {
      list = list.filter((m) => m.type === 'film' && (m.isTopFilm || m.rating >= 4.7));
    } else if (activeTab === 'top_series') {
      list = list.filter((m) => m.type === 'serie' && (m.isTopSerie || m.rating >= 4.7));
    } else if (activeTab === 'nouveautes') {
      list = list.filter((m) => m.isNouveaute || m.year >= 2024);
    }

    // Filter by type pill
    if (selectedType === 'film') {
      list = list.filter((m) => m.type === 'film');
    } else if (selectedType === 'serie') {
      list = list.filter((m) => m.type === 'serie');
    }

    // Filter by genre
    if (selectedGenre !== 'all') {
      list = list.filter((m) => m.genres.includes(selectedGenre));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.synopsis.toLowerCase().includes(q) ||
          m.genres.some((g) => g.toLowerCase().includes(q)) ||
          (m.director && m.director.toLowerCase().includes(q)) ||
          (m.cast && m.cast.some((c) => c.toLowerCase().includes(q)))
      );
    }

    // Sort list
    list.sort((a, b) => {
      if (sortBy === 'newest') return b.year - a.year;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price_asc') return a.priceUsd - b.priceUsd;
      if (sortBy === 'price_desc') return b.priceUsd - a.priceUsd;
      // 'popular'
      return (b.rating * 10 + (b.isNouveaute ? 5 : 0)) - (a.rating * 10 + (a.isNouveaute ? 5 : 0));
    });

    return list;
  }, [mediaItems, activeTab, selectedType, selectedGenre, searchQuery, sortBy]);

  // Customer login/logout handlers
  const handleLoginCustomer = (name: string) => {
    setStoredCustomerName(name);
    setCustomerName(name);
  };

  const handleLogoutCustomer = () => {
    clearStoredCustomerName();
    setCustomerName('');
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartUsd = calculateCartTotal(cart);

  const getThemeBgClass = (theme: ThemeType) => {
    switch (theme) {
      case 'gold_luxury': return 'bg-[#0c0a06]';
      case 'emerald_congo': return 'bg-[#050e0a]';
      case 'cyber_neon': return 'bg-[#060814]';
      case 'royal_purple': return 'bg-[#0d0614]';
      default: return 'bg-[#080a11]';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeBgClass(currentTheme)} text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-300`}>
      
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        cartTotalUsd={totalCartUsd}
        onOpenCart={() => setCartOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenCustomer={() => setCustomerOpen(true)}
        onOpenThemeSwitcher={() => setThemeSwitcherOpen(true)}
        onOpenShareModal={() => setShareModalOpen(true)}
        customerName={customerName}
        isAdminLoggedIn={isAdminLoggedIn}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        settings={settings}
        topSeriesCount={topSeriesList.length}
        topFilmsCount={topFilmsList.length}
        nouveautesCount={nouveautesList.length}
        currentTheme={currentTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        
        {/* Hero Showcase on Home tab when no search filter active */}
        {activeTab === 'home' && !searchQuery && (
          <HeroBanner
            featuredItems={featuredList}
            currencyRateFc={settings.currencyRateFc}
            onSelectItem={(item) => setDetailItem(item)}
            onAddToCart={(item) => handleAddToCart(item)}
            onPlayTrailer={(item) => setTrailerItem(item)}
          />
        )}

        {/* Section Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4" />
              <span>
                {activeTab === 'home' && 'Catalogue de Films & Séries'}
                {activeTab === 'top_series' && 'Interface Top Séries'}
                {activeTab === 'top_films' && 'Interface Top Films'}
                {activeTab === 'nouveautes' && 'Interface Nouveautés'}
                {activeTab === 'catalog' && 'Catalogue Général'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
              {activeTab === 'home' && 'Films et Séries en Vedette'}
              {activeTab === 'top_series' && 'Les Séries les plus Demandées'}
              {activeTab === 'top_films' && 'Les Meilleurs Films de Cinéma'}
              {activeTab === 'nouveautes' && 'Dernières Nouveautés de l\'Année'}
              {activeTab === 'catalog' && 'Explorez tout le Catalogue'}
            </h2>
          </div>

          <p className="text-xs text-slate-400">
            {displayItems.length} titre{displayItems.length > 1 ? 's' : ''} disponible{displayItems.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Home Section Shortcuts (Top Séries, Top Films, Nouveautés) */}
        {activeTab === 'home' && !searchQuery && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Top Series Box */}
            <div
              onClick={() => setActiveTab('top_series')}
              className="bg-gradient-to-br from-purple-950/60 via-slate-900 to-slate-900 p-5 rounded-2xl border border-purple-800/40 hover:border-purple-500/80 cursor-pointer transition-all hover:scale-[1.01] group shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                  <Tv className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-purple-300 bg-purple-500/20 px-2.5 py-1 rounded-full border border-purple-500/30">
                  {topSeriesList.length} Séries
                </span>
              </div>
              <h3 className="font-heading font-extrabold text-xl text-white group-hover:text-purple-300 transition-colors">
                Top Séries TV
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Stranger Things, Squid Game, House of the Dragon, Arcane...
              </p>
            </div>

            {/* Top Films Box */}
            <div
              onClick={() => setActiveTab('top_films')}
              className="bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-900 p-5 rounded-2xl border border-amber-800/40 hover:border-amber-500/80 cursor-pointer transition-all hover:scale-[1.01] group shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
                  <Film className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/30">
                  {topFilmsList.length} Films
                </span>
              </div>
              <h3 className="font-heading font-extrabold text-xl text-white group-hover:text-amber-300 transition-colors">
                Top Films Cinéma
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Gladiator II, Dune 2, Deadpool & Wolverine, Oppenheimer...
              </p>
            </div>

            {/* Nouveautés Box */}
            <div
              onClick={() => setActiveTab('nouveautes')}
              className="bg-gradient-to-br from-red-950/60 via-slate-900 to-slate-900 p-5 rounded-2xl border border-red-800/40 hover:border-red-500/80 cursor-pointer transition-all hover:scale-[1.01] group shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
                  <Flame className="w-6 h-6 animate-pulse" />
                </div>
                <span className="text-xs font-bold text-red-300 bg-red-500/20 px-2.5 py-1 rounded-full border border-red-500/30">
                  {nouveautesList.length} Récents
                </span>
              </div>
              <h3 className="font-heading font-extrabold text-xl text-white group-hover:text-red-300 transition-colors">
                Nouveautés 2024
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Sorties récentes en qualité Full HD et 4K Ultra HD.
              </p>
            </div>
          </div>
        )}

        {/* Filter Controls Bar */}
        <FilterBar
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          sortBy={sortBy}
          setSortBy={setSortBy}
          allGenres={allGenres}
          totalResults={displayItems.length}
        />

        {/* Media Grid */}
        {displayItems.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-extrabold text-xl text-white">
              Aucun résultat trouvé
            </h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Essayez de modifier votre recherche ou de réinitialiser les filtres de genre.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedGenre('all');
              }}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {displayItems.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                currencyRateFc={settings.currencyRateFc}
                onSelectItem={(m) => setDetailItem(m)}
                onAddToCart={(m) => handleAddToCart(m)}
                onPlayTrailer={(m) => setTrailerItem(m)}
                isAdminLoggedIn={isAdminLoggedIn}
                onAdminEdit={(m) => {
                  setEditingItemForAdmin(m);
                  setAdminOpen(true);
                }}
                onAdminDelete={(id) => handleDeleteMediaItem(id)}
                onAdminToggleBadge={handleToggleAdminBadge}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenThemeSwitcher={() => setThemeSwitcherOpen(true)}
        onOpenShareModal={() => setShareModalOpen(true)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Theme Switcher Modal */}
      <ThemeSwitcherModal
        isOpen={themeSwitcherOpen}
        onClose={() => setThemeSwitcherOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={(theme) => {
          setCurrentTheme(theme);
        }}
      />

      {/* Share Site Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        whatsappNumber={settings.whatsappNumber}
      />

      {/* Detail Modal */}
      <MediaDetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        currencyRateFc={settings.currencyRateFc}
        whatsappNumber={settings.whatsappNumber}
        onAddToCart={(item, format, qty, seasons) => handleAddToCart(item, format, qty, seasons)}
        onPlayTrailer={(item) => setTrailerItem(item)}
      />

      {/* Trailer Modal */}
      <TrailerModal
        item={trailerItem}
        onClose={() => setTrailerItem(null)}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onUpdateFormat={handleUpdateCartFormat}
        onUpdateSeasons={handleUpdateCartSeasons}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        settings={settings}
        customerName={customerName}
      />

      {/* Customer Space Modal */}
      <CustomerModal
        isOpen={customerOpen}
        onClose={() => setCustomerOpen(false)}
        customerName={customerName}
        onLoginCustomer={handleLoginCustomer}
        onLogoutCustomer={handleLogoutCustomer}
        settings={settings}
      />

      {/* Admin Panel Modal */}
      <AdminModal
        isOpen={adminOpen}
        onClose={() => {
          setAdminOpen(false);
          setEditingItemForAdmin(null);
        }}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
        mediaItems={mediaItems}
        onSaveMediaItem={handleSaveMediaItem}
        onDeleteMediaItem={handleDeleteMediaItem}
        onResetMediaCatalog={handleResetCatalog}
        onImportCatalog={handleImportCatalog}
        settings={settings}
        onSaveSettings={(s) => setSettings(s)}
        initialEditItem={editingItemForAdmin}
      />

    </div>
  );
}
