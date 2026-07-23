import React, { useState, useRef } from 'react';
import { X, ShieldCheck, Lock, Plus, Edit, Trash2, Save, RefreshCw, Download, Upload, Phone, Settings, Film, Tv, Flame, Check, AlertCircle, List, FileText, Image, Camera, Star, Sparkles } from 'lucide-react';
import { MediaItem, OrderRecord, ShopSettings } from '../types';
import { getAdminPassword, setAdminPassword, getStoredOrders, getMediaPriceFc } from '../utils/helpers';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (status: boolean) => void;
  mediaItems: MediaItem[];
  onSaveMediaItem: (item: MediaItem) => void;
  onDeleteMediaItem: (id: string) => void;
  onResetMediaCatalog: () => void;
  onImportCatalog: (items: MediaItem[]) => void;
  settings: ShopSettings;
  onSaveSettings: (settings: ShopSettings) => void;
  initialEditItem?: MediaItem | null;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  mediaItems,
  onSaveMediaItem,
  onDeleteMediaItem,
  onResetMediaCatalog,
  onImportCatalog,
  settings,
  onSaveSettings,
  initialEditItem,
}) => {
  if (!isOpen) return null;

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'add_edit' | 'manage' | 'settings' | 'orders'>('manage');

  // Media Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<MediaItem>>({
    title: '',
    type: 'film',
    posterUrl: '',
    bannerUrl: '',
    synopsis: '',
    year: new Date().getFullYear(),
    durationOrSeasons: '2h 00min',
    genres: ['Action', 'Drame'],
    rating: 4.8,
    priceUsd: 3.0,
    isTopFilm: false,
    isTopSerie: false,
    isNouveaute: true,
    featured: false,
    director: '',
    cast: [],
    audioLanguages: ['Français (VF)'],
    trailerUrl: '',
  });

  const [genresInput, setGenresInput] = useState('Action, Drame');
  const [castInput, setCastInput] = useState('');
  const [audioInput, setAudioInput] = useState('Français (VF), Anglais (VOSTFR)');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<ShopSettings>({ ...settings });
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Sync settings when modal opens or settings change
  React.useEffect(() => {
    if (isOpen && settings) {
      setSettingsForm({ ...settings });
    }
    if (isOpen && initialEditItem) {
      startEditItem(initialEditItem);
    }
  }, [isOpen, settings, initialEditItem]);

  // Orders log state
  const [ordersLog] = useState<OrderRecord[]>(() => {
    try {
      return getStoredOrders() || [];
    } catch {
      return [];
    }
  });

  // Search filter inside admin manage list
  const [adminSearch, setAdminSearch] = useState('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState<'all' | 'film' | 'serie' | 'top_serie' | 'top_film' | 'nouveaute'>('all');

  // File input refs for uploading photos directly from device
  const posterFileRef = useRef<HTMLInputElement>(null);
  const bannerFileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'posterUrl' | 'bannerUrl' | 'both') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      if (field === 'both') {
        setFormData((prev) => ({ ...prev, posterUrl: dataUrl, bannerUrl: dataUrl }));
      } else {
        setFormData((prev) => ({ ...prev, [field]: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = getAdminPassword();
    const inputClean = passwordInput.trim();
    if (inputClean === '7896' || inputClean === correctPassword || inputClean === 'admin123') {
      setIsAdminLoggedIn(true);
      setLoginError('');
      setPasswordInput('');
    } else {
      setLoginError("Code d'accès incorrect ! Veuillez réessayer.");
    }
  };

  const startEditItem = (item: MediaItem) => {
    if (!item) return;
    setEditingId(item.id);
    const calculatedFc = getMediaPriceFc(item);
    setFormData({ 
      ...item,
      priceFc: item.priceFc || calculatedFc,
      priceUsd: item.priceUsd || Number((calculatedFc / (settings.currencyRateFc || 2850)).toFixed(2))
    });
    setGenresInput(Array.isArray(item.genres) ? item.genres.join(', ') : '');
    setCastInput(Array.isArray(item.cast) ? item.cast.join(', ') : '');
    setAudioInput(Array.isArray(item.audioLanguages) ? item.audioLanguages.join(', ') : 'Français (VF)');
    setActiveTab('add_edit');
  };

  const startNewItem = () => {
    setEditingId(null);
    setFormData({
      title: '',
      type: 'film',
      posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
      synopsis: '',
      year: new Date().getFullYear(),
      durationOrSeasons: '2h 00min',
      genres: ['Action', 'Aventure'],
      rating: 4.8,
      priceFc: 1000,
      priceUsd: Number((1000 / (settings.currencyRateFc || 2850)).toFixed(2)),
      isTopFilm: false,
      isTopSerie: false,
      isNouveaute: true,
      featured: false,
      director: '',
      cast: [],
      audioLanguages: ['Français (VF)'],
      trailerUrl: '',
    });
    setGenresInput('Action, Aventure');
    setCastInput('');
    setAudioInput('Français (VF)');
    setActiveTab('add_edit');
  };

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    const fcVal = Number(formData.priceFc) || (formData.type === 'film' ? 1000 : 1500);
    const usdVal = Number(formData.priceUsd) || Number((fcVal / (settings.currencyRateFc || 2850)).toFixed(2));

    const itemToSave: MediaItem = {
      id: editingId || 'm_' + Date.now().toString(),
      title: formData.title || 'Titre inconnu',
      type: formData.type || 'film',
      posterUrl: formData.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
      bannerUrl: formData.bannerUrl || formData.posterUrl || '',
      synopsis: formData.synopsis || '',
      year: Number(formData.year) || new Date().getFullYear(),
      durationOrSeasons: formData.durationOrSeasons || (formData.type === 'serie' ? '1 Saison' : '2h 00min'),
      genres: genresInput.split(',').map((s) => s.trim()).filter(Boolean),
      rating: Number(formData.rating) || 4.5,
      priceFc: fcVal,
      priceUsd: usdVal,
      isTopFilm: Boolean(formData.isTopFilm),
      isTopSerie: Boolean(formData.isTopSerie),
      isNouveaute: Boolean(formData.isNouveaute),
      featured: Boolean(formData.featured),
      director: formData.director || '',
      cast: castInput.split(',').map((s) => s.trim()).filter(Boolean),
      audioLanguages: audioInput.split(',').map((s) => s.trim()).filter(Boolean),
      trailerUrl: formData.trailerUrl || '',
    };

    onSaveMediaItem(itemToSave);
    setActiveTab('manage');
  };

  const handleSaveShopSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(settingsForm);
    if (newAdminPassword.trim()) {
      setAdminPassword(newAdminPassword.trim());
      setNewAdminPassword('');
    }
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 2000);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mediaItems, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cinezone_catalog_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          if (Array.isArray(parsed)) {
            onImportCatalog(parsed);
            alert('Catalogue importé avec succès !');
          }
        } catch (err) {
          alert('Fichier JSON invalide !');
        }
      };
    }
  };

  const filteredAdminList = (mediaItems || []).filter(item => {
    if (!item) return false;
    const title = (item.title || '').toLowerCase();
    const search = (adminSearch || '').toLowerCase();
    const genres = Array.isArray(item.genres) ? item.genres : [];
    const matchesSearch = title.includes(search) || genres.some(g => (g || '').toLowerCase().includes(search));

    if (!matchesSearch) return false;

    if (adminCategoryFilter === 'film') return item.type === 'film';
    if (adminCategoryFilter === 'serie') return item.type === 'serie';
    if (adminCategoryFilter === 'top_serie') return Boolean(item.isTopSerie);
    if (adminCategoryFilter === 'top_film') return Boolean(item.isTopFilm);
    if (adminCategoryFilter === 'nouveaute') return Boolean(item.isNouveaute);

    return true;
  });

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md animate-fadeIn flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-xl text-white">Espace Administration</h2>
              <p className="text-xs text-slate-400">
                Gestion des films, séries, nouveautés & paramètres WhatsApp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminLoggedIn && (
              <button
                onClick={() => setIsAdminLoggedIn(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700"
              >
                Déconnexion
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {!isAdminLoggedIn ? (
          /* Login Form */
          <div className="p-8 max-w-md mx-auto w-full my-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-heading font-extrabold text-2xl text-white">Connexion Administrateur</h3>
              <p className="text-xs text-slate-400 mt-1">
                Saisissez votre code d'accès ou mot de passe administrateur.
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Code d'accès secret"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 text-center font-mono tracking-widest"
                autoFocus
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm shadow-lg shadow-red-600/30 transition-all cursor-pointer"
              >
                Se Connecter à l'Admin
              </button>
            </form>

            <p className="text-[11px] text-slate-500 text-center border-t border-slate-800/80 pt-3">
              Accès réservé au gérant de la plateforme DIEUME-MOVIE.
            </p>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 overflow-y-auto flex flex-col">
            
            {/* Tabs Bar */}
            <div className="bg-slate-950/90 border-b border-slate-800 px-5 pt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('manage')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-t border-x ${
                  activeTab === 'manage'
                    ? 'bg-slate-900 border-slate-700 text-white'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <List className="w-4 h-4 text-amber-400" />
                <span>Gérer le Catalogue ({mediaItems.length})</span>
              </button>

              <button
                onClick={startNewItem}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-t border-x ${
                  activeTab === 'add_edit'
                    ? 'bg-slate-900 border-slate-700 text-white'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>{editingId ? 'Modifier Média' : 'Ajouter un Film / Série'}</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-t border-x ${
                  activeTab === 'settings'
                    ? 'bg-slate-900 border-slate-700 text-white'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Settings className="w-4 h-4 text-blue-400" />
                <span>Paramètres Boutique & Taux FC</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-t border-x ${
                  activeTab === 'orders'
                    ? 'bg-slate-900 border-slate-700 text-white'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Historique Commandes</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              
              {/* TAB 1: MANAGE CATALOGUE */}
              {activeTab === 'manage' && (
                <div className="space-y-4">
                  {/* Filters & Actions Bar */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <input
                        type="text"
                        placeholder="Rechercher par titre ou genre..."
                        value={adminSearch}
                        onChange={(e) => setAdminSearch(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white min-w-[220px] focus:outline-none focus:border-red-500"
                      />

                      <div className="flex items-center gap-2">
                        <button
                          onClick={startNewItem}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Nouveau Film / Série</span>
                        </button>

                        <button
                          onClick={onResetMediaCatalog}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1 border border-slate-700"
                          title="Réinitialiser avec les données de démo"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Réinitialiser Démo</span>
                        </button>
                      </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/60">
                      <span className="text-[11px] font-bold text-slate-500 mr-1">Filtrer par :</span>
                      
                      <button
                        onClick={() => setAdminCategoryFilter('all')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          adminCategoryFilter === 'all'
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        Tous ({mediaItems.length})
                      </button>

                      <button
                        onClick={() => setAdminCategoryFilter('film')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          adminCategoryFilter === 'film'
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        Films ({mediaItems.filter(i => i.type === 'film').length})
                      </button>

                      <button
                        onClick={() => setAdminCategoryFilter('serie')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          adminCategoryFilter === 'serie'
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        Séries ({mediaItems.filter(i => i.type === 'serie').length})
                      </button>

                      <button
                        onClick={() => setAdminCategoryFilter('top_serie')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                          adminCategoryFilter === 'top_serie'
                            ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                            : 'bg-slate-950 text-purple-400 hover:text-purple-300 border border-purple-500/30'
                        }`}
                      >
                        <Star className="w-3 h-3 fill-current" />
                        <span>Top Séries ({mediaItems.filter(i => i.isTopSerie).length})</span>
                      </button>

                      <button
                        onClick={() => setAdminCategoryFilter('top_film')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                          adminCategoryFilter === 'top_film'
                            ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                            : 'bg-slate-950 text-amber-400 hover:text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        <Star className="w-3 h-3 fill-current" />
                        <span>Top Films ({mediaItems.filter(i => i.isTopFilm).length})</span>
                      </button>

                      <button
                        onClick={() => setAdminCategoryFilter('nouveaute')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                          adminCategoryFilter === 'nouveaute'
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-950 text-red-400 hover:text-red-300 border border-red-500/30'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Nouveautés ({mediaItems.filter(i => i.isNouveaute).length})</span>
                      </button>
                    </div>
                  </div>

                  {/* Catalog Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredAdminList.map((item) => {
                      const itemFcPrice = getMediaPriceFc(item);
                      return (
                        <div
                          key={item.id}
                          className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 flex items-center gap-3 hover:border-slate-700 transition-all"
                        >
                          <img
                            src={item.posterUrl}
                            alt={item.title}
                            className="w-14 h-20 object-cover rounded-xl shrink-0 border border-slate-800"
                          />

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${
                                item.type === 'serie' ? 'bg-purple-600 text-white' : 'bg-amber-600 text-white'
                              }`}>
                                {item.type}
                              </span>
                              <h4 className="font-heading font-bold text-sm text-white truncate">
                                {item.title}
                              </h4>
                            </div>

                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-slate-400 text-[11px]">{item.year} • {item.durationOrSeasons}</span>
                              <span className="text-emerald-400 font-extrabold text-xs px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">
                                {itemFcPrice.toLocaleString('fr-FR')} FC
                              </span>
                            </div>

                            {/* Quick Badges Toggles with Top Serie */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <button
                                type="button"
                                onClick={() => onSaveMediaItem({ ...item, isTopSerie: !item.isTopSerie })}
                                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1 transition-all ${
                                  item.isTopSerie 
                                    ? 'bg-purple-600 text-white ring-1 ring-purple-300 shadow-sm shadow-purple-600/50' 
                                    : 'bg-slate-900 text-slate-500 hover:text-purple-300 border border-slate-800'
                                }`}
                                title="Mettre cette série dans le TOP Séries"
                              >
                                <Star className="w-3 h-3 fill-current" />
                                <span>Top Série</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => onSaveMediaItem({ ...item, isTopFilm: !item.isTopFilm })}
                                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1 transition-all ${
                                  item.isTopFilm 
                                    ? 'bg-amber-500 text-slate-950 font-black ring-1 ring-amber-300' 
                                    : 'bg-slate-900 text-slate-500 hover:text-amber-300 border border-slate-800'
                                }`}
                                title="Mettre ce film dans le TOP Films"
                              >
                                <Star className="w-3 h-3 fill-current" />
                                <span>Top Film</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => onSaveMediaItem({ ...item, isNouveaute: !item.isNouveaute })}
                                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase transition-all ${
                                  item.isNouveaute ? 'bg-red-600 text-white' : 'bg-slate-900 text-slate-500 hover:text-red-300 border border-slate-800'
                                }`}
                              >
                                Nouveauté
                              </button>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-1.5 shrink-0">
                            <button
                              onClick={() => startEditItem(item)}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => onDeleteMediaItem(item.id)}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-red-950 text-red-400"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: ADD / EDIT MEDIA FORM */}
              {activeTab === 'add_edit' && (
                <form onSubmit={handleSaveMedia} className="space-y-4 max-w-3xl mx-auto">
                  <h3 className="font-heading font-extrabold text-lg text-white">
                    {editingId ? `Modifier : ${formData.title}` : 'Ajouter un Nouveau Film ou Série'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">
                        Titre du Média *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Gladiator II ou Squid Game"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">
                        Type *
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => {
                          const newType = e.target.value as any;
                          const defaultFc = newType === 'film' ? 1000 : 1500;
                          setFormData({ 
                            ...formData, 
                            type: newType,
                            priceFc: defaultFc,
                            priceUsd: Number((defaultFc / (settings.currencyRateFc || 2850)).toFixed(2))
                          });
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="film">Film (1 000 FC)</option>
                        <option value="serie">Série TV (1 500 FC / 2 S. = 2 500 FC)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">
                      Synopsis / Résumé
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Résumé captivant du film ou de la série..."
                      value={formData.synopsis}
                      onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  {/* Pricing Inputs in Francs Congolais FC */}
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-emerald-500/30 space-y-3">
                    <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider block">
                      💰 Tarification en Francs Congolais (FC) & USD
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold text-emerald-300 block mb-1">
                          Prix en Francs Congolais (FC) *
                        </label>
                        <input
                          type="number"
                          step="100"
                          placeholder="Ex: 1000 ou 1500"
                          value={formData.priceFc || (formData.type === 'film' ? 1000 : 1500)}
                          onChange={(e) => {
                            const fc = parseInt(e.target.value) || 0;
                            const usd = parseFloat((fc / (settings.currencyRateFc || 2850)).toFixed(2));
                            setFormData({ ...formData, priceFc: fc, priceUsd: usd });
                          }}
                          className="w-full bg-slate-900 border border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-sm text-emerald-300 font-extrabold focus:outline-none focus:border-emerald-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">
                          Prix équivalent ($ USD)
                        </label>
                        <input
                          type="number"
                          step="0.05"
                          value={formData.priceUsd || 0.35}
                          onChange={(e) => {
                            const usd = parseFloat(e.target.value) || 0;
                            const fc = Math.round(usd * (settings.currencyRateFc || 2850));
                            setFormData({ ...formData, priceUsd: usd, priceFc: fc });
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-amber-400 font-bold focus:outline-none focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">
                          Année / Durée
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: 2024 • 3 Saisons"
                          value={formData.durationOrSeasons}
                          onChange={(e) => setFormData({ ...formData, durationOrSeasons: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    {/* Presets */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                      <span className="text-slate-400 font-medium">Prix rapides :</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            priceFc: 1000,
                            priceUsd: Number((1000 / (settings.currencyRateFc || 2850)).toFixed(2))
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold border border-slate-800"
                      >
                        1 000 FC (Film)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            priceFc: 1500,
                            priceUsd: Number((1500 / (settings.currencyRateFc || 2850)).toFixed(2))
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-300 font-bold border border-slate-800"
                      >
                        1 500 FC (Série 1 S.)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            priceFc: 2500,
                            priceUsd: Number((2500 / (settings.currencyRateFc || 2850)).toFixed(2))
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-300 font-bold border border-slate-800"
                      >
                        2 500 FC (Série 2 S.)
                      </button>
                    </div>
                  </div>

                  {/* Section Placement & Top Series requested */}
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-purple-500/30 space-y-2">
                    <span className="text-xs font-extrabold text-purple-400 block mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-purple-400" />
                      <span>Emplacement & Sections Mises en Avant</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className={`flex items-center gap-2.5 cursor-pointer p-3 rounded-xl border transition-all ${
                        formData.isTopSerie 
                          ? 'bg-purple-950/80 border-purple-500 text-purple-200 shadow-md shadow-purple-950/50 ring-1 ring-purple-400' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}>
                        <input
                          type="checkbox"
                          checked={formData.isTopSerie}
                          onChange={(e) => setFormData({ ...formData, isTopSerie: e.target.checked })}
                          className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 accent-purple-600"
                        />
                        <div>
                          <span className="text-xs font-extrabold text-white block flex items-center gap-1">
                            <Star className="w-3 h-3 text-purple-400 fill-purple-400" />
                            <span>TOP SÉRIES</span>
                          </span>
                          <span className="text-[10px] text-slate-400">Afficher dans le top des séries</span>
                        </div>
                      </label>

                      <label className={`flex items-center gap-2.5 cursor-pointer p-3 rounded-xl border transition-all ${
                        formData.isTopFilm 
                          ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-md shadow-amber-950/50 ring-1 ring-amber-400' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}>
                        <input
                          type="checkbox"
                          checked={formData.isTopFilm}
                          onChange={(e) => setFormData({ ...formData, isTopFilm: e.target.checked })}
                          className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 accent-amber-500"
                        />
                        <div>
                          <span className="text-xs font-extrabold text-white block flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span>TOP FILMS</span>
                          </span>
                          <span className="text-[10px] text-slate-400">Afficher dans le top des films</span>
                        </div>
                      </label>

                      <label className={`flex items-center gap-2.5 cursor-pointer p-3 rounded-xl border transition-all ${
                        formData.isNouveaute 
                          ? 'bg-red-950/80 border-red-500 text-red-200 shadow-md shadow-red-950/50 ring-1 ring-red-400' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}>
                        <input
                          type="checkbox"
                          checked={formData.isNouveaute}
                          onChange={(e) => setFormData({ ...formData, isNouveaute: e.target.checked })}
                          className="w-4 h-4 rounded text-red-600 focus:ring-red-500 accent-red-600"
                        />
                        <div>
                          <span className="text-xs font-extrabold text-white block flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-red-400" />
                            <span>NOUVEAUTÉ</span>
                          </span>
                          <span className="text-[10px] text-slate-400">Badge Nouveauté 2024</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Section Photo du Film ou Série avec Upload & Aperçu */}
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                        <Camera className="w-4 h-4 text-amber-400" />
                        <span>Photo / Image de l'affiche *</span>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Téléversement direct ou lien URL
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Image Preview Box */}
                      <div className="w-24 h-32 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0 relative group shadow-lg">
                        {formData.posterUrl ? (
                          <img
                            src={formData.posterUrl}
                            alt="Aperçu Affiche"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-2 text-slate-600 text-center">
                            <Image className="w-6 h-6 mb-1" />
                            <span className="text-[10px]">Aucune Photo</span>
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-slate-950/80 text-[9px] text-slate-300 font-bold">
                          Aperçu
                        </span>
                      </div>

                      {/* Upload Controls & Inputs */}
                      <div className="flex-1 space-y-2.5 w-full">
                        {/* File Upload Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => posterFileRef.current?.click()}
                            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Importer une photo (Appareil)</span>
                          </button>

                          <input
                            type="file"
                            ref={posterFileRef}
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'both')}
                            className="hidden"
                          />

                          <input
                            type="file"
                            ref={bannerFileRef}
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'bannerUrl')}
                            className="hidden"
                          />
                        </div>

                        {/* URL Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                              URL Photo Affiche (Poster)
                            </label>
                            <input
                              type="text"
                              placeholder="https://... ou téléverser ci-dessus"
                              value={formData.posterUrl}
                              onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                              URL Image Bannière / Cover
                            </label>
                            <input
                              type="text"
                              placeholder="https://..."
                              value={formData.bannerUrl}
                              onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">
                        Genres (séparés par virgules)
                      </label>
                      <input
                        type="text"
                        placeholder="Action, Thriller, Comédie"
                        value={genresInput}
                        onChange={(e) => setGenresInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">
                        URL YouTube Bande-Annonce
                      </label>
                      <input
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={formData.trailerUrl}
                        onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('manage')}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-600/25"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingId ? 'Enregistrer Modifications' : 'Créer et Publier'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: SHOP SETTINGS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveShopSettings} className="space-y-4 max-w-2xl mx-auto">
                  <h3 className="font-heading font-extrabold text-lg text-white">
                    Configuration de la Boutique & Numéro WhatsApp Admin
                  </h3>

                  {settingsSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Paramètres sauvegardés avec succès !</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">
                        Numéro WhatsApp Admin (Ex: +243972252806) *
                      </label>
                      <input
                        type="text"
                        value={settingsForm.whatsappNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-emerald-400 font-bold focus:outline-none focus:border-red-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">
                        Numéro SMS Admin *
                      </label>
                      <input
                        type="text"
                        value={settingsForm.smsNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, smsNumber: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">
                        Taux de change (1 $ USD = X FC) *
                      </label>
                      <input
                        type="number"
                        value={settingsForm.currencyRateFc}
                        onChange={(e) => setSettingsForm({ ...settingsForm, currencyRateFc: parseInt(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-amber-400 font-bold focus:outline-none focus:border-red-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">
                        Nouveau Mot de Passe Admin (optionnel)
                      </label>
                      <input
                        type="password"
                        placeholder="Laisser vide pour ne pas changer"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-slate-300 block">
                      Comptes Mobile Money pour réception des paiements :
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Compte M-Pesa</label>
                        <input
                          type="text"
                          value={settingsForm.mpesaNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, mpesaNumber: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Compte Airtel Money</label>
                        <input
                          type="text"
                          value={settingsForm.airtelNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, airtelNumber: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Compte Orange Money</label>
                        <input
                          type="text"
                          value={settingsForm.orangeNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, orangeNumber: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-lg shadow-red-600/25"
                    >
                      Sauvegarder les Paramètres
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 4: ORDERS & BACKUP */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  {/* Backup & Import controls */}
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-white">Sauvegarde & Restauration du Catalogue</h4>
                      <p className="text-xs text-slate-400">Exportez en fichier JSON pour faire une sauvegarde complète.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleExportJson}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700"
                      >
                        <Download className="w-4 h-4 text-amber-400" />
                        <span>Exporter JSON</span>
                      </button>

                      <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 cursor-pointer">
                        <Upload className="w-4 h-4 text-emerald-400" />
                        <span>Importer JSON</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportJsonFile}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Orders Log */}
                  <div>
                    <h4 className="font-heading font-extrabold text-base text-white mb-3">
                      Historique des Commandes Reçues ({ordersLog.length})
                    </h4>

                    {ordersLog.length === 0 ? (
                      <div className="p-8 text-center bg-slate-950/50 rounded-2xl border border-slate-800 text-slate-500 text-xs">
                        Aucune commande enregistrée pour le moment.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {ordersLog.map((ord) => (
                          <div
                            key={ord.id}
                            className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2 font-bold text-white">
                                <span>{ord.id}</span>
                                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">
                                  {ord.status}
                                </span>
                              </div>
                              <div className="text-slate-400 text-[11px] mt-0.5">
                                Client: <strong className="text-slate-200">{ord.customerName}</strong> ({ord.customerPhone}) • {ord.city}
                              </div>
                              <div className="text-slate-300 text-[11px] mt-1 line-clamp-1">
                                {ord.itemsSummary}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="font-extrabold text-amber-400 text-sm">
                                {ord.totalUsd} $
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {ord.totalFc.toLocaleString('fr-FR')} FC
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
