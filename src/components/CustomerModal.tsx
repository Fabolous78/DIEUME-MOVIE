import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  LogOut, 
  ShoppingBag, 
  Package, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MessageSquare, 
  Sparkles, 
  Save, 
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { OrderRecord, ShopSettings } from '../types';
import { 
  getStoredCustomerName, 
  setStoredCustomerName, 
  clearStoredCustomerName,
  getStoredCustomerProfile,
  saveCustomerProfile,
  getStoredOrders,
  formatFc,
  formatPriceUsd
} from '../utils/helpers';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  onLoginCustomer: (name: string) => void;
  onLogoutCustomer: () => void;
  settings: ShopSettings;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  customerName,
  onLoginCustomer,
  onLogoutCustomer,
  settings,
}) => {
  const [inputName, setInputName] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'contact'>('orders');
  
  // Profile state
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Bukavu');
  const [address, setAddress] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Orders state
  const [myOrders, setMyOrders] = useState<OrderRecord[]>([]);

  useEffect(() => {
    if (customerName) {
      // Load saved customer profile if exists
      const savedProfile = getStoredCustomerProfile(customerName);
      if (savedProfile) {
        setPhone(savedProfile.phone || '');
        setCity(savedProfile.city || 'Bukavu');
        setAddress(savedProfile.address || '');
      }

      // Load customer orders from stored orders
      const allOrders = getStoredOrders();
      const filtered = allOrders.filter(
        (o) => o.customerName.trim().toLowerCase() === customerName.trim().toLowerCase()
      );
      setMyOrders(filtered);
    }
  }, [customerName, isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) return;
    onLoginCustomer(inputName.trim());
    setInputName('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName) return;
    saveCustomerProfile({
      name: customerName,
      phone,
      city,
      address,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const getStatusBadge = (status: OrderRecord['status']) => {
    switch (status) {
      case 'Livrée':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3" />
            <span>Livrée</span>
          </span>
        );
      case 'En cours':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Truck className="w-3 h-3" />
            <span>En cours de livraison</span>
          </span>
        );
      case 'Envoyée SMS':
      case 'Envoyée WhatsApp':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/40">
            <Clock className="w-3 h-3" />
            <span>Commande reçue</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header Bar */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-600/20 text-white font-extrabold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-lg text-white flex items-center gap-2">
                <span>Espace Client DIEUME-MOVIE</span>
                {customerName && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                    Connecté
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                {customerName 
                  ? `Compte : ${customerName}` 
                  : 'Connectez-vous avec votre Nom uniquement'
                }
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        {!customerName ? (
          /* FORMULARIE DE CONNEXION AVEC NOM UNIQUEMENT */
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
            <div className="text-center space-y-2 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-3xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <User className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white">
                Identifiez-vous pour accéder à vos commandes
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Pas besoin de mot de passe compliqué ! Saisissez simplement votre <strong>Nom</strong> pour retrouver vos commandes et sauvegarder votre adresse à Bukavu/Bagira.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="max-w-md mx-auto space-y-4">
              <div>
                <label className="text-xs font-semibold text-white block mb-1.5">
                  Saisissez votre Nom complet <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Ex: Fabrice, Jean-Luc, Mme Sarah..."
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-red-500 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Se connecter à mon Espace Client</span>
              </button>
            </form>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 max-w-md mx-auto text-center space-y-1">
              <p className="text-[11px] text-slate-400">
                💡 <strong>Astuce :</strong> Vos informations restent enregistrées sur votre téléphone pour vos prochaines visites.
              </p>
            </div>
          </div>
        ) : (
          /* ESPACE CLIENT CONNECTÉ */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* User Bar & Tab Nav */}
            <div className="bg-slate-950/50 px-6 pt-4 border-b border-slate-800 space-y-4 shrink-0">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold text-sm">
                    {customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{customerName}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Client CineFab Bukavu/Bagira</div>
                  </div>
                </div>

                <button
                  onClick={onLogoutCustomer}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-900/50 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Se déconnecter</span>
                </button>
              </div>

              {/* Tabs */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
                    activeTab === 'orders'
                      ? 'border-red-500 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-red-400" />
                  <span>Mes Commandes ({myOrders.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
                    activeTab === 'profile'
                      ? 'border-red-500 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Mon Adresse & Contact</span>
                </button>

                <button
                  onClick={() => setActiveTab('contact')}
                  className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
                    activeTab === 'contact'
                      ? 'border-red-500 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Contact Shop</span>
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {/* TAB 1: MES COMMANDES */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {myOrders.length === 0 ? (
                    <div className="text-center py-12 bg-slate-950/40 rounded-3xl border border-slate-800/80 p-6 space-y-3">
                      <Package className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                      <h4 className="font-heading font-bold text-white text-base">
                        Aucune commande enregistrée sous le nom "{customerName}"
                      </h4>
                      <p className="text-slate-400 text-xs max-w-md mx-auto">
                        Toutes les commandes que vous effectuerez sur CineFab s'afficheront ici en temps réel avec leur statut.
                      </p>
                      <button
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg"
                      >
                        Parcourir les films & séries
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myOrders.map((ord) => (
                        <div
                          key={ord.id}
                          className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3 hover:border-slate-700 transition-all"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                            <div>
                              <span className="text-[11px] font-mono font-bold text-slate-400">
                                #{ord.id}
                              </span>
                              <span className="text-[11px] text-slate-500 ml-2">
                                {ord.date}
                              </span>
                            </div>
                            {getStatusBadge(ord.status)}
                          </div>

                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-white uppercase tracking-wider text-slate-300">
                              Articles commandés :
                            </h5>
                            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-2.5 rounded-xl border border-slate-800/60 font-mono whitespace-pre-line">
                              {ord.itemsSummary}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                            <div>
                              <span className="text-[11px] text-slate-400 block">Total payé</span>
                              <span className="text-sm font-black text-amber-400">
                                {formatFc(ord.totalFc)} <span className="text-[10px] text-slate-400 font-normal">(~ {formatPriceUsd(ord.totalUsd)})</span>
                              </span>
                            </div>

                            <a
                              href={`https://wa.me/${settings.whatsappNumber.replace(/[^\d]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Contacter WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MON PROFIL & ADRESSE */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg mx-auto">
                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <span>Adresse de livraison par défaut</span>
                    </h4>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Votre Nom Client (Inchangeable)
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        disabled
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-white block mb-1">
                        Numéro WhatsApp habituel
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: +243 97 225 2806"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-white block mb-1">
                          Ville
                        </label>
                        <select
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                        >
                          <option value="Bukavu">Bukavu</option>
                          <option value="Bagira (Bukavu)">Bagira (Bukavu)</option>
                          <option value="Goma">Goma</option>
                          <option value="Kinshasa">Kinshasa</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-white block mb-1">
                          Quartier / Avenue / Repère
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Bagira / Q. Lumumba"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  {savedSuccess && (
                    <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Profil et adresse pré-remplie sauvegardés avec succès !</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer mon Profil</span>
                  </button>
                </form>
              )}

              {/* TAB 3: CONTACT & INFOS */}
              {activeTab === 'contact' && (
                <div className="space-y-4 max-w-lg mx-auto">
                  <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-white text-sm">
                          Service Client CineFab Bukavu/Bagira
                        </h4>
                        <p className="text-xs text-slate-400">
                          Transfert sur Clé USB, Téléphone et Téléchargement
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <a
                        href={`https://wa.me/${settings.whatsappNumber.replace(/[^\d]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-between transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          <span>WhatsApp Direct : {settings.whatsappNumber}</span>
                        </div>
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <a
                        href={`tel:${settings.smsNumber}`}
                        className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-between transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-400" />
                          <span>Appel / SMS Direct : {settings.smsNumber}</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>
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
