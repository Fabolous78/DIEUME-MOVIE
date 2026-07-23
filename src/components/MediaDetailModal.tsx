import React, { useState } from 'react';
import { X, Star, Play, Check, ShoppingBag, HardDrive, Smartphone, Download, MessageSquare, Layers } from 'lucide-react';
import { DeliveryFormat, MediaItem } from '../types';
import { formatFc, formatPriceUsd, getMediaPriceFc, getFormatPriceSurchargeFc, generateWhatsAppUrl, calculateMediaTotalFc } from '../utils/helpers';

interface MediaDetailModalProps {
  item: MediaItem | null;
  onClose: () => void;
  currencyRateFc: number;
  whatsappNumber: string;
  onAddToCart: (item: MediaItem, format: DeliveryFormat, quantity: number, seasons?: number) => void;
  onPlayTrailer: (item: MediaItem) => void;
}

export const MediaDetailModal: React.FC<MediaDetailModalProps> = ({
  item,
  onClose,
  currencyRateFc,
  whatsappNumber,
  onAddToCart,
  onPlayTrailer,
}) => {
  if (!item) return null;

  const [selectedFormat, setSelectedFormat] = useState<DeliveryFormat>('Téléchargement Direct');
  const [selectedSeasons, setSelectedSeasons] = useState<number>(
    item.type === 'serie' && item.durationOrSeasons?.includes('2') ? 2 : 1
  );
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const totalFc = calculateMediaTotalFc(item, quantity, selectedSeasons, selectedFormat);
  const totalPriceUsd = totalFc / currencyRateFc;

  const handleAdd = () => {
    onAddToCart(item, selectedFormat, quantity, selectedSeasons);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleDirectWhatsAppOrder = () => {
    const singleCartItem = [{ media: item, quantity, selectedFormat, selectedSeasons }];
    const dummyCustomer = {
      name: 'Client Direct',
      phone: '',
      city: 'Bukavu',
      address: '',
      paymentMethod: 'M-Pesa' as const,
      note: 'Commande rapide depuis la fiche produit',
    };
    const waUrl = generateWhatsAppUrl(whatsappNumber, singleCartItem, dummyCustomer, totalPriceUsd, currencyRateFc);
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80 backdrop-blur-sm transition-all"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with Backdrop */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0 bg-slate-950">
          <img
            src={item.bannerUrl || item.posterUrl}
            alt={item.title}
            className="w-full h-full object-cover object-center filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-transparent to-transparent" />

          {/* Floating Badges */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4 z-10">
            <div className="flex items-center gap-4">
              <img
                src={item.posterUrl}
                alt={item.title}
                className="w-24 sm:w-32 aspect-[2/3] object-cover rounded-xl border-2 border-slate-700 shadow-xl hidden sm:block"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                    item.type === 'serie' ? 'bg-purple-600 text-white' : 'bg-amber-600 text-white'
                  }`}>
                    {item.type === 'serie' ? 'Série TV' : 'Film Cinéma'}
                  </span>
                  
                  {item.isTopFilm && (
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-amber-500 text-slate-950 uppercase">
                      Top Film
                    </span>
                  )}

                  {item.isTopSerie && (
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-purple-500 text-white uppercase">
                      Top Série
                    </span>
                  )}

                  {item.isNouveaute && (
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-red-600 text-white uppercase">
                      Nouveauté
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-white font-heading tracking-tight">
                  {item.title}
                </h2>

                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300 font-medium mt-1">
                  <span>{item.year}</span>
                  <span>•</span>
                  <span>{item.durationOrSeasons}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{item.rating} / 5</span>
                  </div>
                </div>
              </div>
            </div>

            {item.trailerUrl && (
              <button
                onClick={() => onPlayTrailer(item)}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Bande-Annonce</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          
          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {item.genres.map((g, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                {g}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
              Synopsis & Histoire
            </h3>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              {item.synopsis}
            </p>
          </div>

          {/* Series Season Selection Pack (If Serie) */}
          {item.type === 'serie' && (
            <div className="space-y-3 bg-purple-950/30 p-4 rounded-2xl border border-purple-800/50">
              <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Option de Séries & Formule Tarifaire</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { seasons: 1, label: '1 Saison', price: '1 500 FC', desc: '1 saison complète HD/4K' },
                  { seasons: 2, label: 'Pack 2 Saisons', price: '2 500 FC', desc: 'Offre Spéciale (-500 FC !)', popular: true },
                  { seasons: 3, label: '3 Saisons ou +', price: '3 500 FC', desc: 'Intégrale ou plusieurs saisons' },
                ].map((opt) => (
                  <button
                    key={opt.seasons}
                    type="button"
                    onClick={() => setSelectedSeasons(opt.seasons)}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all relative ${
                      selectedSeasons === opt.seasons
                        ? 'bg-purple-900/60 border-purple-500 ring-2 ring-purple-500/30 text-white'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    {opt.popular && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-slate-950 uppercase shadow-md">
                        Super Prix
                      </span>
                    )}
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-white">{opt.label}</span>
                      <span className="font-black text-amber-400 text-sm">{opt.price}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            {item.director && (
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-1">Réalisateur</span>
                <span className="text-white font-bold">{item.director}</span>
              </div>
            )}

            {item.cast && item.cast.length > 0 && (
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-1">Acteurs Principaux</span>
                <span className="text-white font-medium">{item.cast.join(', ')}</span>
              </div>
            )}

            {item.audioLanguages && item.audioLanguages.length > 0 && (
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-1">Langues & Audio</span>
                <span className="text-emerald-400 font-bold">{item.audioLanguages.join(' | ')}</span>
              </div>
            )}

            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-semibold block mb-1">Qualité Vidéo</span>
              <span className="text-amber-400 font-bold">Full HD 1080p / 4K Ultra HD</span>
            </div>
          </div>

          {/* Delivery Format Options */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>Choisir le Support de Réception</span>
              <span className="text-xs font-normal text-amber-400">
                Prix de base: {formatFc(baseFc)}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { name: 'Téléchargement Direct' as DeliveryFormat, icon: Download, desc: 'Lien direct ou Google Drive' },
                { name: 'Clé USB' as DeliveryFormat, icon: HardDrive, desc: 'Transfert sur Clé USB' },
                { name: 'Transfert Téléphone' as DeliveryFormat, icon: Smartphone, desc: 'Transfert Bluetooth / OTG sur place' },
              ].map((fmt) => {
                const Icon = fmt.icon;
                const isSelected = selectedFormat === fmt.name;
                return (
                  <button
                    key={fmt.name}
                    type="button"
                    onClick={() => setSelectedFormat(fmt.name)}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-red-950/40 border-red-500 ring-2 ring-red-500/20 text-white'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-red-400' : 'text-slate-400'}`} />
                      {isSelected && <Check className="w-4 h-4 text-red-500" />}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{fmt.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{fmt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div>
              <span className="text-sm font-bold text-white block">Quantité de copies</span>
              <span className="text-xs text-slate-400">Nombre d'exemplaires désirés</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg flex items-center justify-center transition-colors"
              >
                -
              </button>
              <span className="text-lg font-black text-white w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer Bar */}
        <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Total à payer</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-400">
                {formatFc(totalFc)}
              </span>
              <span className="text-xs font-bold text-slate-400">
                (~ {formatPriceUsd(totalPriceUsd)})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleAdd}
              className={`flex-1 sm:flex-none px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Ajouté !</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Ajouter au Panier</span>
                </>
              )}
            </button>

            <button
              onClick={handleDirectWhatsAppOrder}
              className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Commander WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
