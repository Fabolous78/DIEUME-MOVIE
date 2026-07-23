import React, { useState } from 'react';
import { Star, Play, Plus, Check, Info, Flame, Tv, Film, Edit, Trash2 } from 'lucide-react';
import { MediaItem } from '../types';
import { formatFc, formatPriceUsd, getMediaPriceFc } from '../utils/helpers';

interface MediaCardProps {
  item: MediaItem;
  currencyRateFc: number;
  onSelectItem: (item: MediaItem) => void;
  onAddToCart: (item: MediaItem) => void;
  onPlayTrailer?: (item: MediaItem) => void;
  isAdminLoggedIn?: boolean;
  onAdminEdit?: (item: MediaItem) => void;
  onAdminDelete?: (id: string) => void;
  onAdminToggleBadge?: (id: string, badgeType: 'isTopFilm' | 'isTopSerie' | 'isNouveaute') => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  currencyRateFc,
  onSelectItem,
  onAddToCart,
  onPlayTrailer,
  isAdminLoggedIn,
  onAdminEdit,
  onAdminDelete,
  onAdminToggleBadge,
}) => {
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      onClick={() => onSelectItem(item)}
      className="group relative bg-slate-900/90 rounded-2xl border border-slate-800/90 overflow-hidden hover:border-slate-700 hover:shadow-xl hover:shadow-red-950/20 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
        <img
          src={item.posterUrl}
          alt={item.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Badges top overlay */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex flex-wrap gap-1.5 justify-between items-start z-10">
          <div className="flex flex-col gap-1">
            {item.type === 'serie' ? (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-600/90 text-white shadow-md uppercase tracking-wider">
                Série
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-600/90 text-white shadow-md uppercase tracking-wider">
                Film
              </span>
            )}

            {item.isTopFilm && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md flex items-center gap-1 uppercase">
                <Film className="w-3 h-3" /> Top Film
              </span>
            )}

            {item.isTopSerie && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md flex items-center gap-1 uppercase">
                <Tv className="w-3 h-3" /> Top Série
              </span>
            )}

            {item.isNouveaute && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-red-600 text-white shadow-md flex items-center gap-1 uppercase">
                <Flame className="w-3 h-3" /> Nouveauté
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-amber-400 font-bold text-xs border border-amber-500/30">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>{item.rating}</span>
          </div>
        </div>

        {/* Play Trailer Icon Overlay */}
        {item.trailerUrl && onPlayTrailer && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayTrailer(item);
            }}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
            title="Regarder la bande-annonce"
          >
            <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg shadow-red-600/50 hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </div>
          </button>
        )}

        {/* Audio Quality indicator at bottom of poster */}
        <div className="absolute bottom-2 left-2.5 right-2.5 z-10 flex items-center justify-between text-[11px] font-semibold text-slate-300">
          <span className="px-1.5 py-0.5 rounded bg-slate-950/80 backdrop-blur-sm border border-slate-700/80">
            {item.year}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-950/80 backdrop-blur-sm border border-slate-700/80 truncate max-w-[110px]">
            {item.durationOrSeasons}
          </span>
        </div>
      </div>

      {/* Card Info Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <h3 className="font-heading font-bold text-base sm:text-lg text-white group-hover:text-red-400 transition-colors line-clamp-1">
            {item.title}
          </h3>
          
          <div className="flex flex-wrap gap-1 mt-1.5">
            {item.genres.slice(0, 2).map((g, idx) => (
              <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            {item.type === 'film' ? (
              <>
                <div className="text-xs font-black text-amber-400">
                  1 000 FC <span className="text-[10px] text-slate-400 font-normal">(1 Film)</span>
                </div>
                <div className="text-[10px] font-bold text-emerald-400">
                  2 Films = 1 500 FC
                </div>
              </>
            ) : (
              <>
                <div className="text-xs font-black text-purple-300">
                  1 500 FC <span className="text-[10px] text-slate-400 font-normal">(1 Série / 1 S.)</span>
                </div>
                <div className="text-[10px] font-bold text-amber-400">
                  2 Séries = 2 500 FC
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectItem(item);
              }}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Voir détails"
            >
              <Info className="w-4 h-4" />
            </button>

            <button
              onClick={handleAddToCart}
              className={`p-2 rounded-lg text-white font-bold text-xs flex items-center gap-1 transition-all ${
                added ? 'bg-emerald-600' : 'bg-red-600 hover:bg-red-500 shadow-md shadow-red-600/20'
              }`}
              title="Ajouter au panier"
            >
              {added ? (
                <Check className="w-4 h-4" />
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Panier</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Admin controls row if logged in */}
        {isAdminLoggedIn && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-2 pt-2 border-t border-red-900/40 bg-slate-950/60 -mx-3.5 -mb-3.5 p-2 flex items-center justify-between gap-1 text-[11px]"
          >
            <div className="flex items-center gap-1">
              <button
                onClick={() => onAdminToggleBadge && onAdminToggleBadge(item.id, 'isTopFilm')}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  item.isTopFilm ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
                title="Basculer Top Film"
              >
                Top Film
              </button>
              <button
                onClick={() => onAdminToggleBadge && onAdminToggleBadge(item.id, 'isTopSerie')}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  item.isTopSerie ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
                title="Basculer Top Série"
              >
                Top Série
              </button>
              <button
                onClick={() => onAdminToggleBadge && onAdminToggleBadge(item.id, 'isNouveaute')}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  item.isNouveaute ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
                title="Basculer Nouveauté"
              >
                Nouv.
              </button>
            </div>

            <div className="flex items-center gap-1">
              {onAdminEdit && (
                <button
                  onClick={() => onAdminEdit(item)}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300"
                  title="Éditer"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              )}
              {onAdminDelete && (
                <button
                  onClick={() => onAdminDelete(item.id)}
                  className="p-1 rounded bg-slate-800 hover:bg-red-900/60 text-red-400"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
