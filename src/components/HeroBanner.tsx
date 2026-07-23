import React, { useState, useEffect } from 'react';
import { Play, Plus, Star, Sparkles, ChevronLeft, ChevronRight, Check, Info } from 'lucide-react';
import { MediaItem } from '../types';
import { formatPriceFc, formatPriceUsd, formatFc, getMediaPriceFc } from '../utils/helpers';

interface HeroBannerProps {
  featuredItems: MediaItem[];
  currencyRateFc: number;
  onSelectItem: (item: MediaItem) => void;
  onAddToCart: (item: MediaItem) => void;
  onPlayTrailer: (item: MediaItem) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredItems,
  currencyRateFc,
  onSelectItem,
  onAddToCart,
  onPlayTrailer,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    if (featuredItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredItems.length]);

  if (!featuredItems || featuredItems.length === 0) return null;

  const currentMedia = featuredItems[currentIndex] || featuredItems[0];

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(currentMedia);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1800);
  };

  return (
    <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[640px] overflow-hidden bg-slate-950 rounded-2xl sm:rounded-3xl my-4 sm:my-6 border border-slate-800/80 shadow-2xl group">
      {/* Background Image with Cinematic Overlay */}
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
        <img
          src={currentMedia.bannerUrl || currentMedia.posterUrl}
          alt={currentMedia.title}
          className="w-full h-full object-cover object-top scale-105 filter brightness-90 group-hover:scale-100 transition-transform duration-1000"
        />
        {/* Gradients to darken edges for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent w-full md:w-3/4" />
      </div>

      {/* Content Area */}
      <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-10 flex flex-col justify-end pb-10 sm:pb-14 z-10">
        
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-600 text-white shadow-lg shadow-red-600/30">
            <Sparkles className="w-3.5 h-3.5" />
            À LA UNE
          </span>

          {currentMedia.type === 'serie' ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
              Série
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Film
            </span>
          )}

          {currentMedia.isNouveaute && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Nouveauté {currentMedia.year}
            </span>
          )}

          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900/90 text-amber-400 font-bold text-xs border border-amber-500/30">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{currentMedia.rating} / 5</span>
          </div>

          <span className="text-slate-300 text-xs font-medium">
            {currentMedia.durationOrSeasons}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-heading tracking-tight mb-3 drop-shadow-md">
          {currentMedia.title}
        </h1>

        {/* Synopsis */}
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl line-clamp-2 sm:line-clamp-3 mb-6 font-normal leading-relaxed text-shadow-sm">
          {currentMedia.synopsis}
        </p>

        {/* Price Tag & Action buttons */}
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Price display */}
          <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700/80 flex items-center gap-3">
            <div>
              <span className="text-xs text-slate-400 font-medium block">Prix unitaire</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-emerald-400">
                  {formatFc(getMediaPriceFc(currentMedia, 1))}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  ({formatPriceUsd(currentMedia.priceUsd)})
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Play Trailer */}
            {currentMedia.trailerUrl && (
              <button
                onClick={() => onPlayTrailer(currentMedia)}
                className="px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-sm flex items-center gap-2 border border-slate-600 transition-all shadow-md active:scale-95"
              >
                <Play className="w-4 h-4 fill-white text-white" />
                <span>Bande-Annonce</span>
              </button>
            )}

            {/* More details */}
            <button
              onClick={() => onSelectItem(currentMedia)}
              className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm flex items-center gap-2 border border-slate-700 transition-all active:scale-95"
            >
              <Info className="w-4 h-4 text-slate-400" />
              <span>Info & Formats</span>
            </button>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCartClick}
              className={`px-6 py-3 rounded-xl font-extrabold text-sm flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
                addedAnimation
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Ajouté au panier !</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Ajouter au Panier</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows for Banner Carousel */}
      {featuredItems.length > 1 && (
        <div className="absolute right-6 bottom-6 z-20 flex items-center gap-2">
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length)}
            className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 backdrop-blur-sm transition-all"
            aria-label="Précédent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1.5 px-2">
            {featuredItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'w-6 bg-red-600' : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % featuredItems.length)}
            className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 backdrop-blur-sm transition-all"
            aria-label="Suivant"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
