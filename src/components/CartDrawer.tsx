import React, { useState, useEffect } from 'react';
import { X, Trash2, ShoppingBag, MessageSquare, Send, Copy, Check, AlertCircle, User, CreditCard } from 'lucide-react';
import { CartItem, CustomerDetails, DeliveryFormat, ShopSettings } from '../types';
import { 
  calculateCartTotal, 
  calculateCartTotalFc, 
  calculateCartItemTotalFc, 
  getMediaPriceFc,
  getFormatPriceSurchargeFc,
  formatFc, 
  formatPriceUsd, 
  generateWhatsAppUrl, 
  generateSmsUrl, 
  generateOrderTextSummary, 
  saveOrder,
  getStoredCustomerProfile,
  saveCustomerProfile,
  setStoredCustomerName
} from '../utils/helpers';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onUpdateFormat: (index: number, newFormat: DeliveryFormat) => void;
  onUpdateSeasons?: (index: number, seasons: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  settings: ShopSettings;
  customerName?: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onUpdateFormat,
  onUpdateSeasons,
  onRemoveItem,
  onClearCart,
  settings,
  customerName,
}) => {
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: customerName || '',
    phone: '',
    city: 'Bukavu',
    address: '',
    paymentMethod: 'M-Pesa',
    note: '',
  });

  useEffect(() => {
    if (customerName) {
      const savedProfile = getStoredCustomerProfile(customerName);
      setCustomer((prev) => ({
        ...prev,
        name: customerName,
        phone: savedProfile?.phone || prev.phone,
        city: savedProfile?.city || prev.city || 'Bukavu',
        address: savedProfile?.address || prev.address,
      }));
    }
  }, [customerName, isOpen]);

  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const totalFc = calculateCartTotalFc(cart);
  const totalUsd = totalFc / settings.currencyRateFc;

  const validateCustomer = () => {
    if (!customer.name.trim()) {
      setErrorMsg('Veuillez obligatoirement indiquer votre Nom complet');
      return false;
    }
    if (!customer.address.trim()) {
      setErrorMsg('Veuillez obligatoirement indiquer le Lieu de livraison (Quartier, Avenue ou Repère)');
      return false;
    }
    if (!customer.phone.trim()) {
      setErrorMsg('Veuillez indiquer votre numéro de téléphone');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const recordOrderToHistory = (status: 'Envoyée WhatsApp' | 'Envoyée SMS') => {
    // Save customer name and profile
    if (customer.name.trim()) {
      setStoredCustomerName(customer.name.trim());
      saveCustomerProfile({
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        city: customer.city,
        address: customer.address.trim(),
      });
    }

    const orderRecord = {
      id: 'CMD-' + Date.now().toString().slice(-6),
      date: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      customerName: customer.name.trim(),
      customerPhone: customer.phone.trim(),
      city: customer.city,
      itemsSummary: cart.map(i => `${i.media.title} (${i.selectedFormat}${i.selectedSeasons ? ` • ${i.selectedSeasons} S.` : ''}) x${i.quantity}`).join(', '),
      totalUsd,
      totalFc,
      status,
    };
    saveOrder(orderRecord);
  };

  const handleWhatsAppOrder = () => {
    if (!validateCustomer()) return;
    recordOrderToHistory('Envoyée WhatsApp');
    const waUrl = generateWhatsAppUrl(
      settings.whatsappNumber,
      cart,
      customer,
      totalUsd,
      settings.currencyRateFc
    );
    window.open(waUrl, '_blank');
  };

  const handleSmsOrder = () => {
    if (!validateCustomer()) return;
    recordOrderToHistory('Envoyée SMS');
    const smsUrl = generateSmsUrl(
      settings.smsNumber,
      cart,
      customer,
      totalUsd,
      settings.currencyRateFc
    );
    window.open(smsUrl, '_blank');
  };

  const handleCopyText = () => {
    const text = generateOrderTextSummary(
      cart,
      customer,
      totalUsd,
      settings.currencyRateFc
    );
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md animate-fadeIn flex justify-end">
      <div
        className="relative w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600/20 border border-red-500/30 text-red-500">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-xl text-white">Mon Panier</h2>
              <p className="text-xs text-slate-400">
                {cart.length} article{cart.length > 1 ? 's' : ''} sélectionné{cart.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-lg text-white">Votre panier est vide</h3>
              <p className="text-sm text-slate-400 max-w-xs mx-auto">
                Explorez le catalogue de films et séries et ajoutez vos titres préférés.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/25"
              >
                Découvrir les Films
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Films & Séries</span>
                  <button
                    onClick={onClearCart}
                    className="text-red-400 hover:underline flex items-center gap-1"
                  >
                    Vider le panier
                  </button>
                </div>

                {cart.map((item, idx) => {
                  const lineTotalFc = calculateCartItemTotalFc(item);
                  return (
                    <div
                      key={idx}
                      className="bg-slate-950/70 rounded-2xl p-3.5 border border-slate-800 flex gap-3 relative group"
                    >
                      <img
                        src={item.media.posterUrl}
                        alt={item.media.title}
                        className="w-16 h-22 object-cover rounded-xl border border-slate-800 shrink-0"
                      />

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-heading font-bold text-sm text-white line-clamp-1">
                              {item.media.title}
                            </h4>
                            <button
                              onClick={() => onRemoveItem(idx)}
                              className="text-slate-500 hover:text-red-400 p-1"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="text-[11px] text-slate-400">
                            {item.media.type === 'serie' ? 'Série' : 'Film'} ({item.media.year})
                          </div>
                        </div>

                        {/* Series seasons choice if serie */}
                        {item.media.type === 'serie' && onUpdateSeasons && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-[10px] text-purple-300 font-bold uppercase">Formule:</span>
                            <select
                              value={item.selectedSeasons || 1}
                              onChange={(e) => onUpdateSeasons(idx, parseInt(e.target.value, 10))}
                              className="bg-purple-950/80 border border-purple-700/80 text-purple-200 text-xs rounded-lg px-2 py-0.5 font-bold focus:outline-none"
                            >
                              <option value={1}>1 Saison (1 500 FC)</option>
                              <option value={2}>Pack 2 Saisons (2 500 FC)</option>
                              <option value={3}>3 Saisons (3 500 FC)</option>
                            </select>
                          </div>
                        )}

                        {/* Format selector inside item */}
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                          <select
                            value={item.selectedFormat}
                            onChange={(e) => onUpdateFormat(idx, e.target.value as DeliveryFormat)}
                            className="bg-slate-900 border border-slate-700/80 text-slate-200 text-xs rounded-lg px-2 py-1 font-medium focus:outline-none focus:border-red-500"
                          >
                            <option value="Téléchargement Direct">Lien Direct / Google Drive</option>
                            <option value="Clé USB">Clé USB</option>
                            <option value="Transfert Téléphone">Transfert Téléphone / Bluetooth</option>
                            <option value="DVD / Blu-Ray">DVD / Blu-Ray</option>
                            <option value="Disque Dur Externe">Disque Dur Externe</option>
                          </select>

                          {/* Quantity controls */}
                          <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-1 border border-slate-800">
                            <button
                              onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                              className="w-5 h-5 rounded bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold text-white px-1">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                              className="w-5 h-5 rounded bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="mt-1.5 text-right">
                          <span className="text-sm font-black text-amber-400">
                            {formatFc(lineTotalFc)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Customer Details Form */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-red-500" />
                  <span>Vos Coordonnées de Livraison</span>
                </h3>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-white block mb-1">
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Patient Kabasele"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white block mb-1">
                      Téléphone WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: +243 97 000 0000"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1">
                      Ville en RDC
                    </label>
                    <select
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="Bukavu">Bukavu</option>
                      <option value="Bagira (Bukavu)">Bagira (Bukavu)</option>
                      <option value="Goma">Goma</option>
                      <option value="Kinshasa">Kinshasa</option>
                      <option value="Lubumbashi">Lubumbashi</option>
                      <option value="Autre ville RDC">Autre ville RDC</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1">
                      Mode de Paiement Intention
                    </label>
                    <select
                      value={customer.paymentMethod}
                      onChange={(e) => setCustomer({ ...customer, paymentMethod: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="M-Pesa">M-Pesa</option>
                      <option value="Airtel Money">Airtel Money</option>
                      <option value="Orange Money">Orange Money</option>
                      <option value="Cash à la livraison">Cash à la livraison</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white block mb-1">
                    Lieu de livraison (Quartier, Avenue ou Repère) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Bagira / Q. Lumumba, Av. Nyakavogo près de l'église"
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
              </div>

              {/* Mobile Money info block */}
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 text-xs space-y-1.5">
                <span className="font-bold text-amber-400 block flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  Comptes Mobile Money pour le Paiement :
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-[11px] text-slate-300">
                  <div><strong>M-Pesa:</strong> {settings.mpesaNumber}</div>
                  <div><strong>Airtel:</strong> {settings.airtelNumber}</div>
                  <div><strong>Orange:</strong> {settings.orangeNumber}</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {cart.length > 0 && (
          <div className="p-5 bg-slate-950 border-t border-slate-800 space-y-4">
            
            {/* Total recap */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300 font-medium">Total de la commande :</span>
              <div className="text-right">
                <div className="text-2xl font-black text-amber-400">
                  {formatFc(totalFc)}
                </div>
                <div className="text-xs font-bold text-slate-400">
                  ~ {formatPriceUsd(totalUsd)}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all active:scale-[0.98]"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Envoyer par WhatsApp ({settings.whatsappNumber})</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleSmsOrder}
                  className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer par SMS</span>
                </button>

                <button
                  onClick={handleCopyText}
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copier le résumé</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
